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

  const url = `https://codemate.ai/blog/${slug}`;
  const ogImage = post.coverImage?.startsWith("http")
    ? post.coverImage
    : post.coverImage
    ? `https://codemate.ai${post.coverImage}`
    : "https://codemate.ai/og-image.png";

  return {
    title: `${post.title} | CodeMate AI Blog`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} | CodeMate AI Blog`,
      description: post.excerpt,
      url,
      siteName: "CodeMate AI",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author || "CodeMate AI"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | CodeMate AI Blog`,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

function injectHeadingIds(html: string, sections: { id: string; title: string }[]): string {
  let index = 0;
  return html.replace(/<h2>/g, () => {
    const section = sections[index++];
    return section ? `<h2 id="${section.id}">` : "<h2>";
  });
}

function formatTableCells(html: string): string {
  // 1. Wrap table elements in the container and add the clean-comparison-table class (allowing any attributes on table)
  let formatted = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/g, '<div class="clean-table-container"><table class="clean-comparison-table">$2</table></div>');

  // 2. Wrap the first <tr> row inside <thead> and the rest inside <tbody> (re-injecting structural standard HTML)
  formatted = formatted.replace(/<table class="clean-comparison-table">([\s\S]*?)<\/table>/g, (match, body) => {
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/;
    const trMatch = body.match(trRegex);
    if (trMatch) {
      const firstTr = trMatch[0];
      const rest = body.substring(trMatch.index + firstTr.length);
      return `<table class="clean-comparison-table"><thead>${firstTr}</thead><tbody>${rest}</tbody></table>`;
    }
    return match;
  });

  // 3. Map cells with ✓, ✕, check, or cross to their respective icon squares, and others to text badges
  formatted = formatted.replace(/<td>([\s\S]*?)<\/td>/g, (match, content) => {
    // Strip any internal HTML tags (like <p>) from the cell text before checking values
    const text = content.replace(/<[^>]*>/g, "").trim();
    if (text === "✓" || text === "check") {
      return `<td><span class="icon-square icon-square-check" title="Supported">✓</span></td>`;
    }
    if (text === "✕" || text === "cross" || text === "x" || text === "X") {
      return `<td><span class="icon-square icon-square-cross" title="Not supported">✕</span></td>`;
    }
    if (text && !text.startsWith("<span")) {
      return `<td><span class="badge-text-clean">${text}</span></td>`;
    }
    return match;
  });

  return formatted;
}

function formatFaqSection(html: string): string {
  // Find the FAQ heading and everything after it (allowing any attributes on h2 like dynamic IDs)
  const faqMatch = html.match(/<h2([^>]*)>Frequently Asked Questions<\/h2>([\s\S]*)/);
  if (!faqMatch) return html;

  const faqContent = faqMatch[2];
  // Match all paragraphs: <p>...</p>
  const paragraphs: string[] = [];
  const pRegex = /<p>([\s\S]*?)<\/p>/g;
  let pMatch;
  while ((pMatch = pRegex.exec(faqContent)) !== null) {
    paragraphs.push(pMatch[1].trim());
  }

  // Pair them up: if a paragraph starts with "+", it's a question, and the next paragraph is the answer!
  let faqContainerHtml = '<div class="faq-pill-container">';
  let questionCount = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    let text = paragraphs[i];
    if (text.startsWith("+")) {
      const question = text.substring(1).trim(); // strip the "+"
      const answer = paragraphs[i + 1] || "";
      faqContainerHtml += `<div class="faq-pill-card"><button type="button" class="faq-pill-summary"><span class="faq-circle-badge">+</span><span class="faq-question-title">${question}</span></button><div class="faq-answer-body"><p>${answer}</p></div></div>`;
      questionCount++;
      i++; // skip the answer paragraph
    }
  }
  faqContainerHtml += '</div>';

  if (questionCount === 0) return html;

  // Replace the old flat paragraphs in the HTML with our new styled FAQ container!
  const beforeFaq = html.substring(0, faqMatch.index) + `<h2${faqMatch[1]}>Frequently Asked Questions</h2>`;
  return beforeFaq + faqContainerHtml;
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
    ALLOWED_TAGS: ["h1", "h2", "h3", "p", "a", "img", "ul", "ol", "li", "strong", "em", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "span", "div"],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel", "id", "title"],
  });

  const sections = extractSectionsFromTiptapJson(post.content);
  const headingHtml = injectHeadingIds(cleanHtml, sections);
  const finalHtml = formatFaqSection(formatTableCells(headingHtml));

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
    bgColor: post.bgColor || "#07111f",
    sections,
    dek: post.excerpt,
    readTime: post.readTime,
    htmlContent: finalHtml,
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
    bgColor: s.bgColor || "#07111f",
    sections: [],
    dek: s.excerpt,
    readTime: s.readTime,
    visualMarkup: s.coverImage
      ? `<img src="${s.coverImage}" alt="${s.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
      : "",
  }));

  return <BlogPostClient post={mappedPost as any} posts={siblings as any} />;
}
