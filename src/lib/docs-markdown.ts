// Converts a docs page (Tiptap JSON) to Markdown for "Copy Markdown", /docs/<slug>.md and llms.txt.
// Unknown nodes fall back to their children's text so new blocks never break the export.

type N = { type?: string; text?: string; attrs?: Record<string, any>; marks?: { type: string; attrs?: Record<string, any> }[]; content?: N[] };

const ALERT: Record<string, string> = { note: "NOTE", info: "NOTE", tip: "TIP", check: "TIP", warning: "WARNING", danger: "CAUTION" };

const SITE = "https://codemate.ai";
// Site-relative links break once the Markdown is pasted elsewhere
const abs = (u: unknown) => (typeof u === "string" && u.startsWith("/") && !u.startsWith("//") ? SITE + u : String(u ?? ""));
const indent = (s: string, pad: string) => s.split("\n").map((l) => (l ? pad + l : l)).join("\n");
const quote = (s: string) => s.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n");

function inline(nodes: N[] = []): string {
  return nodes
    .map((n) => {
      if (n.type === "hardBreak") return "  \n";
      if (n.type === "image") return `![${n.attrs?.alt ?? ""}](${abs(n.attrs?.src)})`;
      let t = n.text ?? inline(n.content);
      for (const m of n.marks ?? []) {
        if (!t.trim()) continue;
        if (m.type === "bold") t = `**${t}**`;
        else if (m.type === "italic") t = `*${t}*`;
        else if (m.type === "strike") t = `~~${t}~~`;
        else if (m.type === "code") t = `\`${t}\``;
        else if (m.type === "link") t = `[${t}](${abs(m.attrs?.href)})`;
      }
      return t;
    })
    .join("");
}

const blocks = (nodes: N[] = []): string => nodes.map(block).filter(Boolean).join("\n\n");

function list(n: N, ordered: boolean): string {
  const start = ordered ? Number(n.attrs?.start ?? 1) : 0;
  return (n.content ?? [])
    .map((li, i) => {
      const box = li.type === "taskItem" ? (li.attrs?.checked ? "[x] " : "[ ] ") : "";
      const mark = ordered ? `${start + i}. ` : "- ";
      return mark + indent(box + blocks(li.content), " ".repeat(mark.length)).trimStart();
    })
    .join("\n");
}

function table(n: N): string {
  const rows = (n.content ?? []).map((r) => (r.content ?? []).map((c) => blocks(c.content).replace(/\n+/g, " ").replace(/\|/g, "\\|")));
  if (!rows.length) return "";
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) => `| ${Array.from({ length: width }, (_, i) => r[i] ?? "").join(" | ")} |`;
  return [pad(rows[0]), `| ${Array(width).fill("---").join(" | ")} |`, ...rows.slice(1).map(pad)].join("\n");
}

function block(n: N): string {
  const a = n.attrs ?? {};
  switch (n.type) {
    case "paragraph":
      return inline(n.content);
    case "heading":
      return `${"#".repeat(Math.min(Math.max(Number(a.level) || 2, 1), 6))} ${inline(n.content)}`;
    case "bulletList":
    case "taskList":
      return list(n, false);
    case "orderedList":
      return list(n, true);
    case "blockquote":
      return quote(blocks(n.content));
    case "horizontalRule":
      return "---";
    case "codeBlock": {
      const code = (n.content ?? []).map((c) => c.text ?? "").join("");
      const fence = code.includes("```") ? "````" : "```";
      return `${fence}${a.language ?? ""}${a.title ? ` title="${a.title}"` : ""}\n${code}\n${fence}`;
    }
    case "image":
      return `![${a.alt ?? ""}](${abs(a.src)})`;
    case "table":
      return table(n);
    case "callout": {
      const head = a.title ? `**${a.title}**\n\n` : "";
      return quote(`[!${ALERT[a.kind] ?? "NOTE"}]\n${head}${blocks(n.content)}`);
    }
    case "tabs":
      return (n.content ?? []).map((t) => `**${t.attrs?.title ?? "Tab"}**\n\n${blocks(t.content)}`).join("\n\n");
    case "steps":
      return (n.content ?? []).map((s, i) => `### ${i + 1}. ${s.attrs?.title ?? "Step"}\n\n${blocks(s.content)}`).join("\n\n");
    case "cards":
      return (n.content ?? [])
        .map((c) => {
          const title = c.attrs?.href ? `[${c.attrs.title ?? "Card"}](${abs(c.attrs.href)})` : `**${c.attrs?.title ?? "Card"}**`;
          const body = blocks(c.content).replace(/\n+/g, " ");
          return `- ${title}${body ? `: ${body}` : ""}`;
        })
        .join("\n");
    case "accordion":
      return `<details>\n<summary>${a.title ?? "Details"}</summary>\n\n${blocks(n.content)}\n\n</details>`;
    case "frame": {
      if (!a.src) return "";
      const media = a.kind === "video" ? `[Video](${abs(a.src)})` : `![${a.alt ?? ""}](${abs(a.src)})`;
      return a.hint ? `${media}\n\n*${a.hint}*` : media;
    }
    default:
      return n.content ? (n.content.some((c) => c.type && c.type !== "text") ? blocks(n.content) : inline(n.content)) : (n.text ?? "");
  }
}

export function tiptapToMarkdown(doc: unknown, title?: string, description?: string): string {
  const head = [title ? `# ${title}` : "", description ?? ""].filter(Boolean).join("\n\n");
  const body = blocks((doc as N)?.content);
  return `${[head, body].filter(Boolean).join("\n\n")}\n`;
}
