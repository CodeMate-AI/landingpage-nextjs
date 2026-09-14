import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, {
        status: response.status,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", "inline");
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400");

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
