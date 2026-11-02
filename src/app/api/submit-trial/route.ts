import { NextResponse } from "next/server";
import { TRIAL_FIELD_LIMITS, isValidTrialPhone } from "@/app/hp/config/trialForm";
import { checkTrialRateLimit } from "@/lib/trialRateLimit";

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const { organizationName, hpPartnerId, mobileNumber, city, website } = payload as Record<string, unknown>;

    // Honeypot spam defense: if hidden website field is populated, silently accept and drop
    if (website && String(website).trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    const org = typeof organizationName === "string" ? organizationName.trim() : "";
    const partnerId = typeof hpPartnerId === "string" ? hpPartnerId.trim() : "";
    const phone = typeof mobileNumber === "string" ? mobileNumber.trim() : "";
    const userCity = typeof city === "string" ? city.trim() : "";

    if (!org || !partnerId || !phone || !userCity) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (
      org.length > TRIAL_FIELD_LIMITS.organizationName ||
      partnerId.length > TRIAL_FIELD_LIMITS.hpPartnerId ||
      phone.length > TRIAL_FIELD_LIMITS.mobileNumber ||
      userCity.length > TRIAL_FIELD_LIMITS.city
    ) {
      return NextResponse.json(
        { error: "Input exceeds maximum character limits." },
        { status: 400 }
      );
    }

    if (!isValidTrialPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid mobile number format." },
        { status: 400 }
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
    const { isLimited, retryAfter } = await checkTrialRateLimit(ip);
    if (isLimited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    const formUrl =
      process.env.GOOGLE_TRIAL_FORM_URL ||
      "https://docs.google.com/forms/d/e/1FAIpQLSfoJNnBTdvkg4GKgXup4PHtkDKT3GR2sbwNDe7eTQTqDWBtsw/formResponse";

    const body = new URLSearchParams({
      "entry.2005620554": org,
      "entry.1045781291": partnerId,
      "entry.1065046570": phone,
      "entry.1166974658": userCity,
    });

    const googleRes = await fetch(formUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      signal: AbortSignal.timeout(9000),
    });

    if (googleRes.status >= 200 && googleRes.status < 400) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Failed to log response to Google Form." },
      { status: 500 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return NextResponse.json(
        { error: "Submission request timed out. Please try again." },
        { status: 504 }
      );
    }
    console.error("Trial submission API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
