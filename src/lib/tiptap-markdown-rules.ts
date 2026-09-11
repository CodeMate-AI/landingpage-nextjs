import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

/**
 * Escapes HTML characters in text.
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
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) || /^\//.test(trimmed) || /^\.\//.test(trimmed);
}

/**
 * Transforms plain-text and HTML checklist syntax into TipTap taskList/taskItem HTML on paste.
 */
function transformChecklistPaste(text: string): string | null {
  const lines = text.split(/\r?\n/);
  const checklistLineRegex = /^\s*(?:[-*+]\s+)?\[([ xX])\]\s*(.*)$/;

  // Check if at least one line matches the checklist pattern
  const hasChecklist = lines.some((line) => checklistLineRegex.test(line));
  if (!hasChecklist) {
    return null;
  }

  let htmlResult = "";
  let inTaskList = false;

  for (const line of lines) {
    const match = line.match(checklistLineRegex);
    if (match) {
      if (!inTaskList) {
        htmlResult += '<ul data-type="taskList">';
        inTaskList = true;
      }
      const isChecked = match[1].toLowerCase() === "x";
      const itemContent = match[2] || "";
      htmlResult += `<li data-type="taskItem" data-checked="${isChecked}"><p>${itemContent ? escapeHtml(itemContent) : ""}</p></li>`;
    } else {
      if (inTaskList) {
        htmlResult += "</ul>";
        inTaskList = false;
      }
      if (line.trim()) {
        htmlResult += `<p>${escapeHtml(line)}</p>`;
      }
    }
  }

  if (inTaskList) {
    htmlResult += "</ul>";
  }

  return htmlResult;
}

/**
 * Normalizes shortcodes ([video: ...], [logos: ...]) in pasted text or HTML to strip any nested anchor tags.
 */
function normalizeShortcodesPaste(content: string): string {
  return content
    // Normalize [video: ...]
    .replace(/\[video:\s*(?:<a\s+[^>]*href=["']([^"']*)["'][^>]*>[\s\S]*?<\/a>|([^\]\s]+))\s*\]/gi, (match, href, raw) => {
      const url = href || raw || "";
      return `[video: ${url.trim()}]`;
    })
    // Normalize [logos: ...]
    .replace(/\[logos:\s*([\s\S]*?)\]/gi, (match, inner) => {
      // Strip any nested HTML anchor tags from inside the logos shortcode
      const stripped = inner.replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (aMatch: string, href: string, text: string) => {
        return href || text;
      });
      return `[logos: ${stripped.trim()}]`;
    });
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
          transformPastedText(text) {
            // First normalize any shortcodes in plain text
            let normalized = normalizeShortcodesPaste(text);

            // Then check for checklist patterns
            const checklistHtml = transformChecklistPaste(normalized);
            if (checklistHtml) {
              return checklistHtml;
            }

            return normalized;
          },

          transformPastedHTML(html) {
            // Normalize any shortcodes in HTML paste (e.g. from rich text / Word / Google Docs)
            const normalized = normalizeShortcodesPaste(html);

            // Also check if HTML contains unparsed markdown checklist syntax inside <p> tags
            const tempDiv = typeof document !== "undefined" ? document.createElement("div") : null;
            if (tempDiv) {
              tempDiv.innerHTML = normalized;
              const paragraphs = Array.from(tempDiv.querySelectorAll("p"));
              let modified = false;

              for (const p of paragraphs) {
                const textContent = p.textContent || "";
                const match = textContent.match(/^\s*(?:[-*+]\s+)?\[([ xX])\]\s*(.*)$/);
                if (match) {
                  const isChecked = match[1].toLowerCase() === "x";
                  const inner = match[2];
                  const taskList = document.createElement("ul");
                  taskList.setAttribute("data-type", "taskList");
                  const taskItem = document.createElement("li");
                  taskItem.setAttribute("data-type", "taskItem");
                  taskItem.setAttribute("data-checked", String(isChecked));
                  const para = document.createElement("p");
                  para.textContent = inner;
                  taskItem.appendChild(para);
                  taskList.appendChild(taskItem);
                  p.replaceWith(taskList);
                  modified = true;
                }
              }

              if (modified) {
                return tempDiv.innerHTML;
              }
            }

            return normalized;
          },
        },
      }),
    ];
  },
});
