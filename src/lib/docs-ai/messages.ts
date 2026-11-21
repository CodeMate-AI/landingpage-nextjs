import { z } from "zod";

// Only the newest MAX_MESSAGES are sent to the model; older turns drop off (sliding window)
export const MAX_MESSAGES = 30;
export const MAX_MESSAGE_CHARS = 4000;
// Fixed reply for anything the docs do not cover; lives here so the chat UI can recognise it without importing server code
export const REFUSAL = "I can only answer questions about the CodeMate AI docs, and I could not find this there. Try asking about installing CodeMate AI, CORA, CORA-CLI, Build or Toolbox.";


export const ID = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/);
export const Vote = z.union([z.literal(1), z.literal(-1), z.literal(0)]);
// Room for 12 messages of 4,000 characters plus JSON overhead; larger bodies are rejected unread
export const MAX_BODY_BYTES = 200_000;

// The browser sends UI messages (id, role, parts). Only the visible text is trusted: tool parts,
// files and anything else a client could forge are dropped, and the model messages are rebuilt here.
const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        parts: z.array(z.object({ type: z.string().max(60) }).passthrough()).max(40),
      })
    )
    .min(1)
    .max(200),
  page: z.string().max(120).regex(/^[a-z0-9-]*$/).optional(),
  threadId: ID.optional(),
  visitorId: ID.optional(),
});

export type AskRequest = {
  messages: { role: "user" | "assistant"; content: string }[];
  page?: string;
  threadId?: string;
  visitorId?: string;
};

// "too_long" lets the route tell the visitor to shorten the message; null means the request is malformed
export function parseAskRequest(input: unknown): AskRequest | "too_long" | null {
  const parsed = BodySchema.safeParse(input);
  if (!parsed.success) return null;

  const messages: AskRequest["messages"] = [];
  for (const m of parsed.data.messages.slice(-MAX_MESSAGES)) {
    const content = m.parts
      .map((p) => (p.type === "text" && typeof p.text === "string" ? p.text : ""))
      .join("")
      .trim();
    if (content.length > MAX_MESSAGE_CHARS) return "too_long";
    // An assistant turn that was stopped before any text has nothing to send back
    if (content) messages.push({ role: m.role, content });
  }
  if (messages.at(-1)?.role !== "user") return null;
  // The window may start on an assistant reply; the conversation must open with the user
  while (messages[0].role !== "user") messages.shift();
  return { messages, page: parsed.data.page, threadId: parsed.data.threadId, visitorId: parsed.data.visitorId };
}
