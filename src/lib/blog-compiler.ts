import { generateHTML } from "@tiptap/html";
import DOMPurify from "isomorphic-dompurify";
import { extensions } from "@/lib/tiptap-extensions";

function determineHighestHeadingLevel(content: any): number {
  if (!content || !content.content) return 2;
  let minLevel = 99;
  for (const node of content.content) {
    if (node.type === "heading" && node.attrs?.level) {
      const lvl = node.attrs.level;
      if (lvl >= 2 && lvl <= 4 && lvl < minLevel) {
        minLevel = lvl;
      }
    }
  }
  return minLevel === 99 ? 2 : minLevel;
}

export function extractSectionsFromTiptapJson(content: any): { id: string; title: string }[] {
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
        const baseId = slugifyHeading(title);
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

export function slugifyHeading(text: string): string {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return slug || "section";
}

function getHighestHeadingTag(html: string): string {
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
  return html.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (tableMatch, tableBody) => {
    const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows: string[] = [];
    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableBody)) !== null) {
      rows.push(rowMatch[1]);
    }

    if (rows.length === 0) return tableMatch;

    const [headerRow, ...bodyRows] = rows;

    const headerCellRegex = /<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
    let headerColIdx = 0;
    const formattedHeaderCells = headerRow.replace(headerCellRegex, (match, content) => {
      const text = content.replace(/<[^>]*>/g, "").trim();
      const colClass = headerColIdx === 0 ? "col-capability" : "col-product";
      headerColIdx++;
      return `<th scope="col" class="${colClass}">${text}</th>`;
    });

    const formattedBodyRows = bodyRows.map((row) => {
      const cellRegex = /<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
      let colIdx = 0;
      return `<tr>${row.replace(cellRegex, (match, content) => {
        const text = content.replace(/<[^>]*>/g, "").trim();
        const isFirstCol = colIdx === 0;
        colIdx++;

        if (isFirstCol) {
          return `<th scope="row" class="cell-capability">${text}</th>`;
        }

        const lower = text.toLowerCase();
        if (text === "✓" || lower === "check" || lower === "yes" || lower === "true") {
          return `<td class="cell-product"><span class="icon-square icon-square-check" title="Supported">✓</span></td>`;
        }
        if (text === "✕" || lower === "cross" || lower === "x" || lower === "no" || lower === "false") {
          return `<td class="cell-product"><span class="icon-square icon-square-cross" title="Not supported">✕</span></td>`;
        }
        if (text) {
          return `<td class="cell-product"><span class="badge-text-clean">${text}</span></td>`;
        }
        return `<td class="cell-product"></td>`;
      })}</tr>`;
    });

    return `<div class="clean-table-container my-6"><table class="clean-comparison-table"><thead><tr>${formattedHeaderCells}</tr></thead><tbody>${formattedBodyRows.join("")}</tbody></table></div>`;
  });
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

    let gridHtml = `
      <style>
        .logo-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        @media (min-width: 640px) {
          .logo-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .logo-grid-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background-color: #ffffff;
          padding: 1.5rem 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-grid-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(0, 191, 255, 0.3);
          box-shadow: 0 12px 24px -4px rgba(0, 191, 255, 0.12);
        }
        .logo-img-wrap {
          display: flex;
          height: 6rem;
          width: 100%;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          overflow: hidden;
        }
        .logo-img-wrap img {
          max-height: 4.5rem;
          width: auto;
          max-width: 85%;
          object-fit: contain;
          display: block;
          transform: scale(var(--logo-scale, 1));
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-grid-card:hover .logo-img-wrap img {
          transform: scale(calc(var(--logo-scale, 1) * 1.05));
        }
        .logo-img-maruti {
          --logo-scale: 1.35;
          border-radius: 6px;
        }
        .logo-img-tvs {
          --logo-scale: 1.5;
        }
        .logo-img-hp {
          --logo-scale: 1.25;
        }
        .logo-grid-card .logo-tag {
          margin-top: 0.85rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
        }
      </style>
      <div class="logo-grid">
    `;
    for (const item of items) {
      const lower = item.name.toLowerCase();
      let logoClass = "";
      if (lower.includes("maruti")) logoClass = "logo-img-maruti";
      else if (lower.includes("tvs")) logoClass = "logo-img-tvs";
      else if (lower.includes("hp")) logoClass = "logo-img-hp";

      gridHtml += `
        <div class="logo-grid-card">
          <div class="logo-img-wrap">
            <img
              src="${item.src}"
              alt="${item.name}"
              class="${logoClass}"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          </div>
          <span class="logo-tag">
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
  const faqHeadingRegex = /<h2([^>]*)>Frequently Asked Questions<\/h2>/i;
  const match = html.match(faqHeadingRegex);
  if (!match || match.index == null) return html;

  const headingIndex = match.index;
  const headingLength = match[0].length;

  const afterHeading = html.substring(headingIndex + headingLength);

  let faqContentLength = 0;
  let faqContainerHtml = '<div class="faq-pill-container">';
  let questionCount = 0;

  const qaPairRegex = /^\s*<p>\s*\+([\s\S]*?)<\/p>\s*<p>([\s\S]*?)<\/p>/i;

  let tempString = afterHeading;
  while (true) {
    const pairMatch = tempString.match(qaPairRegex);
    if (!pairMatch) break;

    const matchedText = pairMatch[0];
    const question = pairMatch[1].trim();
    const answer = pairMatch[2].trim();

    faqContainerHtml += `<div class="faq-pill-card"><button type="button" class="faq-pill-summary"><span class="faq-circle-badge">+</span><span class="faq-question-title">${question}</span></button><div class="faq-answer-body"><p>${answer}</p></div></div>`;
    questionCount++;

    faqContentLength += matchedText.length;
    tempString = tempString.substring(matchedText.length);
  }

  faqContainerHtml += '</div>';

  if (questionCount === 0) return html;

  const beforeHeading = html.substring(0, headingIndex);
  const remainingContent = afterHeading.substring(faqContentLength);

  return beforeHeading + match[0] + faqContainerHtml + remainingContent;
}

function formatVideos(html: string): string {
  return html.replace(/<p>\s*\[video:\s*([^\]\s]+)\]\s*<\/p>/g, (match, url) => {
    return `<video src="${url}" controls muted class="blog-video" style="width: 100%; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08); margin: 24px 0; display: block;"></video>`;
  });
}

function formatLinks(html: string): string {
  return html.replace(/<a\s+([^>]*?)href=["']([^"']*)["']([^>]*?)>/gi, (match, before, href, after) => {
    const trimmedHref = href.trim();
    if (trimmedHref && !/^(https?:\/\/|mailto:|tel:|sms:|#|\/|\.\/|\.\.\/|\/\/)/i.test(trimmedHref)) {
      const fixedHref = `https://${trimmedHref}`;
      return `<a ${before}href="${fixedHref}"${after}>`;
    }
    return match;
  });
}

export function compileTiptapToHtml(content: any, customSections?: { id: string; title: string }[]): { html: string; sections: { id: string; title: string }[] } {
  if (!content || typeof content !== "object" || content.type !== "doc") {
    return { html: "", sections: [] };
  }

  const rawHtml = generateHTML(content, extensions);
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "a", "img", "ul", "ol", "li", "strong", "em", "code", "pre",
      "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
      "span", "div", "video", "s", "del", "strike", "u", "sub", "sup", "mark",
      "input", "label", "blockquote", "hr", "br", "figure", "figcaption", "cite",
      "b", "i", "summary", "details"
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "class", "target", "rel", "id", "title",
      "controls", "muted", "autoplay", "loop", "playsinline", "type",
      "style", "checked", "disabled", "colspan", "rowspan", "colwidth",
      "width", "height", "name", "data-type", "data-checked"
    ],
  });

  const sections = customSections && customSections.length > 0 ? customSections : extractSectionsFromTiptapJson(content);
  const headingHtml = injectHeadingIds(cleanHtml, sections);
  const finalHtml = formatLinks(formatLogos(formatVideos(formatFaqSection(formatTableCells(headingHtml)))));

  return { html: finalHtml, sections };
}

// Recursively walks the Tiptap JSON AST to calculate total text word count
export function calculateWordCount(node: any): number {
  if (!node) return 0;
  let count = 0;
  if (node.text && typeof node.text === "string") {
    count += node.text.trim().split(/\s+/).filter(Boolean).length;
  }
  if (node.content && Array.isArray(node.content)) {
    for (const child of node.content) {
      count += calculateWordCount(child);
    }
  }
  return count;
}

// Computes reading duration (200 words per minute average), preserving custom input if present
export function calculateReadTime(content: any, customReadTime?: string): string {
  if (customReadTime && customReadTime.trim()) {
    return customReadTime.trim();
  }
  const wordCount = calculateWordCount(content);
  const calculatedMinutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${calculatedMinutes} min read`;
}

// Deeply compares current draft payload against the publishedVersion snapshot to detect genuine changes
export function hasActualDraftChanges(currentDraft: any, publishedVersion: any): boolean {
  if (!publishedVersion || typeof publishedVersion !== "object") return false;
  if (!currentDraft || typeof currentDraft !== "object") return false;

  const compareStr = (a: any, b: any) => (a ?? "").toString().trim() !== (b ?? "").toString().trim();

  if (compareStr(currentDraft.title, publishedVersion.title)) return true;
  if (compareStr(currentDraft.subheading, publishedVersion.subheading)) return true;
  if (compareStr(currentDraft.category, publishedVersion.category)) return true;
  if (compareStr(currentDraft.coverImage, publishedVersion.coverImage)) return true;
  if (compareStr(currentDraft.author, publishedVersion.author)) return true;
  if (compareStr(currentDraft.authorRole, publishedVersion.authorRole)) return true;
  if (compareStr(currentDraft.authorImage, publishedVersion.authorImage)) return true;
  if (compareStr(currentDraft.publishedAtCustom, publishedVersion.publishedAtCustom)) return true;

  const normalizeTags = (tags: any[]) =>
    Array.isArray(tags)
      ? tags.map((t) => (typeof t === "string" ? t.trim() : (t.label || "").trim())).filter(Boolean)
      : [];
  if (JSON.stringify(normalizeTags(currentDraft.tags)) !== JSON.stringify(normalizeTags(publishedVersion.tags))) {
    return true;
  }

  const normalizeFilters = (filters: any[]) =>
    Array.isArray(filters)
      ? filters.map((f) => String(f).trim().toUpperCase()).filter(Boolean)
      : [];
  if (
    JSON.stringify(normalizeFilters(currentDraft.filterLabels)) !==
    JSON.stringify(normalizeFilters(publishedVersion.filterLabels))
  ) {
    return true;
  }

  const normalizeSections = (sections: any[]) =>
    Array.isArray(sections)
      ? sections.map((s) => ({ id: (s.id || "").trim(), title: (s.title || "").trim() }))
      : [];
  if (
    JSON.stringify(normalizeSections(currentDraft.sections)) !==
    JSON.stringify(normalizeSections(publishedVersion.sections))
  ) {
    return true;
  }

  const draftContent = currentDraft.content || {};
  const publishedContent = publishedVersion.content || {};
  if (JSON.stringify(draftContent) !== JSON.stringify(publishedContent)) {
    return true;
  }

  return false;
}
