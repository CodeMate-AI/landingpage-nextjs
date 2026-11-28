import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import { getPublishedIndex } from "@/lib/docs-data";
import { getOverview } from "@/lib/docs-analytics";
import { NO_STORE, resolveRange } from "@/lib/docs-analytics-core";
import { AnalyticsRangeQuery } from "@/lib/docs-validation";

// Live numbers for the logged-in admin, never prerendered or cached
export const dynamic = "force-dynamic";

// Summary tiles, questions over time, most up/downvoted pages and downvoted answers for one range
async function overview(req: NextRequest) {
  const parsed = AnalyticsRangeQuery.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400, headers: NO_STORE });
  const range = resolveRange(parsed.data, new Date());
  if ("error" in range) return NextResponse.json({ error: range.error }, { status: 400, headers: NO_STORE });

  try {
    // Page titles come from the published docs; a voted slug with no published page shows without a title
    const titles = new Map((await getPublishedIndex()).map((p) => [p.slug, p.title]));
    return NextResponse.json(await getOverview(range, titles), { headers: NO_STORE });
  } catch (error) {
    console.error("Docs analytics overview error:", error);
    return NextResponse.json({ error: "Could not load analytics." }, { status: 500, headers: NO_STORE });
  }
}

export const GET = withAuth(overview);
