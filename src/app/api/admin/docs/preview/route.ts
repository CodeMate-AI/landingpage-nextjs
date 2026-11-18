import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/authWrapper";
import { compileTiptapToHtml, extractSectionsFromTiptapJson } from "@/lib/blog-compiler";
import { buildPageTree, flattenNav, getDraftNav, getPublishedIndex } from "@/lib/docs-data";
import { highlightCodeBlocks } from "@/lib/docs-highlight";
import { addHeadingIds } from "@/lib/docs-toc";
import { DocPageSchema, type NavItem } from "@/lib/docs-validation";

const MAX_BODY = 2_000_000;

// Lenient on purpose: a half-written page (no title or slug yet) must still preview
const PreviewSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  slug: z.string().default(""),
  content: DocPageSchema.shape.content,
});

const hasSlug = (items: NavItem[], slug: string): boolean =>
  items.some((n) => (n.type === "page" ? n.slug === slug : hasSlug(n.children, slug)));

// Renders an unsaved page with the same pipeline as /docs/[slug] and returns what the preview shows:
// the article HTML, its TOC and the sidebar (draft nav, with this page in it)
async function preview(req: NextRequest) {
  // Each edit posts the whole page and compiles it: refuse bodies far past any real docs page
  const text = await req.text();
  if (text.length > MAX_BODY) return NextResponse.json({ error: "Page is too large to preview." }, { status: 413 });
  let body: unknown = null;
  try {
    body = JSON.parse(text);
  } catch {}
  const parsed = PreviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { description, content } = parsed.data;
  const slug = parsed.data.slug || "untitled";
  const title = parsed.data.title.trim() || "Untitled page";

  const sections = extractSectionsFromTiptapJson(content);
  const compiled = compileTiptapToHtml(content, sections, undefined, { skipFaq: true });
  const { html, toc } = addHeadingIds(await highlightCodeBlocks(compiled.html));

  const [draftNav, published] = await Promise.all([getDraftNav(), getPublishedIndex()]);
  // This page always shows, with its live title, at the end if the sidebar tree does not hold it yet
  const nav: NavItem[] = hasSlug(draftNav, slug) ? draftNav : [...draftNav, { type: "page", slug }];
  const pages = [...published.filter((p) => p.slug !== slug), { slug, title }];
  const order = flattenNav(nav, pages);
  const at = order.findIndex((p) => p.slug === slug);

  return NextResponse.json({
    slug,
    title,
    description,
    html,
    toc,
    tree: buildPageTree(nav, pages),
    label: order[at]?.group,
    prev: at > 0 ? order[at - 1] : null,
    next: at >= 0 ? order[at + 1] ?? null : null,
  });
}

export const POST = withAuth(preview);
