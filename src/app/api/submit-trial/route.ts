import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { organizationName, hpPartnerId, mobileNumber, city } = await request.json();

    if (!organizationName || !hpPartnerId || !mobileNumber || !city) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const org = String(organizationName).trim();
    const partnerId = String(hpPartnerId).trim();
    const phone = String(mobileNumber).trim();
    const userCity = String(city).trim();

    if (org.length > 120 || partnerId.length > 80 || userCity.length > 100 || phone.length > 25) {
      return NextResponse.json(
        { error: "Input exceeds maximum character limits." },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid mobile number format." },
        { status: 400 }
      );
    }

    const formUrl =
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
