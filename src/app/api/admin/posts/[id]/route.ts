import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";
import { BlogPostSchema } from "@/lib/validation";
import { ObjectId } from "mongodb";

// Recursively walks the Tiptap JSON AST to calculate the total word count of article text
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

// Fetches a single blog post by its MongoDB ObjectId for the admin editor workspace
async function getSinglePost(req: NextRequest, session: any, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Validate that the route parameter is a valid 24-character hexadecimal ObjectId
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("codemate_blog");
  // [MongoDB Collection: "blogs"] Query single blog post document by its ObjectId
  const post = await db.collection("blogs").findOne({ _id: new ObjectId(id) });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// Updates an existing blog post, handling dual draft vs publish versioning
async function updatePost(req: NextRequest, session: any, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID format" }, { status: 400 });
    }

    // 1. Validate payload fields with Zod
    const body = await req.json();
    const parsed = BlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("codemate_blog");
    // [MongoDB Collection: "blogs"] Find existing post document by ObjectId
    const existing = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 2. Resolve save mode: publish immediately vs save as draft
    const saveMode = body.saveMode || (parsed.data.published ? "publish" : "draft");
    const published = parsed.data.published;

    let publishedVersion = existing.publishedVersion || null;
    let publishedAt = existing.publishedAt || null;

    // 3. Backfill publishedVersion if article was previously published without an explicit snapshot
    if (existing.published && !publishedVersion) {
      publishedVersion = {
        title: existing.title,
        subheading: existing.subheading || "",
        category: existing.category,
        coverImage: existing.coverImage || "",
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

    // 4. Overwrite publishedVersion snapshot when saving with 'publish' mode
    if (saveMode === "publish") {
      publishedVersion = {
        title: parsed.data.title,
        subheading: parsed.data.subheading,
        category: parsed.data.category,
        coverImage: parsed.data.coverImage,
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

    // 5. Recalculate reading time from updated AST content
    const wordCount = calculateWordCount(parsed.data.content);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = parsed.data.readTime || `${calculatedMinutes} min read`;

    // Flag draft changes if a published article is being saved as a draft with pending changes
    const hasDraftChanges = saveMode === "draft" && published;

    // 6. Build the final update payload
    const updatePayload = {
      ...parsed.data,
      readTime,
      published,
      publishedVersion,
      hasDraftChanges,
      publishedAt,
      updatedAt: new Date(),
    };

    // 7. [MongoDB Collection: "blogs"] Update article document in MongoDB
    await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updatePayload });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Deletes a single blog post permanently by its ObjectId
async function deletePost(req: NextRequest, session: any, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("codemate_blog");
  // [MongoDB Collection: "blogs"] Delete blog post document by ObjectId
  const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// Export authenticated route handlers
export const GET = withAuth(getSinglePost);
export const PUT = withAuth(updatePost);
export const DELETE = withAuth(deletePost);
