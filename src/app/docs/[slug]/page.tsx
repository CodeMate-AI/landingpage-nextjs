import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFeedback } from "../PageFeedback";
import { DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/layouts/notebook/page";
import { compileTiptapToHtml } from "@/lib/blog-compiler";
import { DocsEnhance } from "../DocsEnhance";
import { ViewOptions } from "../ViewOptions";
import { DocsMobileBar } from "../components/DocsMobileBar";
import { PageNav } from "../components/PageNav";
import { Toc } from "../components/Toc";
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
    <>
      <DocsMobileBar tree={buildPageTree(nav, pages)} toc={toc} />
      <div className="grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-12">
        <article className="min-w-0 pb-24 pt-8">
          {/* Group label left, Copy right on one row (a long title can then wrap freely under them) */}
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm text-fd-muted-foreground">{label}</p>
            <ViewOptions slug={slug} pageUrl={`https://codemate.ai/docs/${slug}`} />
          </div>
          <DocsTitle>{page.title}</DocsTitle>
          {page.description && <DocsDescription>{page.description}</DocsDescription>}
          <DocsBody>
            <div data-docs-content dangerouslySetInnerHTML={{ __html: html }} />
            <DocsEnhance />
            <PageFeedback slug={slug} />
          </DocsBody>
          <PageNav prev={at > 0 ? order[at - 1] : undefined} next={at >= 0 ? order[at + 1] : undefined} />
        </article>
        {/* pb-24 matches the article: a sticky child stops above the padding, so the TOC never touches the footer */}
        <div className="pb-24 pt-8">
          <Toc toc={toc} />
        </div>
      </div>
    </>
  );
}
