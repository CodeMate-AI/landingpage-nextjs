import { NextResponse } from "next/server";
import { z } from "zod";
import { getDocsDatabase } from "@/lib/mongodb";
import { checkRate, clientIp } from "@/lib/docs-ai/rate-limit";
import { ID, Vote } from "@/lib/docs-ai/messages";
import { once } from "@/lib/docs-ai/once";

// "Was this page helpful?" One vote per visitor per page; vote 0 takes it back. Kept 90 days.
const Schema = z.object({
  page: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  vote: Vote,
  visitorId: ID,
});

const ensureIndexes = once(async () => {
  const col = (await getDocsDatabase()).collection("page_feedback");
  await Promise.all([
    col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 90 * 86400 }),
    col.createIndex({ page: 1, visitorId: 1 }, { unique: true }),
  ]);
});

export async function POST(req: Request) {
  if ((await checkRate(clientIp(req), "fb")).limited) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  const { page, vote, visitorId } = parsed.data;
  try {
    await ensureIndexes();
    const col = (await getDocsDatabase()).collection("page_feedback");
    if (vote === 0) await col.deleteOne({ page, visitorId });
    else await col.updateOne({ page, visitorId }, { $set: { vote, createdAt: new Date() } }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Page feedback failed:", error);
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }
}
