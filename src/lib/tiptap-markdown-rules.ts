import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { DOMParser } from "@tiptap/pm/model";

/**
 * Shared heading level mapping between typed InputRules and pasted markdown.
 * Maps markdown hash count to TipTap heading level.
 */
export const HEADING_LEVEL_MAP: Record<number, number> = {
  1: 2, // #    -> h2
  2: 3, // ##   -> h3
  3: 4, // ###  -> h4
  4: 4, // #### -> h4
};

export function getHeadingLevelFromHashes(hashesCount: number): number {
  return HEADING_LEVEL_MAP[hashesCount] || 4;
}

/**
 * Escapes HTML characters in text to prevent injection.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates if a URL uses a safe web protocol.
 * Rejects javascript:, data:, vbscript:, etc.
 */
export function isAllowedUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../")
  );
}

export const isSafeUrl = isAllowedUrl;

/**
 * Normalizes shortcodes ([video: ...], [logos: ...]) by stripping nested anchor tags.
 */
export function normalizeShortcodesPaste(content: string): string {
  return content
    // Normalize [video: ...]
    .replace(/\[video:\s*(?:<a\s+[^>]*href=["']([^"']*)["'][^>]*>[\s\S]*?<\/a>|([^\]\s]+))\s*\]/gi, (match, href, raw) => {
      const url = href || raw || "";
      return `[video: ${url.trim()}]`;
    })
    // Normalize [logos: ...]
    .replace(/\[logos:\s*([\s\S]*?)\]/gi, (match, inner) => {
      const stripped = inner.replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (aMatch: string, href: string, text: string) => {
        return href || text;
      });
      return `[logos: ${stripped.trim()}]`;
    });
}

/**
 * Formats inline markdown tokens with strict evaluation order.
 * Escapes HTML first, then evaluates:
 * 1. Inline code (protects contents from subsequent markdown rules)
 * 2. Links (with protocol allowlisting)
 * 3. Bold (** or __ before single * or _)
 * 4. Italic (* or _)
 * 5. Strikethrough (~~)
 */
export function formatInlineMarkdown(text: string): string {
  // Step 1: Escape HTML entities
  let result = escapeHtml(text);

  // Step 2: Extract inline code and store in an array to protect from subsequent rules
  const codeBlocks: string[] = [];
  result = result.replace(/`([^`\n]+)`/g, (match, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<code>${code}</code>`);
    return `\x00CODE_${idx}\x00`;
  });

  // Step 2.5: Markdown images with protocol validation (BEFORE links to avoid matching ![alt](url) as a link)
  result = result.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, rawUrl) => {
    const decodedUrl = rawUrl.replace(/&amp;/g, "&");
    if (isAllowedUrl(decodedUrl)) {
      return `<img src="${rawUrl}" alt="${alt}" />`;
    }
    return "";
  });

  // Step 3: Markdown links with protocol validation
  result = result.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, rawUrl) => {
    // rawUrl was already escaped by escapeHtml, but let's verify protocol
    const decodedUrl = rawUrl.replace(/&amp;/g, "&");
    if (isAllowedUrl(decodedUrl)) {
      return `<a href="${rawUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }
    return label;
  });

  // Step 4: Bold (before italic)
  result = result.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/(?<=^|[\s(])__([^_]+)__(?=[\s).,!?;:]|$)/g, "<strong>$1</strong>");

  // Step 5: Italic
  result = result.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  result = result.replace(/(?<=^|[\s(])_([^_ \t\n][^_]*?[^_ \t\n]|[^_ \t\n])_(?=[\s).,!?;:]|$)/g, "<em>$1</em>");

  // Step 6: Strikethrough
  result = result.replace(/~~([^~\n]+)~~/g, "<s>$1</s>");

  // Step 7: Restore code blocks
  result = result.replace(/\x00CODE_(\d+)\x00/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)] || "";
  });

  return result;
}

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 1;
}

function parseTableCells(line: string): string[] {
  const trimmed = line.trim();
  const stripped = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return stripped.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
}

function isTableDelimiterRow(line: string): boolean {
  if (!isTableRow(line)) return false;
  const cells = parseTableCells(line);
  if (cells.length === 0) return false;
  return cells.every((cell) => /^:?-{1,}:?$/.test(cell));
}

/**
 * Converts a plain-text markdown snippet or document into standard HTML for ProseMirror DOMParser.
 */
export function convertMarkdownToHtml(rawText: string): string {
  const normalized = normalizeShortcodesPaste(rawText);
  const lines = normalized.split(/\r?\n/);

  let html = "";
  let inTaskList = false;
  let inBulletList = false;
  let inOrderedList = false;
  let inBlockquote = false;

  const closeOpenLists = () => {
    if (inTaskList) {
      html += "</ul>";
      inTaskList = false;
    }
    if (inBulletList) {
      html += "</ul>";
      inBulletList = false;
    }
    if (inOrderedList) {
      html += "</ol>";
      inOrderedList = false;
    }
    if (inBlockquote) {
      html += "</blockquote>";
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      closeOpenLists();
      continue;
    }

    // -1. Fenced Code Block (```lang ... ``` or ~~~lang ... ~~~)
    const codeFenceMatch = line.match(/^(?:```|~~~)([a-zA-Z0-9_+-]*)\s*$/);
    if (codeFenceMatch) {
      closeOpenLists();
      const language = codeFenceMatch[1] || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```") && !lines[i].trim().startsWith("~~~")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      const codeContent = codeLines.join("\n");
      const langAttr = language ? ` class="language-${escapeHtml(language)}"` : "";
      html += `<pre><code${langAttr}>${codeContent}</code></pre>`;
      continue;
    }

    // -0.5. Standalone Image (![alt](url))
    const standaloneImgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (standaloneImgMatch) {
      closeOpenLists();
      const alt = escapeHtml(standaloneImgMatch[1].trim());
      const rawUrl = standaloneImgMatch[2].trim();
      if (isAllowedUrl(rawUrl)) {
        html += `<p><img src="${escapeHtml(rawUrl)}" alt="${alt}" /></p>`;
        continue;
      }
    }

    // 0. Markdown Table (| col1 | col2 |)
    if (isTableRow(trimmed)) {
      closeOpenLists();
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--; // Step back one since the loop increments i

      if (tableLines.length > 0) {
        const headerCells = parseTableCells(tableLines[0]);
        let bodyStartIdx = 1;

        if (tableLines.length > 1 && isTableDelimiterRow(tableLines[1])) {
          bodyStartIdx = 2;
        }

        html += "<table><thead><tr>";
        for (const hCell of headerCells) {
          html += `<th><p>${formatInlineMarkdown(hCell)}</p></th>`;
        }
        html += "</tr></thead><tbody>";

        for (let r = bodyStartIdx; r < tableLines.length; r++) {
          const rowCells = parseTableCells(tableLines[r]);
          html += "<tr>";
          const colCount = Math.max(headerCells.length, rowCells.length);
          for (let c = 0; c < colCount; c++) {
            const cellText = rowCells[c] || "";
            html += `<td><p>${formatInlineMarkdown(cellText)}</p></td>`;
          }
          html += "</tr>";
        }

        html += "</tbody></table>";
        continue;
      }
    }

    // 1. Task Item / Checklist (- [x], - [ ], * [x], [x], [ ])
    const taskMatch = line.match(/^\s*(?:[-*+]\s+)?\[([ xX])\]\s*(.*)$/);
    if (taskMatch) {
      if (inBulletList || inOrderedList || inBlockquote) {
        closeOpenLists();
      }
      if (!inTaskList) {
        html += '<ul data-type="taskList">';
        inTaskList = true;
      }
      const isChecked = taskMatch[1].toLowerCase() === "x";
      const itemContent = formatInlineMarkdown(taskMatch[2].trim());
      html += `<li data-type="taskItem" data-checked="${isChecked}"><p>${itemContent}</p></li>`;
      continue;
    }

    // 2. Headings (#, ##, ###, ####)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeOpenLists();
      const hashes = headingMatch[1].length;
      const level = getHeadingLevelFromHashes(hashes);
      const headingContent = formatInlineMarkdown(headingMatch[2].trim());
      html += `<h${level}>${headingContent}</h${level}>`;
      continue;
    }

    // 3. Blockquotes (> Quote)
    const quoteMatch = line.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      if (inTaskList || inBulletList || inOrderedList) {
        closeOpenLists();
      }
      if (!inBlockquote) {
        html += "<blockquote>";
        inBlockquote = true;
      }
      const quoteContent = formatInlineMarkdown(quoteMatch[1].trim());
      html += `<p>${quoteContent}</p>`;
      continue;
    }

    // 4. Bullet lists (- Item or * Item)
    const bulletMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bulletMatch) {
      if (inTaskList || inOrderedList || inBlockquote) {
        closeOpenLists();
      }
      if (!inBulletList) {
        html += "<ul>";
        inBulletList = true;
      }
      const itemContent = formatInlineMarkdown(bulletMatch[1].trim());
      html += `<li><p>${itemContent}</p></li>`;
      continue;
    }

    // 5. Ordered lists (1. Item)
    const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (inTaskList || inBulletList || inBlockquote) {
        closeOpenLists();
      }
      if (!inOrderedList) {
        html += "<ol>";
        inOrderedList = true;
      }
      const itemContent = formatInlineMarkdown(orderedMatch[1].trim());
      html += `<li><p>${itemContent}</p></li>`;
      continue;
    }

    // 6. Horizontal Rule (---, ***, ___, - - -, * * *, _ _ _)
    if (/^(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(trimmed)) {
      closeOpenLists();
      html += "<hr>";
      continue;
    }

    // 7. Shortcodes: keep raw bracketed format inside <p>
    if (/^\[(?:video|logos):/i.test(trimmed)) {
      closeOpenLists();
      html += `<p>${escapeHtml(trimmed)}</p>`;
      continue;
    }

    // 8. Standard paragraph / Mixed prose line
    closeOpenLists();
    html += `<p>${formatInlineMarkdown(trimmed)}</p>`;
  }

  closeOpenLists();
  return html;
}

/**
 * Deterministic router to decide if clipboard paste should be handled by the markdown parser
 * or passed through to ProseMirror's default rich HTML parser.
 */
export function shouldRouteToMarkdownPipeline(html: string | undefined, plainText: string): boolean {
  if (!plainText || !plainText.trim()) return false;

  // 1. Check if plainText contains any markdown syntax heuristics
  const hasMarkdownSyntax =
    /^#{1,6}\s+\S/m.test(plainText) ||
    /^\s*(?:[-*+]\s+)?\[[ xX]\]\s+\S/m.test(plainText) ||
    /^\s*[-*+]\s+\S/m.test(plainText) ||
    /^\s*\d+\.\s+\S/m.test(plainText) ||
    /^>\s+\S/m.test(plainText) ||
    /\[(?:video|logos):\s*[^\]]+\]/i.test(plainText) ||
    /^(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/m.test(plainText) ||
    /^\s*\|.+?\|\s*$/m.test(plainText) ||
    /^\s*(?:```|~~~)/m.test(plainText) ||
    /!\[[^\]]*\]\([^)\s]+\)/.test(plainText) ||
    /\[[^\]]+\]\([^)\s]+\)/.test(plainText) ||
    /\*\*[^*\n]+\*\*/.test(plainText) ||
    /~~[^~\n]+~~/.test(plainText);

  if (!hasMarkdownSyntax) return false;

  // 2. If no HTML payload exists, this is pure plain-text paste -> route to markdown parser
  if (!html || !html.trim()) return true;

  // 3. Strip tags and decode entities from the HTML payload
  // Note: Collapsing whitespace is intentional to reliably compare wrapped source code from IDEs/browsers
  const strippedHtmlText = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  const normalizedPlainText = plainText.replace(/\s+/g, " ").trim();

  // 4. If stripped HTML text equals plain text (e.g. VS Code / GitHub copying code with syntax highlight <span> tags),
  // it is a pass-through wrapper around raw markdown source. Route to markdown parser!
  if (strippedHtmlText === normalizedPlainText) {
    return true;
  }

  // 5. In all other cases where rich HTML is present, default to false to protect and preserve genuine rich clipboard formatting
  return false;
}

/**
 * Unified Markdown & Shortcode TipTap Extension
 */
export const MarkdownRulesExtension = Extension.create({
  name: "markdownRulesExtension",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownRulesPasteHandler"),
        props: {
          handlePaste(view, event) {
            const plainText = event.clipboardData?.getData("text/plain") || "";
            const htmlText = event.clipboardData?.getData("text/html") || "";

            if (shouldRouteToMarkdownPipeline(htmlText, plainText)) {
              if (typeof document !== "undefined") {
                const parsedHtml = convertMarkdownToHtml(plainText);
                if (parsedHtml) {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = parsedHtml;
                  const parser = DOMParser.fromSchema(view.state.schema);
                  const slice = parser.parseSlice(tempDiv);
                  view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
                  event.preventDefault();
                  return true;
                }
              }
            }

            return false;
          },

          transformPastedText(text) {
            // Keep strictly minimal as a pass-through normalizer without generating HTML strings
            return normalizeShortcodesPaste(text);
          },

          transformPastedHTML(html) {
            // Normalize any shortcodes in rich HTML paste
            return normalizeShortcodesPaste(html);
          },
        },
      }),
    ];
  },
});
