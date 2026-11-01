import { NextRequest, NextResponse } from "next/server";
import { buildPdfUploadUrl, isPdfUploadId } from "@/lib/pdfProxy";

export const dynamic = "force-dynamic";

const DEFAULT_FILENAME = "document";
const MAX_FILENAME_LENGTH = 100;

function decodeFilename(filename: string): string {
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function sanitizeFilename(rawFilename: string): string {
  const sanitized = rawFilename
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[/\\?%*:|"<>]/g, "_")
    .replace(/\.pdf$/i, "")
    .trim()
    .slice(0, MAX_FILENAME_LENGTH)
    .trim();

  return sanitized || DEFAULT_FILENAME;
}

// Builds an RFC 6266 header with an ASCII fallback and an RFC 5987 UTF-8 filename.
function buildContentDisposition(filename: string): string {
  const asciiFilename = filename.replace(/[^\x20-\x7E]/g, "_");
  const encodedFilename = encodeURIComponent(filename).replace(
    /['()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );

  return `inline; filename="${asciiFilename}.pdf"; filename*=UTF-8''${encodedFilename}.pdf`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  const { id, filename } = await params;

  if (!isPdfUploadId(id)) {
    return new NextResponse("Invalid document id", { status: 400 });
  }

  try {
    const response = await fetch(buildPdfUploadUrl(id), {
      cache: "no-store",
      redirect: "error",
      // Upstream drops Content-Length on compressed responses, and PDFs gain little from compression.
      headers: { "Accept-Encoding": "identity" },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, {
        status: response.status,
      });
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", buildContentDisposition(sanitizeFilename(decodeFilename(filename))));
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400");

    // fetch decompresses encoded bodies, which makes the upstream length wrong for them.
    const contentLength = response.headers.get("content-length");
    if (contentLength && !response.headers.has("content-encoding")) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
