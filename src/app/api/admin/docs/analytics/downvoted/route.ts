import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import { listDownvoted } from "@/lib/docs-analytics";
import { NO_STORE, resolveRange } from "@/lib/docs-analytics-core";
import { DownvotedQuery } from "@/lib/docs-validation";

// Live data for the logged-in admin, never prerendered or cached
export const dynamic = "force-dynamic";

// One page of the Ask AI answers rated not helpful in a range, newest first
async function downvoted(req: NextRequest) {
  const parsed = DownvotedQuery.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400, headers: NO_STORE });
  const { page, limit, ...rangeQuery } = parsed.data;
  const range = resolveRange(rangeQuery, new Date());
  if ("error" in range) return NextResponse.json({ error: range.error }, { status: 400, headers: NO_STORE });

  try {
    return NextResponse.json(await listDownvoted(range, { page, limit }), { headers: NO_STORE });
  } catch (error) {
    console.error("Docs analytics downvoted answers error:", error);
    return NextResponse.json({ error: "Could not load analytics." }, { status: 500, headers: NO_STORE });
  }
}

export const GET = withAuth(downvoted);
