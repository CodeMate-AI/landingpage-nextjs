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

function determineHighestHeadingLevel(content: any): number {
  if (!content || !content.content) return 2;
  let minLevel = 99;
  for (const node of content.content) {
    if (node.type === "heading" && node.attrs?.level) {
      const lvl = node.attrs.level;
      // We start tracking from level 2 (h2) because level 2 (h2) is mapped
      // visually to "Heading 1" in the CMS editor toolbar dropdown UI.
      if (lvl >= 2 && lvl <= 4 && lvl < minLevel) {
        minLevel = lvl;
      }
    }
  }
  return minLevel === 99 ? 2 : minLevel;
}

function extractSectionsFromTiptapJson(content: any): { id: string; title: string }[] {
  const sections: { id: string; title: string }[] = [];
  const idCounts: Record<string, number> = {};

  if (!content || !content.content) return sections;
  const targetLevel = determineHighestHeadingLevel(content);

  for (const node of content.content) {
    if (node.type === "heading" && node.attrs?.level === targetLevel) {
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

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getHighestHeadingTag(html: string): string {
  // We prioritize h2 as the highest heading tag because h2 is mapped
  // visually to "Heading 1" in the CMS editor toolbar dropdown UI.
  if (html.includes("<h2")) return "h2";
  if (html.includes("<h3")) return "h3";
  if (html.includes("<h4")) return "h4";
  return "h2";
}

const ID_ATTR_PATTERN = /\s*id=(?:"[^"]*"|'[^']*'|[^\s>]+)/g;

function injectHeadingIds(html: string, sections: { id: string; title: string }[]): string {
  const getHeadingText = (headingHtml: string) => headingHtml.replace(/<[^>]*>/g, "").trim();
  const tag = getHighestHeadingTag(html);
  const H2_PATTERN_SOURCE = `<${tag}([^>]*)>([\\s\\S]*?)<\\/${tag}>`;

  const headingTextContents: string[] = [];
  const scanRegex = new RegExp(H2_PATTERN_SOURCE, "g");
  let match;
  while ((match = scanRegex.exec(html)) !== null) {
    headingTextContents.push(getHeadingText(match[2]));
  }

  const claimedIds = new Set<string>();
  const matchedIdsByIndex = new Array<string | null>(headingTextContents.length).fill(null);

  for (let i = 0; i < headingTextContents.length; i++) {
    const text = headingTextContents[i];
    const slugifiedText = slugifyHeading(text);
    const textMatch = sections.find((s) => slugifyHeading(s.title) === slugifiedText && !claimedIds.has(s.id));
    if (textMatch) {
      claimedIds.add(textMatch.id);
      matchedIdsByIndex[i] = textMatch.id;
    }
  }

  const unclaimedQueue = sections.filter((s) => !claimedIds.has(s.id));
  const usedSlugIds = new Set<string>(sections.map((s) => s.id));

  let replaceIndex = 0;
  const replaceRegex = new RegExp(H2_PATTERN_SOURCE, "g");
  return html.replace(replaceRegex, (match, attributes, headingContent) => {
    const currentIndex = replaceIndex++;
    const text = getHeadingText(headingContent);
    const cleanedAttributes = attributes.replace(ID_ATTR_PATTERN, "").trim();
    const attrString = cleanedAttributes ? ` ${cleanedAttributes}` : "";

    const contentMatchedId = matchedIdsByIndex[currentIndex];
    if (contentMatchedId) {
      return `<${tag}${attrString} id="${contentMatchedId}">${headingContent}</${tag}>`;
    }

    const nextUnclaimed = unclaimedQueue.shift();
    if (nextUnclaimed) {
      return `<${tag}${attrString} id="${nextUnclaimed.id}">${headingContent}</${tag}>`;
    }

    const baseSlug = slugifyHeading(text);
    let finalSlug = baseSlug;
    let counter = 1;
    while (usedSlugIds.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugIds.add(finalSlug);

    return `<${tag}${attrString} id="${finalSlug}">${headingContent}</${tag}>`;
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

function formatLogos(html: string): string {
  const logoRegex = /<p>\s*\[logos:\s*([\s\S]*?)\]\s*<\/p>/g;
  return html.replace(logoRegex, (match, content) => {
    const items = content
      .split(",")
      .map((item: string) => {
        const parts = item.split("|").map((p) => p.trim());
        return {
          src: parts[0] || "",
          name: parts[1] || "",
          tag: parts[2] || "",
        };
      })
      .filter((item: any) => item.src);

    let gridHtml = '<div class="logo-grid my-8 grid grid-cols-1 gap-6 sm:grid-cols-3">';
    for (const item of items) {
      let scale = "scale(1)";
      if (item.name.toLowerCase().includes("maruti")) scale = "scale(1.85)";
      else if (item.name.toLowerCase().includes("tvs")) scale = "scale(2.2)";
      else if (item.name.toLowerCase().includes("hp")) scale = "scale(1.3)";

      gridHtml += `
        <div class="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/15">
          <div class="flex h-20 w-full items-center justify-center overflow-hidden p-2">
            <img
              src="${item.src}"
              alt="${item.name}"
              class="max-h-16 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
              style="transform: ${scale};"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span class="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            ${item.tag}
          </span>
        </div>
      `;
    }
    gridHtml += '</div>';
    return gridHtml;
  });
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

function formatVideos(html: string): string {
  return html.replace(/<p>\s*\[video:\s*([^\]\s]+)\]\s*<\/p>/g, (match, url) => {
    return `<video src="${url}" controls muted class="blog-video" style="width: 100%; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08); margin: 24px 0; display: block;"></video>`;
  });
}

function formatLinks(html: string): string {
  // Regex to match href="..." attributes in <a> tags
  return html.replace(/<a\s+([^>]*?)href=["']([^"']*)["']([^>]*?)>/gi, (match, before, href, after) => {
    const trimmedHref = href.trim();
    // If it lacks a protocol, anchor, relative path, or protocol-relative prefix
    if (trimmedHref && !/^(https?:\/\/|mailto:|tel:|sms:|#|\/|\.\/|\.\.\/|\/\/)/i.test(trimmedHref)) {
      const fixedHref = `https://${trimmedHref}`;
      return `<a ${before}href="${fixedHref}"${after}>`;
    }
    return match;
  });
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
    ALLOWED_TAGS: ["h1", "h2", "h3", "p", "a", "img", "ul", "ol", "li", "strong", "em", "code", "pre", "table", "thead", "tbody", "tr", "th", "td", "span", "div", "video"],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel", "id", "title", "controls", "muted", "autoplay", "loop", "playsinline", "type"],
  });

  const sections = post.sections && post.sections.length > 0 ? post.sections : extractSectionsFromTiptapJson(post.content);
  const headingHtml = injectHeadingIds(cleanHtml, sections);
  const finalHtml = formatLinks(formatLogos(formatVideos(formatFaqSection(formatTableCells(headingHtml)))));

  const mappedPost = {
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
    tags: post.tags,
    bgColor: post.bgColor || "#07111f",
    sections,
    dek: post.excerpt,
    readTime: post.readTime,
    htmlContent: finalHtml,
    author: post.author || "Ayush Singhal",
    authorRole: post.authorRole || "Founder & CEO",
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
    date: s.publishedAtCustom
      ? s.publishedAtCustom
      : s.publishedAt
        ? new Date(s.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "",
    tags: s.tags,
    bgColor: s.bgColor || "#07111f",
    sections: [],
    dek: s.excerpt,
    readTime: s.readTime,
    author: s.author || "Ayush Singhal",
    authorRole: s.authorRole || "Founder & CEO",
    visualMarkup: s.coverImage
      ? `<img src="${s.coverImage}" alt="${s.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
      : "",
  }));

  return <BlogPostClient post={mappedPost as any} posts={siblings as any} />;
}
