import { NextResponse } from "next/server";
import { streamText, stepCountIs } from "ai";
import { z } from "zod";
import { AIConfigError, getModel } from "@/lib/docs-ai/model";
import { getSystemPrompt } from "@/lib/docs-ai/prompt";
import { docsTools } from "@/lib/docs-ai/tools";
import { checkRate, clientIp } from "@/lib/docs-ai/rate-limit";
import { getDocsDatabase } from "@/lib/mongodb";

export const maxDuration = 60;

const BodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(4000) }))
    .min(1)
    .max(12),
  page: z.string().max(120).regex(/^[a-z0-9-]*$/).optional(),
});

let eventsIndexReady: Promise<unknown> | undefined;

// Questions are kept for 90 days (TTL index), then deleted by MongoDB
async function eventsCollection() {
  const col = (await getDocsDatabase()).collection("chat_events");
  eventsIndexReady ??= col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 }).catch((e) => {
    eventsIndexReady = undefined;
    throw e;
  });
  await eventsIndexReady;
  return col;
}

export async function POST(req: Request) {
  const rate = await checkRate(clientIp(req));
  if (rate.limited) {
    return NextResponse.json(
      { error: "Too many questions. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

  let model;
  try {
    model = getModel();
  } catch (error) {
    if (error instanceof AIConfigError) return NextResponse.json({ error: "Ask AI is not available right now." }, { status: 503 });
    throw error;
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") {
    return NextResponse.json({ error: "Invalid or too long question." }, { status: 400 });
  }
  const { messages, page } = parsed.data;
  const question = messages[messages.length - 1].content;

  // Logging must never break the chat
  let eventId = "";
  let events: Awaited<ReturnType<typeof eventsCollection>> | null = null;
  try {
    events = await eventsCollection();
    eventId = String((await events.insertOne({ question, page: page || null, createdAt: new Date() })).insertedId);
  } catch (error) {
    console.error("Ask AI could not log the question:", error);
  }

  const result = streamText({
    model,
    system: await getSystemPrompt(page),
    messages,
    tools: docsTools,
    stopWhen: stepCountIs(6),
    temperature: 0.2,
    maxOutputTokens: 900,
    abortSignal: req.signal,
    onFinish: async ({ text }) => {
      if (!events || !eventId) return;
      const { ObjectId } = await import("mongodb");
      await events.updateOne({ _id: new ObjectId(eventId) }, { $set: { answer: text.slice(0, 4000) } }).catch(() => {});
    },
    onError: ({ error }) => console.error("Ask AI stream error:", error),
  });

  // Plain text stream. If the model call fails before any text (for example the gateway's content
  // filter rejects the prompt) the client would get an empty 200, so send a short message instead.
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false;
      try {
        for await (const part of result.fullStream) {
          if (part.type === "text-delta" && part.text) {
            sent = true;
            controller.enqueue(encoder.encode(part.text));
          } else if (part.type === "error") {
            console.error("Ask AI model error:", part.error);
          }
        }
      } catch (error) {
        console.error("Ask AI stream failed:", error);
      }
      if (!sent) controller.enqueue(encoder.encode("I can't help with that request. Please ask a question about the CodeMate docs."));
      controller.close();
    },
    cancel: () => undefined,
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "x-docs-event": eventId, "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
