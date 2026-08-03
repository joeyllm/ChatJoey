import { NextResponse } from "next/server";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as { messages?: IncomingMessage[] };
  const latest = body.messages?.filter((message) => message.role === "user").at(-1)?.content;

  if (!latest?.trim()) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  const clientApiUrl = process.env.JOEYLLM_API_URL;

  if (clientApiUrl) {
    const upstream = await fetch(clientApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: body.messages }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "The JoeyLLM service is unavailable." }, { status: 502 });
    }

    const payload = (await upstream.json()) as { message?: string; content?: string };
    return NextResponse.json({
      message: payload.message ?? payload.content ?? "JoeyLLM returned an empty response.",
      mode: "connected",
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 650));

  return NextResponse.json({
    message:
      "I’m running in interface preview mode while the JoeyLLM server is being prepared. The chat flow, responsive layout and API boundary are ready; once the client endpoint is available, this mock response can be replaced without changing the UI.",
    mode: "mock",
  });
}
