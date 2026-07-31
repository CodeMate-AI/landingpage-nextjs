import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";
import { BlogPostSchema } from "@/lib/validation";
import slugify from "@/utils/slugify";

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

async function getPostsHandler() {
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const posts = await db.collection("blogs").find().sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ posts });
}

async function createPostHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BlogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("codemate_blog");

    const baseSlug = slugify(parsed.data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await db.collection("blogs").findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const wordCount = calculateWordCount(parsed.data.content);
    const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = parsed.data.readTime || `${calculatedMinutes} min read`;
    const published = parsed.data.published;
    const publishedAt = published ? new Date() : null;
    const publishedVersion = published
      ? {
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
          readTime,
          publishedAtCustom: parsed.data.publishedAtCustom,
          sections: parsed.data.sections,
        }
      : null;

    const newPost = {
      ...parsed.data,
      slug: finalSlug,
      readTime,
      published,
      publishedAt,
      publishedVersion,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newPost);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = withAuth(getPostsHandler);
export const POST = withAuth(createPostHandler);
