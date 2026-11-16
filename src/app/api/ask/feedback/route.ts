import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { getDocsDatabase } from "@/lib/mongodb";
import { checkRate, clientIp } from "@/lib/docs-ai/rate-limit";

const Schema = z.object({ id: z.string().regex(/^[a-f0-9]{24}$/), rating: z.enum(["up", "down"]) });

export async function POST(req: Request) {
  if ((await checkRate(clientIp(req), "fb")).limited) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  try {
    const col = (await getDocsDatabase()).collection("chat_events");
    // First rating wins, so a guessed id cannot flip an existing rating
    await col.updateOne({ _id: new ObjectId(parsed.data.id), rating: { $exists: false } }, { $set: { rating: parsed.data.rating } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ask AI feedback failed:", error);
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }
}
