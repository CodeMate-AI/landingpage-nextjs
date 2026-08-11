import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";
import { BlogPostSchema } from "@/lib/validation";
import slugify from "@/utils/slugify";

// Recursively walks the Tiptap JSON AST to calculate the total word count of article text ( calculates read time if field is left empty by admin )
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

// Retrieves all blog articles from MongoDB sorted in reverse chronological order ( new one at top )
async function getPostsHandler() {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  // [MongoDB Collection: "blogs"] Query all articles sorted newest-first
  const posts = await db.collection("blogs").find().sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ posts });
}

// Validates incoming article data, computes unique slug & read time, and inserts new blog document
async function createPostHandler(req: NextRequest) {
  try {
    // 1. Validate request payload against Zod BlogPostSchema
    const body = await req.json();
    const parsed = BlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("codemate_blog");

    // 2. Generate base URL slug from title and resolve collisions by appending numeric counter
    const baseSlug = slugify(parsed.data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    // [MongoDB Collection: "blogs"] Verify slug uniqueness to prevent duplicate URL collisions
    while (await db.collection("blogs").findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 3. Compute reading duration based on AST word count (200 words/min average)
    const wordCount = calculateWordCount(parsed.data.content);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = parsed.data.readTime || `${calculatedMinutes} min read`;
    const published = parsed.data.published;
    const publishedAt = published ? new Date() : null;

    // 4. Create an immutable publishedVersion snapshot if post is published immediately
    const publishedVersion = published
      ? {
          title: parsed.data.title,
          subheading: parsed.data.subheading,
          category: parsed.data.category,
          coverImage: parsed.data.coverImage,
          tags: parsed.data.tags,
          filterLabels: parsed.data.filterLabels,
          content: parsed.data.content,
          author: parsed.data.author,
          authorRole: parsed.data.authorRole,
          readTime,
          publishedAtCustom: parsed.data.publishedAtCustom,
          sections: parsed.data.sections,
        }
      : null;

    // 5. Construct document with timestamps and draft flags
    const newPost = {
      // Spread operator (...) unpacks all validated input fields (title, subheading, content, tags, author, etc.) from Zod
      ...parsed.data,
      slug: finalSlug,
      readTime,
      published,
      publishedAt,
      publishedVersion,
      hasDraftChanges: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 6. [MongoDB Collection: "blogs"] Insert newly composed article document
    const result = await db.collection("blogs").insertOne(newPost);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Protected route exports wrapped with session verification
export const GET = withAuth(getPostsHandler);
export const POST = withAuth(createPostHandler);
