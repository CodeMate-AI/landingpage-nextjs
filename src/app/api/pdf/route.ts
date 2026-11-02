import { NextRequest, NextResponse } from "next/server";
import { buildPdfProxyUrl } from "@/lib/pdfProxy";

export const dynamic = "force-dynamic";

// Sends links in the old ?url= format to the id-based route.
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const location = buildPdfProxyUrl(url, "document");
  if (!location) {
    return new NextResponse("Forbidden target", { status: 403 });
  }

  // no-store keeps CDNs from reusing one redirect for every ?url= value.
  return new NextResponse(null, {
    status: 308,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}
