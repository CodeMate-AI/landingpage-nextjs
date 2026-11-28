import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import { getChat } from "@/lib/docs-analytics";
import { NO_STORE } from "@/lib/docs-analytics-core";
import { ChatIdParam, ChatPageQuery } from "@/lib/docs-validation";

// Live data for the logged-in admin, never prerendered or cached
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ threadId: string }> };

// One page of an Ask AI chat's questions and answers, with their tool calls and ratings
async function chat(req: NextRequest, _session: unknown, { params }: Ctx) {
  const { threadId } = await params;
  if (!ChatIdParam.safeParse(threadId).success) return NextResponse.json({ error: "Invalid chat id" }, { status: 400, headers: NO_STORE });

  const paging = ChatPageQuery.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!paging.success) return NextResponse.json({ error: paging.error.issues[0].message }, { status: 400, headers: NO_STORE });

  try {
    const detail = await getChat(threadId, paging.data);
    if (!detail) return NextResponse.json({ error: "Chat not found" }, { status: 404, headers: NO_STORE });
    return NextResponse.json(detail, { headers: NO_STORE });
  } catch (error) {
    console.error("Docs analytics chat error:", error);
    return NextResponse.json({ error: "Could not load analytics." }, { status: 500, headers: NO_STORE });
  }
}

export const GET = withAuth(chat);
