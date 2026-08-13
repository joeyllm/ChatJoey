import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ModelsResponse = {
  data?: Array<{ id?: unknown }>;
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
    (message.role === "system" ||
      message.role === "user" ||
      message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= MAX_CONTENT_LENGTH
  );
}

function normaliseBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

async function getModel(
  baseUrl: string,
  headers: HeadersInit,
  configuredModel: string | undefined,
) {
  if (configuredModel?.trim()) {
    return configuredModel.trim();
  }

  const response = await fetch(`${baseUrl}/v1/models`, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Joey LLM models request failed with ${response.status}`);
  }

  const payload = (await response.json()) as ModelsResponse;
  const model = payload.data?.[0]?.id;

  if (typeof model !== "string" || !model) {
    throw new Error("Joey LLM returned no usable model");
  }

  return model;
}

function assistantDeltaStream(upstream: Response): ReadableStream<Uint8Array> {
  if (!upstream.body) {
    throw new Error("Joey LLM returned an empty stream");
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  function extractDelta(line: string): string | null {
    if (!line.startsWith("data: ")) {
      return null;
    }

    const data = line.slice(6);
    if (data === "[DONE]") {
      return null;
    }

    const chunk = JSON.parse(data) as {
      choices?: Array<{ delta?: { content?: unknown } }>;
    };
    const delta = chunk.choices?.[0]?.delta?.content;
    return typeof delta === "string" ? delta : null;
  }

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const delta = extractDelta(line);
        if (delta) {
          controller.enqueue(encoder.encode(delta));
        }
      }

      if (done) {
        controller.close();
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

function textStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
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

  const messages =
    body && typeof body === "object"
      ? (body as Record<string, unknown>).messages
      : undefined;

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

  const baseUrlValue = process.env.JOEYLLM_API_URL?.trim();
  const apiKey = process.env.JOEYLLM_API_KEY?.trim();
  const localMockRequested = process.env.JOEYLLM_MOCK_MODE === "true";
  const localPreview =
    process.env.NODE_ENV !== "production" &&
    (localMockRequested || !baseUrlValue || !apiKey);

  if (localPreview) {
    return new Response(textStream("Local preview response."), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Mode": "mock",
      },
    });
  }

  if (!baseUrlValue || !apiKey) {
    return NextResponse.json(
      { error: "The Joey LLM service is not configured." },
      { status: 503 },
    );
  }

  const baseUrl = normaliseBaseUrl(baseUrlValue);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  try {
    const model = await getModel(baseUrl, headers, process.env.JOEYLLM_MODEL);
    const upstream = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      throw new Error(`Joey LLM chat request failed with ${upstream.status}`);
    }

    return new Response(assistantDeltaStream(upstream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Mode": "live",
        "X-Chat-Model": model,
      },
    });
  } catch (error) {
    console.error(
      "Joey LLM proxy error:",
      error instanceof Error ? error.message : "Unknown upstream error",
    );
    return NextResponse.json(
      { error: "Could not reach Joey LLM. Please try again." },
      { status: 502 },
    );
  }
}
