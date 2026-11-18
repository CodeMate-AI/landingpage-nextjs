import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocArticle } from "../DocArticle";
import { compileTiptapToHtml } from "@/lib/blog-compiler";
import { buildPageTree, flattenNav, getPublishedIndex, getPublishedNav, getPublishedPage } from "@/lib/docs-data";
import { highlightCodeBlocks } from "@/lib/docs-highlight";
import { addHeadingIds } from "@/lib/docs-toc";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description || undefined,
    alternates: { canonical: `https://codemate.ai/docs/${slug}` },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  const compiled = compileTiptapToHtml(page.content, page.sections, undefined, { skipFaq: true });
  const { html, toc } = addHeadingIds(await highlightCodeBlocks(compiled.html));

  // Cached per request, so these are free after the layout has asked for them
  const [nav, pages] = await Promise.all([getPublishedNav(), getPublishedIndex()]);
  const order = flattenNav(nav, pages);
  const at = order.findIndex((p) => p.slug === slug);
  const label = order[at]?.group;

  return (
    <DocArticle
      slug={slug}
      title={page.title}
      description={page.description}
      label={label}
      html={html}
      toc={toc}
      tree={buildPageTree(nav, pages)}
      prev={at > 0 ? order[at - 1] : undefined}
      next={at >= 0 ? order[at + 1] : undefined}
    />
  );
}
