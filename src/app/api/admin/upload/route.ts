import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary SDK configuration from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Maximum allowed payload sizes: 5MB for images and 50MB for video assets
const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

// Permitted image and video MIME types
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/ogg", "video/quicktime"];

// Handles multipart form uploads, validates MIME/size, and streams directly to Cloudinary
async function uploadHandler(req: NextRequest) {
  try {
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

    // 4. Convert ArrayBuffer to Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. Pipe binary stream to Cloudinary inside the 'codemate_blog' storage folder
    const uploadResult = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "codemate_blog", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result ?? {});
        }
      );
      uploadStream.end(buffer);
    });

    if (!uploadResult.secure_url) {
      return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
    }

    // 6. Return HTTPS secure asset URL to frontend editor
    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error: any) {
    console.error("Upload exception:", error);
    return NextResponse.json({ error: "Server upload error" }, { status: 500 });
  }
}

// Protected upload endpoint wrapped with auth verification
export const POST = withAuth(uploadHandler);
