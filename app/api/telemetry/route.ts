import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Anonymous frontend telemetry sink.
 *
 * The browser (`app/lib/telemetry.ts`) batches lightweight UI events and posts
 * them here — usually via `navigator.sendBeacon`, so the body may arrive with a
 * `text/plain` content-type. This route revalidates the shape, caps the size,
 * and forwards to JoeyBackend's `POST /events` with the server-side bearer key
 * (never exposed to the browser, exactly like `/api/chat`).
 *
 * It is best-effort: the client never reads the result, so any upstream problem
 * is swallowed and a `204` is returned. In local/preview mode (no backend
 * configured) events are simply dropped.
 */

const MAX_BODY_BYTES = 32_000;
const MAX_EVENTS = 50;
const UPSTREAM_TIMEOUT_MS = 4_000;

function normaliseBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export async function POST(request: Request) {
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return new Response(null, { status: 204 });
  }

  if (!raw || raw.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 204 });
  }

  let events: unknown;
  try {
    const parsed = JSON.parse(raw) as unknown;
    events =
      parsed && typeof parsed === "object" && "events" in parsed
        ? (parsed as { events: unknown }).events
        : parsed;
  } catch {
    return new Response(null, { status: 204 });
  }

  const list = Array.isArray(events) ? events : [events];
  const clean = list
    .filter(
      (event): event is Record<string, unknown> =>
        !!event && typeof event === "object",
    )
    .filter((event) => typeof event.type === "string" && event.type.length > 0)
    .slice(0, MAX_EVENTS);

  if (clean.length === 0) {
    return new Response(null, { status: 204 });
  }

  const baseUrlValue = process.env.JOEYBACKEND_URL?.trim();
  const apiKey = process.env.JOEYLLM_API_KEY?.trim();

  if (!baseUrlValue || !apiKey) {
    // Local preview / demo mode — nothing to forward to.
    return new Response(null, { status: 204 });
  }

  try {
    await fetch(`${normaliseBaseUrl(baseUrlValue)}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ events: clean }),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    // Best-effort: the browser has already moved on.
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 204 });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
