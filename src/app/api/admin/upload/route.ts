import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadHandler(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB size limit" }, { status: 400 });
    }

    const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid format. Only JPEG, PNG, WEBP, and GIF are allowed." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "codemate_blog" },
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

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error: any) {
    console.error("Image upload exception:", error);
    return NextResponse.json({ error: "Server upload error" }, { status: 500 });
  }
}

export const POST = withAuth(uploadHandler);
