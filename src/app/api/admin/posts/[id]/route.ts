import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";
import { BlogPostSchema } from "@/lib/validation";
import { ObjectId } from "mongodb";

function calculateWordCount(node: any): number {
  let count = 0;
  if (node.text) {
    count += node.text.trim().split(/\s+/).filter(Boolean).length;
  }
  if (node.content) {
    for (const child of node.content) {
      count += calculateWordCount(child);
    }
  }
  return count;
}

async function getSinglePost(req: NextRequest, session: any, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const post = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

async function updatePost(req: NextRequest, session: any, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = BlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const existing = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const saveMode = body.saveMode || (parsed.data.published ? "publish" : "draft");
    const published = parsed.data.published;

    let publishedVersion = existing.publishedVersion || null;
    let publishedAt = existing.publishedAt || null;

    if (existing.published && !publishedVersion) {
      publishedVersion = {
        title: existing.title,
        subheading: existing.subheading || "",
        category: existing.category,
        coverImage: existing.coverImage || "",
        bgColor: existing.bgColor || "#07111f",
        tags: existing.tags || [],
        filterLabels: existing.filterLabels || existing.tags?.map((t: any) => t.label.trim().toUpperCase()) || [],
        content: existing.content,
        author: existing.author || "Ayush Singhal",
        authorRole: existing.authorRole || "Founder & CEO",
        readTime: existing.readTime || "",
        publishedAtCustom: existing.publishedAtCustom || "",
        sections: existing.sections || [],
      };
    }

    if (saveMode === "publish") {
      publishedVersion = {
        title: parsed.data.title,
        subheading: parsed.data.subheading,
        category: parsed.data.category,
        coverImage: parsed.data.coverImage,
        bgColor: parsed.data.bgColor,
        tags: parsed.data.tags,
        filterLabels: parsed.data.filterLabels,
        content: parsed.data.content,
        author: parsed.data.author,
        authorRole: parsed.data.authorRole,
        readTime: parsed.data.readTime,
        publishedAtCustom: parsed.data.publishedAtCustom,
        sections: parsed.data.sections,
      };
      if (!publishedAt) {
        publishedAt = new Date();
      }
    }

    const wordCount = calculateWordCount(parsed.data.content);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = parsed.data.readTime || `${calculatedMinutes} min read`;

    const hasDraftChanges = saveMode === "draft" && published;

    const updatePayload = {
      ...parsed.data,
      readTime,
      published,
      publishedVersion,
      hasDraftChanges,
      publishedAt,
      updatedAt: new Date(),
    };

    await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updatePayload });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function deletePost(req: NextRequest, session: any, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export const GET = withAuth(getSinglePost);
export const PUT = withAuth(updatePost);
export const DELETE = withAuth(deletePost);
