import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import DOMPurify from "isomorphic-dompurify";
import clientPromise from "@/src/lib/mongodb";
import { extensions } from "@/src/lib/tiptap-extensions";
import BlogPostClient from "./BlogPostClient";
import { after } from "next/server";


export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

function extractSectionsFromTiptapJson(content: any): { id: string; title: string }[] {
  const sections: { id: string; title: string }[] = [];
  const idCounts: Record<string, number> = {};

  if (!content || !content.content) return sections;

  for (const node of content.content) {
    if (node.type === "heading" && node.attrs?.level === 2) {
      let title = "";
      if (node.content) {
        title = node.content.map((c: any) => c.text || "").join("");
      }
      if (title) {
        const baseId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        let id = baseId;
        if (idCounts[baseId] !== undefined) {
          idCounts[baseId]++;
          id = `${baseId}-${idCounts[baseId]}`;
        } else {
          idCounts[baseId] = 0;
        }
        sections.push({ id, title });
      }
    }
  }
  return sections;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const post = await db.collection("blogs").findOne({ slug, published: true });

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | CodeMate AI Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const post = await db.collection("blogs").findOne({ slug, published: true });

  if (!post) notFound();

  after(async () => {
    try {
      const client = await clientPromise;
      const db = client.db("codemate_blog");
      await db.collection("blogs").updateOne({ slug }, { $inc: { views: 1 } });
    } catch (err) {
      console.error("View increment failed inside after:", err);
    }
  });

  if (!post.content || typeof post.content !== "object" || post.content.type !== "doc") {
    throw new Error("Corrupted Tiptap payload template format detected.");
  }

  const rawHtml = generateHTML(post.content, extensions);
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["h1", "h2", "h3", "p", "a", "img", "ul", "ol", "li", "strong", "em", "code", "pre"],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel", "id"],
  });

  const sections = extractSectionsFromTiptapJson(post.content);

  const mappedPost = {
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
    tags: post.tags,
    bgColor: "#07111f",
    sections,
    dek: post.excerpt,
    readTime: post.readTime,
    htmlContent: cleanHtml,
  };

  const rawSiblings = await db
    .collection("blogs")
    .find({ published: true, slug: { $ne: slug } })
    .limit(3)
    .toArray();

  const siblings = rawSiblings.map((s) => ({
    id: s._id.toString(),
    slug: s.slug,
    title: s.title,
    category: s.category,
    date: s.publishedAt ? new Date(s.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "",
    tags: s.tags,
    bgColor: "#07111f",
    sections: [],
    dek: s.excerpt,
    readTime: s.readTime,
  }));

  return <BlogPostClient post={mappedPost as any} posts={siblings as any} />;
}
