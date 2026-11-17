import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDocsDatabase } from "@/lib/mongodb";
import { checkRate, clientIp } from "@/lib/docs-ai/rate-limit";
import { ID, Vote } from "@/lib/docs-ai/messages";

// vote 0 takes a vote back. The visitor id must match the one stored when the question was
// asked, so a guessed event id cannot change someone else's vote.
const Schema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/),
  vote: Vote,
  visitorId: ID,
});

export async function POST(req: Request) {
  if ((await checkRate(clientIp(req), "fb")).limited) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  const { id, vote, visitorId } = parsed.data;
  try {
    const col = (await getDocsDatabase()).collection("chat_events");
    await col.updateOne({ _id: new ObjectId(id), visitorId }, vote === 0 ? { $unset: { rating: "" } } : { $set: { rating: vote } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ask AI feedback failed:", error);
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }
}
