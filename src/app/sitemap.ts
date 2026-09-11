import type { MetadataRoute } from "next";
import clientPromise from "@/lib/mongodb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://codemate.ai";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/download`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const posts = await db
      .collection("blogs")
      .find({ published: true })
      .project({ slug: 1, updatedAt: 1, publishedAt: 1 })
      .toArray();

    if (posts && posts.length > 0) {
      blogRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : post.publishedAt ? new Date(post.publishedAt) : lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.warn("Could not dynamically load blog posts for sitemap, using fallback slugs:", error);
  }

  // Fallback core blog post slugs if db is empty or failed
  if (blogRoutes.length === 0) {
    const fallbackSlugs = [
      "cora-sota-swe-bench",
      "codemate-vs-github-copilot",
      "codemate-vs-claude-code",
      "hidden-dangers-of-autonomous-ai",
    ];
    blogRoutes = fallbackSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  }

  return [...staticRoutes, ...blogRoutes];
}
