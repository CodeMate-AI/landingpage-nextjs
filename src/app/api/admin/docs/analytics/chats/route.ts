import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import { listChats } from "@/lib/docs-analytics";
import { NO_STORE, resolveRange } from "@/lib/docs-analytics-core";
import { ChatListQuery } from "@/lib/docs-validation";

// Live data for the logged-in admin, never prerendered or cached
export const dynamic = "force-dynamic";

// One page of Ask AI chats in a range, filtered by feedback and optionally by the visitor behind one chat
async function chats(req: NextRequest) {
  const parsed = ChatListQuery.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400, headers: NO_STORE });
  const { feedback, page, limit, visitorOf, ...rangeQuery } = parsed.data;
  const range = resolveRange(rangeQuery, new Date());
  if ("error" in range) return NextResponse.json({ error: range.error }, { status: 400, headers: NO_STORE });

  try {
    return NextResponse.json(await listChats(range, { feedback, page, limit, visitorOf }), { headers: NO_STORE });
  } catch (error) {
    console.error("Docs analytics chats error:", error);
    return NextResponse.json({ error: "Could not load analytics." }, { status: 500, headers: NO_STORE });
  }
}

export const GET = withAuth(chats);
