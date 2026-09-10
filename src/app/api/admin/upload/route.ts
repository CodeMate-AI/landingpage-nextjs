import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";

// Maximum allowed payload sizes: 5MB for images and 50MB for video assets
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

// Permitted image and video MIME types
const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

// Handles multipart form uploads, validates MIME/size, and forwards to custom upload service
async function uploadHandler(req: NextRequest) {
  try {
    const uploadEndpoint = process.env.CUSTOM_UPLOAD_ENDPOINT;
    if (!uploadEndpoint) {
      console.error("CUSTOM_UPLOAD_ENDPOINT is not defined in environment variables");
      return NextResponse.json(
        { error: "Upload endpoint is not configured in server environment." },
        { status: 500 }
      );
    }

    // 1. Extract file payload from multipart form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    // 2. Validate file MIME type against allowed image and video formats
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid format. Only JPEG, PNG, WEBP, GIF, MP4, WEBM, OGG, and MOV are allowed." },
        { status: 400 }
      );
    }

    // 3. Enforce separate size ceilings for video vs image files
    const maxSize = file.type.startsWith("video/") ? VIDEO_MAX_SIZE : IMAGE_MAX_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: file.type.startsWith("video/") ? "Video exceeds 50MB size limit" : "File exceeds 5MB size limit" },
        { status: 400 }
      );
    }

    // 4. Convert ArrayBuffer to Base64 Data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    // 5. Send POST request to custom upload service
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: dataUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Custom upload error response:", response.status, errorText);
      return NextResponse.json(
        { error: "Upload service returned an error. Please try again." },
        { status: response.status >= 400 && response.status < 500 ? response.status : 502 }
      );
    }

    const data = await response.json();

    const mediaOrigin = new URL(uploadEndpoint).origin;
    const finalUrl =
      data.url ||
      (data.image_id
        ? `${mediaOrigin}/uploaded/images/${data.image_id}`
        : null);

    if (data.status !== "success" || !finalUrl) {
      return NextResponse.json(
        { error: data.error || data.message || "Failed to retrieve uploaded asset URL" },
        { status: 500 }
      );
    }

    // 6. Return HTTPS secure asset URL to frontend editor
    return NextResponse.json({ url: finalUrl, image_id: data.image_id });
  } catch (error: any) {
    console.error("Upload exception:", error);
    return NextResponse.json({ error: "Server upload error" }, { status: 500 });
  }
}

// Protected upload endpoint wrapped with auth verification
export const POST = withAuth(uploadHandler);


