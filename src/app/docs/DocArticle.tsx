import type * as PageTree from "fumadocs-core/page-tree";
import type { TableOfContents } from "fumadocs-core/toc";
import { DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/layouts/notebook/page";
import { DocsEnhance } from "./DocsEnhance";
import { PageFeedback } from "./PageFeedback";
import { ViewOptions } from "./ViewOptions";
import { DocsMobileBar } from "./components/DocsMobileBar";
import { PageNav } from "./components/PageNav";
import { Toc } from "./components/Toc";

type Entry = { slug: string; title: string } | undefined;

interface Props {
  slug: string;
  title: string;
  description?: string;
  /** Title of the sidebar group the page sits in */
  label?: string;
  /** Compiled, highlighted HTML with heading ids */
  html: string;
  toc: TableOfContents;
  tree: PageTree.Root;
  prev?: Entry;
  next?: Entry;
  /** Admin preview: no feedback widget or copy/open menu (they post data), sidebar marks `/docs/<slug>` as active */
  preview?: boolean;
}

// One article layout for the public page (/docs/[slug]) and the admin preview, so they cannot drift apart
export function DocArticle({ slug, title, description, label, html, toc, tree, prev, next, preview }: Props) {
  return (
    <>
      <DocsMobileBar tree={tree} toc={toc} activeUrl={preview ? `/docs/${slug}` : undefined} />
      <div className="docs-page-grid grid xl:grid-cols-[minmax(0,1fr)_220px] xl:gap-12">
        <article className="min-w-0 pb-12 pt-8 xl:pb-24">
          {/* Group label left, Copy right on one row (a long title can then wrap freely under them) */}
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm text-fd-muted-foreground">{label}</p>
            {!preview && <ViewOptions slug={slug} pageUrl={`https://codemate.ai/docs/${slug}`} />}
          </div>
          <DocsTitle>{title}</DocsTitle>
          {description && <DocsDescription>{description}</DocsDescription>}
          <DocsBody>
            <div data-docs-content dangerouslySetInnerHTML={{ __html: html }} />
            {/* In the preview the HTML is replaced as you type, which wipes DocsEnhance's changes: remount it to redo them */}
            <DocsEnhance key={preview ? html : undefined} />
            {!preview && <PageFeedback slug={slug} />}
          </DocsBody>
          <PageNav prev={prev} next={next} />
        </article>
        {/* pb-24 matches the article: a sticky child stops above the padding, so the TOC never touches the footer */}
        <div className="docs-toc hidden pb-24 pt-8 xl:block">
          <Toc toc={toc} />
        </div>
      </div>
    </>
  );
}
