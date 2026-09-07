import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Thin proxy to JoeyBackend's `/chat`.
 *
 * All persona / mode / model / generation logic now lives in JoeyBackend.
 * This route only:
 *   - shape-checks the request,
 *   - forwards `{ messages, mode }` to JoeyBackend,
 *   - converts JoeyBackend's NDJSON stream (`{"delta":"..."}` /
 *     `{"done":true}` / `{"error":{...}}`) into the plain-text delta stream
 *     the client already consumes.
 */

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 16_000;
const UPSTREAM_TIMEOUT_MS = 120_000;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_CONTENT_LENGTH
  );
}

function normaliseBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function textStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    },
  });
}

/**
 * NDJSON (from JoeyBackend) -> plain-text delta stream (to the client).
 * Throws if the backend sends an `{"error":...}` line.
 */
function ndjsonToTextStream(
  upstream: Response,
): ReadableStream<Uint8Array> {
  if (!upstream.body) {
    throw new Error("JoeyBackend returned an empty stream");
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  function handleLine(
    controller: ReadableStreamDefaultController<Uint8Array>,
    line: string,
  ) {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    let event: unknown;
    try {
      event = JSON.parse(trimmed);
    } catch {
      return;
    }

    if (!event || typeof event !== "object") {
      return;
    }

    const record = event as Record<string, unknown>;
    if (typeof record.delta === "string" && record.delta.length > 0) {
      controller.enqueue(encoder.encode(record.delta));
    } else if (record.error) {
      controller.error(new Error("JoeyBackend reported an error"));
    }
    // `{ done: true }` needs no action — the stream closes on its own.
  }

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { value, done } = await reader.read();

      if (value) {
        buffer += decoder.decode(value, { stream: true });
      }
      if (done) {
        buffer += decoder.decode();
      }

      const lines = buffer.split(/\r?\n/);
      buffer = done ? "" : (lines.pop() ?? "");

      for (const line of lines) {
        handleLine(controller, line);
      }
      if (done && buffer) {
        handleLine(controller, buffer);
      }

      if (done) {
        controller.close();
      }
    },
    cancel() {
      return reader.cancel();
    },
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const record =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const messages = record.messages;
  const mode = typeof record.mode === "string" ? record.mode : undefined;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    !messages.every(isChatMessage)
  ) {
    return NextResponse.json(
      { error: "Messages must be a non-empty valid chat message array." },
      { status: 400 },
    );
  }

  const baseUrlValue = process.env.JOEYBACKEND_URL?.trim();
  const localMockRequested = process.env.JOEYBACKEND_MOCK_MODE === "true";
  const localPreview =
    process.env.NODE_ENV !== "production" &&
    (localMockRequested || !baseUrlValue);

  if (localPreview) {
    return new Response(textStream("Local preview response."), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Mode": "mock",
      },
    });
  }

  if (!baseUrlValue) {
    return NextResponse.json(
      { error: "JoeyBackend is not configured." },
      { status: 503 },
    );
  }

  const baseUrl = normaliseBaseUrl(baseUrlValue);

  try {
    const upstream = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, ...(mode ? { mode } : {}) }),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      const detail = (await upstream
        .json()
        .catch(() => null)) as { error?: { message?: string } } | null;
      const message = detail?.error?.message;
      return NextResponse.json(
        { error: message ?? "JoeyBackend rejected the request." },
        { status: upstream.status === 400 ? 400 : 502 },
      );
    }

    return new Response(ndjsonToTextStream(upstream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Mode": "live",
      },
    });
  } catch (error) {
    console.error(
      "JoeyBackend proxy error:",
      error instanceof Error ? error.message : "Unknown upstream error",
    );
    return NextResponse.json(
      { error: "Could not reach JoeyBackend. Please try again." },
      { status: 502 },
    );
  }
}
