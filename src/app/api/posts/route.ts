import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { BlogDetailPost } from "@/types/blog";
import { calculateReadTime } from "@/lib/blog-compiler";

// Public endpoint for paginated and filtered published blog articles
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "6", 10);

    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const limit = Math.max(1, Math.min(24, isNaN(limitParam) ? 6 : limitParam));
    const skip = (page - 1) * limit;

    const category = searchParams.get("category")?.trim();
    const tag = searchParams.get("tag")?.trim();
    const search = searchParams.get("search")?.trim();

    const client = await clientPromise;
    const db = client.db("codemate_blog");

    // Strictly enforce published: true
    const query: any = { published: true };

    if (category) {
      query.$or = [
        { category: category },
        { "publishedVersion.category": category },
      ];
    }

    if (tag) {
      const tagUpper = tag.toUpperCase();
      const tagCondition = [
        { "tags.label": { $regex: `^${tag}$`, $options: "i" } },
        { "publishedVersion.tags.label": { $regex: `^${tag}$`, $options: "i" } },
        { filterLabels: tagUpper },
        { "publishedVersion.filterLabels": tagUpper },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: tagCondition }];
        delete query.$or;
      } else {
        query.$or = tagCondition;
      }
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchCondition = [
        { title: searchRegex },
        { subheading: searchRegex },
        { "publishedVersion.title": searchRegex },
        { "publishedVersion.subheading": searchRegex },
      ];
      if (query.$and) {
        query.$and.push({ $or: searchCondition });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchCondition }];
        delete query.$or;
      } else {
        query.$or = searchCondition;
      }
    }

    const [total, rawPosts] = await Promise.all([
      db.collection("blogs").countDocuments(query),
      db
        .collection("blogs")
        .find(query)
        .project({
          content: 0,
          "publishedVersion.content": 0,
        })
        .sort({ publishedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    const posts: BlogDetailPost[] = rawPosts.map((post) => {
      const source = post.publishedVersion || post;
      return {
        id: post._id.toString(),
        slug: post.slug,
        title: source.title,
        category: source.category,
        date: source.publishedAtCustom
          ? source.publishedAtCustom
          : post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Draft",
        dateValue: post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "",
        tags: source.tags || [],
        filterLabels:
          source.filterLabels ||
          source.tags?.map((t: any) => t.label.trim().toUpperCase()) ||
          [],
        sections: source.sections || [],
        dek: source.subheading || "",
        readTime: source.readTime?.trim() || calculateReadTime(source.content),
        coverImage: source.coverImage || "",
        author: source.author || "",
        authorRole: source.authorRole || "",
        authorImage: source.authorImage || "",
      };
    });

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
  } catch (error) {
    console.error("Failed to fetch public posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
