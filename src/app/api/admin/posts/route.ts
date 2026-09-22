import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/authWrapper";
import { getDatabase } from "@/lib/mongodb";
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

  const db = await getDatabase();

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

    const db = await getDatabase();

    // 2. Generate base URL slug from title
    const baseSlug = slugify(parsed.data.title || "untitled-article");

    // 3. Compute reliable reading duration server-side
    const rawReadTime = (parsed.data.readTime || "").trim();
    const readTime = rawReadTime || calculateReadTime(parsed.data.content);
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
    const newPost: any = {
      ...parsed.data,
      author: parsed.data.author || "",
      authorRole: parsed.data.authorRole || "",
      publishedAtCustom,
      tags: sanitizedTags,
      filterLabels: sanitizedFilterLabels,
      authorImage: parsed.data.authorImage ?? "",
      readTime,
      published,
      publishedAt,
      publishedVersion,
      hasDraftChanges: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 6. [MongoDB Collection: "blogs"] Insert article with duplicate slug collision retry loop
    let finalSlug = baseSlug;
    let counter = 1;
    let result: any = null;

    while (counter <= 20) {
      try {
        newPost.slug = finalSlug;
        result = await db.collection("blogs").insertOne(newPost);
        break;
      } catch (err: any) {
        if (err.code === 11000 && err.keyPattern?.slug) {
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        } else {
          throw err;
        }
      }
    }

    if (!result) {
      return NextResponse.json({ error: "Could not generate unique slug for post" }, { status: 500 });
    }

    if (published) {
      try {
        revalidatePath("/blog");
        revalidatePath(`/blog/${finalSlug}`);
      } catch (revErr) {
        console.warn("Failed to revalidate blog paths:", revErr);
      }
    }

    return NextResponse.json({ success: true, id: result.insertedId, slug: finalSlug });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Protected route exports wrapped with session verification
export const GET = withAuth(getPostsHandler);
export const POST = withAuth(createPostHandler);
