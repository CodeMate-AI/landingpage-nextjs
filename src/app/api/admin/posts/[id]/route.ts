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

    let publishedAt = existing.publishedAt;
    if (parsed.data.published && !existing.published) {
      publishedAt = new Date();
    } else if (!parsed.data.published) {
      publishedAt = null;
    }

    const wordCount = calculateWordCount(parsed.data.content);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${calculatedMinutes} min read`;

    const updatePayload = {
      ...parsed.data,
      readTime,
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
