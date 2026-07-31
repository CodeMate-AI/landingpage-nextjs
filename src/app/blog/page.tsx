import React from "react";
import clientPromise from "@/lib/mongodb";
import BlogFeedClient from "./BlogFeedClient";
import type { BlogDetailPost } from "@/types/blog";

export const revalidate = 60;

export default async function BlogFeedPage() {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");

    // Fetch posts and filter options in parallel
    const [rawPosts, filterDoc] = await Promise.all([
      db.collection("blogs").find({ published: true }).sort({ publishedAt: -1 }).toArray(),
      db.collection("filter_options").findOne({ _id: "global_filters" as any }),
    ]);

    const posts: BlogDetailPost[] = rawPosts.map((post) => ({
      id: post._id.toString(),
      slug: post.slug,
      title: post.title,
      category: post.category,
      date: post.publishedAtCustom
        ? post.publishedAtCustom
        : post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "Draft",
      dateValue: post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "",
      tags: post.tags || [],
      filterLabels:
        post.filterLabels ||
        post.tags?.map((t: any) => t.label.trim().toUpperCase()) ||
        [],
      bgColor: post.bgColor || "#07111f",
      sections: post.sections || [],
      dek: post.subheading || post.excerpt || "",
      readTime: post.readTime || "1 min read",
      image: post.coverImage || "",
      coverImage: post.coverImage || "",
      author: post.author || "Ayush Singhal",
      authorRole: post.authorRole || "Founder & CEO",
    }));

    const filterOptions = filterDoc
      ? {
          categories: filterDoc.categories ?? [],
          productFilters: filterDoc.productFilters ?? [],
          useCaseFilters: filterDoc.useCaseFilters ?? [],
        }
      : undefined;

    return <BlogFeedClient posts={posts} filterOptions={filterOptions} />;
  } catch (error) {
    console.error("Failed to load blogs during build or render:", error);
    // Return empty feed to avoid crashing the build if MONGODB_URI is not set yet
    return <BlogFeedClient posts={[]} />;
  }
}
