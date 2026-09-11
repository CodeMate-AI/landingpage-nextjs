import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { compileTiptapToHtml } from "@/lib/blog-compiler";
import BlogPostClient from "./BlogPostClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const posts = await db
      .collection("blogs")
      .find({ published: true })
      .project({ slug: 1 })
      .toArray();

    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn("Could not prefetch static params for blogs during build:", error);
    return [];
  }
}

const getPostBySlug = React.cache(async (slug: string) => {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    return await db.collection("blogs").findOne({ slug, published: true });
  } catch (error) {
    console.error(`Failed to fetch blog post for slug "${slug}":`, error);
    return null;
  }
});

const getRelatedAndNavPosts = React.cache(async () => {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    return await db
      .collection("blogs")
      .find({ published: true })
      .project({
        slug: 1,
        publishedAt: 1,
        title: 1,
        category: 1,
        tags: 1,
        coverImage: 1,
        subheading: 1,
        readTime: 1,
        author: 1,
        authorRole: 1,
        authorImage: 1,
        publishedAtCustom: 1,
        "publishedVersion.title": 1,
        "publishedVersion.category": 1,
        "publishedVersion.tags": 1,
        "publishedVersion.coverImage": 1,
        "publishedVersion.subheading": 1,
        "publishedVersion.readTime": 1,
        "publishedVersion.author": 1,
        "publishedVersion.authorRole": 1,
        "publishedVersion.authorImage": 1,
        "publishedVersion.publishedAtCustom": 1,
      })
      .sort({ publishedAt: -1 })
      .toArray();
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: "Post Not Found | CodeMate AI Blog",
      };
    }

    const source = post.publishedVersion || post;
    const desc = source.subheading || "Read this article on the CodeMate AI Blog.";
    const truncatedDesc = desc.length > 160 ? desc.slice(0, 157) + "..." : desc;

    const imageUrl = source.coverImage
      ? source.coverImage.startsWith("http")
        ? source.coverImage
        : `https://codemate.ai${source.coverImage.startsWith("/") ? "" : "/"}${source.coverImage}`
      : null;

    return {
      title: `${source.title} | CodeMate AI Blog`,
      description: truncatedDesc,
      openGraph: {
        title: source.title,
        description: desc,
        url: `https://codemate.ai/blog/${slug}`,
        siteName: "CodeMate AI Blog",
        type: "article",
        images: imageUrl ? [{ url: imageUrl, alt: source.title }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: source.title,
        description: desc,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Blog Post | CodeMate AI Blog",
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const source = post.publishedVersion || post;

  if (!source.content || typeof source.content !== "object" || source.content.type !== "doc") {
    notFound();
  }

  const { html: finalHtml, sections } = compileTiptapToHtml(source.content, source.sections, source.subheading);

  const mappedPost = {
    id: post._id.toString(),
    slug: post.slug,
    title: source.title,
    category: source.category,
    date: source.publishedAtCustom
      ? source.publishedAtCustom
      : post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Draft",
    dateValue: post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "",
    tags: source.tags,
    sections,
    dek: source.subheading || "",
    readTime: source.readTime,
    htmlContent: finalHtml,
    author: source.author || "",
    authorRole: source.authorRole || "",
    authorImage: source.authorImage || "",
  };

  const rawAllPosts = await getRelatedAndNavPosts();

  const allPosts = rawAllPosts.map((s: any) => {
    const sSource = s.publishedVersion || s;
    const safeCoverImage = (sSource.coverImage || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const safeTitle = (sSource.title || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return {
      id: s._id.toString(),
      slug: s.slug,
      title: sSource.title,
      category: sSource.category,
      date: sSource.publishedAtCustom
        ? sSource.publishedAtCustom
        : s.publishedAt
          ? new Date(s.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "",
      tags: sSource.tags,
      sections: [],
      dek: sSource.subheading || "",
      readTime: sSource.readTime,
      author: sSource.author || "",
      authorRole: sSource.authorRole || "",
      authorImage: sSource.authorImage || "",
      visualMarkup: safeCoverImage
        ? `<img src="${safeCoverImage}" alt="${safeTitle}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
        : "",
    };
  });

  return <BlogPostClient post={mappedPost as any} posts={allPosts as any} />;
}
