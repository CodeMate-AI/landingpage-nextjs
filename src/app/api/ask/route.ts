import { NextResponse } from "next/server";
import { streamText, stepCountIs } from "ai";
import { AIConfigError, getModel } from "@/lib/docs-ai/model";
import { getSystemPrompt } from "@/lib/docs-ai/prompt";
import { brandTransform } from "@/lib/docs-ai/brand";
import { createDocsTools } from "@/lib/docs-ai/tools";
import type { ObjectId } from "mongodb";
import { MAX_BODY_BYTES, parseAskRequest } from "@/lib/docs-ai/messages";
import { once } from "@/lib/docs-ai/once";
import { checkRate, clientIp } from "@/lib/docs-ai/rate-limit";
import { getDocsDatabase } from "@/lib/mongodb";

export const maxDuration = 60;

// Questions are kept for 90 days (TTL index), then deleted by MongoDB
const ensureIndex = once(async () => (await getDocsDatabase()).collection("chat_events").createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 }));

async function eventsCollection() {
  await ensureIndex();
  return (await getDocsDatabase()).collection("chat_events");
}

// Errors reach the browser as a short message, never the raw provider error
function friendlyError(error: unknown) {
  const text = error instanceof Error ? `${error.message} ${JSON.stringify((error as { responseBody?: unknown }).responseBody ?? "")}` : "";
  if (/content management policy|content_filter|filtered/i.test(text)) {
    return "I can't help with that request. Please ask a question about the CodeMate AI docs.";
  }
  // The AI gateway itself was down or overloaded (the SDK already retried); nothing is wrong with the question
  const failure = error as { statusCode?: number; lastError?: { statusCode?: number } };
  const upstream = failure.lastError?.statusCode ?? failure.statusCode;
  if (upstream && (upstream === 429 || upstream >= 500)) {
    return "The AI service is busy right now. Please try again in a moment.";
  }
  return "Something went wrong while answering. Please try again.";
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

  // Reject oversized bodies before parsing them
  // Too long is the visitor's to fix; anything else malformed only comes from a broken or forged client
  const tooLong = () => NextResponse.json({ error: "That message is too long. Please shorten it, or start a new chat." }, { status: 400 });
  const invalid = () => NextResponse.json({ error: "That message could not be sent. Please start a new chat and try again." }, { status: 400 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLong();
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return tooLong();
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {}
  const ask = parseAskRequest(body);
  if (ask === "too_long") return tooLong();
  if (!ask) return invalid();
  const { messages, page, threadId, visitorId } = ask;
  const question = messages[messages.length - 1].content;

  // Logging must never break the chat
  let eventId = "";
  let events: Awaited<ReturnType<typeof eventsCollection>> | null = null;
  let eventKey: ObjectId | null = null;
  try {
    events = await eventsCollection();
    eventKey = (await events.insertOne({ question, page: page || null, threadId: threadId ?? null, visitorId: visitorId ?? null, createdAt: new Date() })).insertedId;
    eventId = String(eventKey);
  } catch (error) {
    console.error("Ask AI could not log the question:", error);
  }

  const result = streamText({
    model,
    system: await getSystemPrompt(page),
    messages,
    tools: createDocsTools(),
    stopWhen: stepCountIs(6),
    // Force a docs search before any text, so no reply can skip grounding
    prepareStep: ({ stepNumber }) => (stepNumber === 0 ? { toolChoice: { type: "tool", toolName: "search_docs" } } : undefined),
    maxRetries: 4, // the gateway returns an occasional 502; the default of 2 retries showed errors to visitors
    temperature: 0.2,
    maxOutputTokens: 900,
    abortSignal: req.signal,
    // The model copies plain "CodeMate" from the docs; the stream rewrites it to "CodeMate AI"
    experimental_transform: brandTransform(),
    onFinish: async ({ text }) => {
      if (!events || !eventKey) return;
      await events.updateOne({ _id: eventKey },{ $set: { answer: text.slice(0, 4000) } }).catch(() => {});
    },
    onError: ({ error }) => console.error("Ask AI stream error:", error),
  });

  return result.toUIMessageStreamResponse({
    headers: { "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
    // The browser needs the event id to attach a thumbs vote to this answer
    messageMetadata: ({ part }) => (part.type === "start" ? { eventId } : undefined),
    onError: friendlyError,
  });
}
