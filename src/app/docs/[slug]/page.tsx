import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import { compileTiptapToHtml } from "@/lib/blog-compiler";
import { getPublishedPage } from "@/lib/docs-data";

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

  const { html } = compileTiptapToHtml(page.content, page.sections);
  const toc = page.sections.map((s) => ({ title: s.title, url: `#${s.id}`, depth: 2 }));

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      {page.description && <DocsDescription>{page.description}</DocsDescription>}
      <DocsBody>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </DocsBody>
    </DocsPage>
  );
}
