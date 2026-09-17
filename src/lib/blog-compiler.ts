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

export function escapeHtml(str: string): string {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) || /^\//.test(trimmed) || /^\.\//.test(trimmed);
}

function formatLogos(html: string): string {
  const logoRegex = /(?:<p>\s*)?\[logos:\s*([\s\S]*?)\](?:\s*<\/p>)?/gi;
  return html.replace(logoRegex, (match, content) => {
    // Strip any inner HTML tags (e.g. <a href="...">...</a> or &lt;a href="..."&gt;...&lt;/a&gt;)
    const cleanContent = content
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;[^&]*?&gt;/gi, "")
      .trim();
    if (!cleanContent) return "";

    // Split on comma boundaries followed by a URL pattern to protect roles containing commas
    const entryDelimRegex = /,\s*(?=(?:https?:\/\/|\/|\.\/))/gi;
    const rawEntries = cleanContent.split(entryDelimRegex);

    const items = rawEntries
      .map((item: string) => {
        const parts = item.split("|").map((p) => p.trim());
        return {
          src: parts[0] || "",
          name: parts[1] || "",
          tag: parts[2] || "",
        };
      })
      .filter((item: { src: string; name: string; tag: string }) => item.src && isSafeUrl(item.src));

    if (items.length === 0) return "";

    let gridHtml = '<div class="logo-grid">';
    for (const item of items) {
      const lower = item.name.toLowerCase();
      let logoClass = "";
      if (lower.includes("maruti")) logoClass = "logo-img-maruti";
      else if (lower.includes("tvs")) logoClass = "logo-img-tvs";
      else if (lower.includes("hp")) logoClass = "logo-img-hp";

      const safeSrc = escapeHtml(item.src);
      const safeName = escapeHtml(item.name);
      const safeTag = escapeHtml(item.tag);
      const safeClass = logoClass ? ` class="${logoClass}"` : "";

      gridHtml += `
        <div class="logo-grid-card">
          <div class="logo-img-wrap">
            <img
              src="${safeSrc}"
              alt="${safeName}"${safeClass}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          </div>
          ${safeTag ? `<span class="logo-tag">${safeTag}</span>` : ""}
        </div>
      `;
    }
    gridHtml += "</div>";
    return gridHtml;
  });
}

function formatFaqSection(html: string): string {
  const faqHeadingRegex = /<h([2-4])[^>]*>([\s\S]*?(?:Frequently Asked Questions|FAQ|FAQs|Questions & Answers)[\s\S]*?)<\/h\1>/i;
  const match = html.match(faqHeadingRegex);
  if (!match || match.index == null) return html;

  const headingIndex = match.index;
  const headingLength = match[0].length;

  const afterHeading = html.substring(headingIndex + headingLength);

  // Find where the FAQ section ends (next heading or end of string)
  const nextHeadingMatch = afterHeading.match(/<h[1-6][^>]*>/i);
  const faqSectionEndIndex = nextHeadingMatch && nextHeadingMatch.index != null ? nextHeadingMatch.index : afterHeading.length;

  const faqRawContent = afterHeading.substring(0, faqSectionEndIndex);
  const remainingContent = afterHeading.substring(faqSectionEndIndex);

  const items: { question: string; answer: string }[] = [];

  // 1. Check for [faq: Question | Answer] shortcodes
  const shortcodeRegex = /\[faq:\s*([^|\]]+)\|\s*([\s\S]*?)\]/gi;
  let hasShortcode = false;
  let scMatch: RegExpExecArray | null;
  while ((scMatch = shortcodeRegex.exec(faqRawContent)) !== null) {
    hasShortcode = true;
    items.push({
      question: scMatch[1].trim(),
      answer: scMatch[2].trim(),
    });
  }

  if (!hasShortcode) {
    // 2. Stream-based question boundary extraction
    // Normalize raw content: replace <br> with newlines and strip extraneous HTML tags except text
    const normalizedText = faqRawContent
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>\s*<p>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Sentence-boundary capitalized question matcher (strictly uppercase words or markers)
    const questionRegex = /(?:^|(?<=[.!?\n]\s+))(?:(?:\+|•|&bull;|&#8226;|\u2022|\*|-|Q:|Question:|\d+[\.\)])\s*)?((?:(?:What|How|Why|When|Where|Who|Which|Is|Are|Can|Could|Should|Would|Will|Do|Does|Have|Has|Whom|Whose)\b|(?:\+|•|\*|-|Q:))[^?]{2,200}\?)/g;

    const questionMatches: { fullStart: number; start: number; end: number; question: string }[] = [];
    let qm: RegExpExecArray | null;
    while ((qm = questionRegex.exec(normalizedText)) !== null) {
      const matchFull = qm[0];
      const matchQuestion = qm[1];
      const matchIndex = qm.index + (matchFull.length - matchQuestion.length);
      questionMatches.push({
        fullStart: qm.index,
        start: matchIndex,
        end: matchIndex + matchQuestion.length,
        question: matchQuestion.trim(),
      });
    }

    if (questionMatches.length > 0) {
      for (let i = 0; i < questionMatches.length; i++) {
        const cur = questionMatches[i];
        const next = questionMatches[i + 1];
        const rawAnswer = next
          ? normalizedText.substring(cur.end, next.fullStart).trim()
          : normalizedText.substring(cur.end).trim();

        const cleanQ = cur.question
          .replace(/^\s*(?:\+|•|&bull;|&#8226;|\u2022|\*|-|Q:|Question:|\d+[\.\)])\s*/i, "")
          .trim();
        const cleanA = rawAnswer
          .replace(/^\s*(?:A:|Answer:)\s*/i, "")
          .replace(/[\s+•*—–-]+$/, "")
          .trim();

        if (cleanQ) {
          items.push({
            question: cleanQ,
            answer: cleanA || "No answer provided.",
          });
        }
      }
    }
  }

  if (items.length === 0) return html;

  let faqContainerHtml = '<div class="faq-pill-container">';
  for (const item of items) {
    const cleanQ = escapeHtml(item.question.replace(/^\s*(?:\+|•|&bull;|&#8226;|\u2022|\*|-|Q:|Question:|\d+[\.\)])\s*/i, "").trim());
    let answerHtml = item.answer.trim();
    if (!answerHtml.startsWith("<p>") && !answerHtml.startsWith("<div>")) {
      answerHtml = `<p>${escapeHtml(answerHtml)}</p>`;
    }

    faqContainerHtml += `
      <div class="faq-pill-card">
        <button type="button" class="faq-pill-summary">
          <span class="faq-circle-badge">+</span>
          <span class="faq-question-title">${cleanQ}</span>
        </button>
        <div class="faq-answer-body">
          ${answerHtml}
        </div>
      </div>
    `;
  }
  faqContainerHtml += "</div>";

  const beforeHeading = html.substring(0, headingIndex);
  return beforeHeading + match[0] + faqContainerHtml + remainingContent;
}

function formatVideos(html: string): string {
  const videoRegex = /(?:<p>\s*)?\[video:\s*([\s\S]*?)\](?:\s*<\/p>)?/gi;
  return html.replace(videoRegex, (match, rawUrl) => {
    // Strip any inner anchor or span HTML tags from TipTap auto-linking or entity escaped tags
    const cleanUrl = rawUrl
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;[^&]*?&gt;/gi, "")
      .trim();
    if (!cleanUrl) return "";

    if (!isSafeUrl(cleanUrl)) {
      return `<div class="video-embed-warning p-3 my-4 rounded-lg border border-amber-800 bg-amber-950/40 text-amber-300 text-xs font-mono">Invalid or unsafe video URL</div>`;
    }

    const safeUrl = escapeHtml(cleanUrl);

    // 1. YouTube Embed Detection
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      return `<div class="video-embed-container my-6" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe></div>`;
    }

    // 2. Vimeo Embed Detection
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
    if (vimeoMatch && vimeoMatch[3]) {
      const videoId = vimeoMatch[3];
      return `<div class="video-embed-container my-6" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);"><iframe src="https://player.vimeo.com/video/${videoId}" title="Vimeo video player" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe></div>`;
    }

    // 3. Direct Playable Video Files (.mp4, .webm, .ogg, .mov, etc.), blob URLs, or CodeMate backend media uploads
    const isDirectVideo =
      /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(cleanUrl) ||
      cleanUrl.startsWith("blob:") ||
      /\/uploaded\/images\/[a-f0-9-]+/i.test(cleanUrl);
    if (isDirectVideo) {
      return `<div class="video-embed-container my-6"><video src="${safeUrl}" controls muted playsinline preload="metadata" class="blog-video" style="width: 100%; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08); display: block;"></video></div>`;
    }

    // 4. Fallback for non-embeddable pages
    return `<div class="video-embed-warning p-3 my-4 rounded-lg border border-amber-800/80 bg-amber-950/30 text-amber-300 text-xs"><span class="font-semibold uppercase">Video Notice:</span> URL is not a direct video file or supported embed: <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="underline text-blue-400 font-mono">${safeUrl}</a></div>`;
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

function extractPlainTextFromNode(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(extractPlainTextFromNode).join("");
  }
  return "";
}

export function stripDuplicateSubheadingNode(content: any, subheading?: string): any {
  if (!subheading || !subheading.trim() || !content || !Array.isArray(content.content) || content.content.length === 0) {
    return content;
  }

  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanSub = normalize(subheading);
  if (!cleanSub) return content;

  const firstNode = content.content[0];
  if (firstNode && firstNode.type === "paragraph") {
    const firstText = normalize(extractPlainTextFromNode(firstNode));
    if (firstText && (firstText === cleanSub || cleanSub.startsWith(firstText) || firstText.startsWith(cleanSub))) {
      return {
        ...content,
        content: content.content.slice(1),
      };
    }
  }

  return content;
}

export function compileTiptapToHtml(
  content: any,
  customSections?: { id: string; title: string }[],
  subheading?: string
): { html: string; sections: { id: string; title: string }[] } {
  if (!content || typeof content !== "object" || content.type !== "doc") {
    return { html: "", sections: [] };
  }

  const sanitizedContent = stripDuplicateSubheadingNode(content, subheading);
  const rawHtml = generateHTML(sanitizedContent, extensions);
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

  const sections = customSections && customSections.length > 0 ? customSections : extractSectionsFromTiptapJson(sanitizedContent);
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
