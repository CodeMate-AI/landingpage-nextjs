import React from "react";
import clientPromise from "@/src/lib/mongodb";
import BlogFeedClient from "./BlogFeedClient";
import type { BlogDetailPost } from "@/types/blog";

export const revalidate = 60;

export default async function BlogFeedPage() {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const rawPosts = await db
      .collection("blogs")
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .toArray();

    const posts: BlogDetailPost[] = rawPosts.map((post) => ({
      id: post._id.toString(),
      slug: post.slug,
      title: post.title,
      category: post.category,
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Draft",
      dateValue: post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "",
      tags: post.tags || [],
      bgColor: post.bgColor || "#07111f",
      sections: post.sections || [],
      dek: post.excerpt || "",
      readTime: post.readTime || "1 min read",
      image: post.coverImage || "",
      coverImage: post.coverImage || "",
    }));

    return <BlogFeedClient posts={posts} />;
  } catch (error) {
    console.error("Failed to load blogs during build or render:", error);
    // Return empty feed to avoid crashing the build if MONGODB_URI is not set yet
    return <BlogFeedClient posts={[]} />;
  }
}
