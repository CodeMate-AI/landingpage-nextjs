import { getPublishedIndex, getPublishedNav } from "@/lib/docs-data";
import type { NavItem } from "@/lib/docs-validation";

export const revalidate = 60;
const SITE = "https://codemate.ai";

// Index of published docs pages for LLM tools: title and Markdown link per page, in sidebar order.
export async function GET() {
  const [pages, nav] = await Promise.all([getPublishedIndex(), getPublishedNav()]);
  const bySlug = new Map(pages.map((p) => [p.slug, p.title]));
  const ordered: string[] = [];
  const walk = (items: NavItem[]) => items.forEach((i) => (i.type === "page" ? ordered.push(i.slug) : walk(i.children)));
  walk(nav);
  const slugs = [...new Set([...ordered, ...bySlug.keys()])].filter((s) => bySlug.has(s));
  const lines = slugs.map((s) => `- [${bySlug.get(s)}](${SITE}/docs/${s}.md)`);
  return new Response(`# CodeMate Docs\n\n${lines.join("\n")}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
