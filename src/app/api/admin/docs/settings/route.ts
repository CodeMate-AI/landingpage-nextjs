import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import type { TokenPayload } from "@/lib/auth";
import { NO_STORE } from "@/lib/docs-analytics-core";
import { DEFAULT_LIMITS, RateLimitsInput, type RateSettings } from "@/lib/docs-ai/limits";
import { getLimitsRecord, getRateUsage, saveRateLimits } from "@/lib/docs-ai/rate-limit";

// Live numbers for the logged-in admin, never prerendered or cached
export const dynamic = "force-dynamic";

// The limits in force, their defaults, who last changed them and the last 24 hours of traffic
async function readSettings(): Promise<RateSettings> {
  const [record, usage] = await Promise.all([getLimitsRecord(), getRateUsage()]);
  return {
    limits: { ...DEFAULT_LIMITS, ...record?.limits },
    defaults: DEFAULT_LIMITS,
    updatedAt: record?.updatedAt.toISOString() ?? null,
    updatedBy: record?.updatedBy ?? null,
    usage,
  };
}

async function getSettings() {
  try {
    return NextResponse.json(await readSettings(), { headers: NO_STORE });
  } catch (error) {
    console.error("Ask AI settings read error:", error);
    return NextResponse.json({ error: "Could not load the Ask AI settings." }, { status: 500, headers: NO_STORE });
  }
}

// Saves all four limits at once; they apply on every server within 15 seconds
async function putSettings(req: NextRequest, session: TokenPayload) {
  const body = await req.json().catch(() => null);
  const parsed = RateLimitsInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400, headers: NO_STORE });
  try {
    await saveRateLimits(parsed.data, session.email);
    return NextResponse.json(await readSettings(), { headers: NO_STORE });
  } catch (error) {
    console.error("Ask AI settings save error:", error);
    return NextResponse.json({ error: "Could not save the Ask AI settings." }, { status: 500, headers: NO_STORE });
  }
}

export const GET = withAuth(getSettings);
export const PUT = withAuth(putSettings);
