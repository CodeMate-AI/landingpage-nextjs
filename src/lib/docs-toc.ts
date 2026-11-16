import { slugifyHeading } from "@/lib/blog-compiler";

const HEADING = /<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/g;
const ID_ATTR = /\sid="([^"]*)"/;

const decode = (s: string) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

// Docs show every h2 to h4 in the table of contents (the blog compiler only ids the top level).
// Keeps ids the compiler already set, adds missing ones, and returns the TOC with real depths.
export function addHeadingIds(html: string): { html: string; toc: { title: string; url: string; depth: number }[] } {
  const used = new Set<string>();
  for (const m of html.matchAll(new RegExp(HEADING))) {
    const id = ID_ATTR.exec(m[2])?.[1];
    if (id) used.add(id);
  }

  const toc: { title: string; url: string; depth: number }[] = [];
  const out = html.replace(HEADING, (_all, level: string, attrs: string, inner: string) => {
    const title = decode(inner.replace(/<[^>]*>/g, "")).trim();
    let id = ID_ATTR.exec(attrs)?.[1];
    if (!id) {
      const base = slugifyHeading(title);
      id = base;
      for (let i = 1; used.has(id); i++) id = `${base}-${i}`;
      used.add(id);
      attrs += ` id="${id}"`;
    }
    if (title) toc.push({ title, url: `#${id}`, depth: Number(level) });
    return `<h${level}${attrs}>${inner}</h${level}>`;
  });
  return { html: out, toc };
}
