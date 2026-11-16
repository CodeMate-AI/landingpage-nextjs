import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { compileTiptapToHtml } from "@/lib/blog-compiler";
import { DocsEnhance } from "../DocsEnhance";
import { ViewOptions } from "../ViewOptions";
import { getPublishedPage } from "@/lib/docs-data";
import { highlightCodeBlocks } from "@/lib/docs-highlight";

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
  const html = await highlightCodeBlocks(compiled.html);
  const toc = page.sections.map((s) => ({ title: s.title, url: `#${s.id}`, depth: 2 }));

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      {page.description && <DocsDescription>{page.description}</DocsDescription>}
      <ViewOptions slug={slug} pageUrl={`https://codemate.ai/docs/${slug}`} />
      <DocsBody>
        <div data-docs-content dangerouslySetInnerHTML={{ __html: html }} />
        <DocsEnhance />
      </DocsBody>
    </DocsPage>
  );
}
