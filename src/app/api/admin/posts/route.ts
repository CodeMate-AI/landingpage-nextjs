import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";
import { BlogPostSchema } from "@/lib/validation";
import { calculateReadTime, hasActualDraftChanges } from "@/lib/blog-compiler";
import slugify from "@/utils/slugify";

// Retrieves blog articles from MongoDB with pagination and stable composite sorting
async function getPostsHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "5", 10);

  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
  const limit = Math.max(1, Math.min(100, isNaN(limitParam) ? 5 : limitParam));
  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db("codemate_blog");

  const [total, rawPosts] = await Promise.all([
    db.collection("blogs").countDocuments(),
    db
      .collection("blogs")
      .find()
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
  ]);

  const posts = rawPosts.map((post) => ({
    ...post,
    hasDraftChanges:
      post.published && post.publishedVersion
        ? hasActualDraftChanges(post, post.publishedVersion)
        : Boolean(post.hasDraftChanges),
  }));

  const totalPages = Math.ceil(total / limit) || 1;

  return NextResponse.json({
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
  });
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

    // 3. Preserve custom reading duration if entered; otherwise keep empty
    const readTime = (parsed.data.readTime || "").trim();
    const published = parsed.data.published;
    const publishedAt = published ? new Date() : null;

    // Deduplicate tags and filter labels
    const sanitizedTags = Array.from(
      new Map(parsed.data.tags.map((t) => [t.label.trim().toUpperCase(), { ...t, label: t.label.trim() }])).values()
    );
    const sanitizedFilterLabels = parsed.data.filterLabels
      ? Array.from(new Set(parsed.data.filterLabels.map((l) => l.trim().toUpperCase())))
      : undefined;

    const publishedAtCustom =
      parsed.data.publishedAtCustom && parsed.data.publishedAtCustom.trim() !== ""
        ? parsed.data.publishedAtCustom.trim()
        : published
        ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "";

    // 4. Create an immutable publishedVersion snapshot if post is published immediately
    const publishedVersion = published
      ? {
          title: parsed.data.title,
          subheading: parsed.data.subheading,
          category: parsed.data.category,
          coverImage: parsed.data.coverImage,
          tags: sanitizedTags,
          filterLabels: sanitizedFilterLabels,
          content: parsed.data.content,
          author: parsed.data.author || "",
          authorRole: parsed.data.authorRole || "",
          authorImage: parsed.data.authorImage || "",
          readTime,
          publishedAtCustom,
          sections: parsed.data.sections,
        }
      : null;

    // 5. Construct document with timestamps and draft flags
    const newPost = {
      // Spread operator (...) unpacks all validated input fields (title, subheading, content, tags, author, etc.) from Zod
      ...parsed.data,
      author: parsed.data.author || "",
      authorRole: parsed.data.authorRole || "",
      publishedAtCustom,
      tags: sanitizedTags,
      filterLabels: sanitizedFilterLabels,
      authorImage: parsed.data.authorImage ?? "",
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

    if (published) {
      try {
        revalidatePath("/blog");
        revalidatePath(`/blog/${finalSlug}`);
      } catch (revErr) {
        console.warn("Failed to revalidate blog paths:", revErr);
      }
    }

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Protected route exports wrapped with session verification
export const GET = withAuth(getPostsHandler);
export const POST = withAuth(createPostHandler);
