"use client";

import type { TableOfContents } from "fumadocs-core/toc";
import { TOCProvider } from "fumadocs-ui/components/toc";
import { TOCItem, TOCItems } from "fumadocs-ui/components/toc/default";

// "On this page" column (xl and up). Fumadocs' default TOC: a rail that bends between indent levels (slanted
// connectors) with a highlighted stretch for the current heading.
export function Toc({ toc }: { toc: TableOfContents }) {
  if (!toc.length) return null;
  // Its indents are keyed to the heading level (h2 = first level); shift so the shallowest heading on the page is the first level
  const top = Math.min(...toc.map((t) => t.depth));
  const items = toc.map((t) => ({ ...t, depth: t.depth - top + 2 }));
  return (
    // The list scrolls without a visible scrollbar; max-h leaves room above the floating Ask bar. single: only the current heading is highlighted (by default every heading in view is)
    <TOCProvider toc={items} single>
      <nav aria-label="On this page" className="sticky top-[calc(var(--docs-header-height)+1.5rem)] hidden max-h-[calc(100dvh-var(--docs-header-height)-8rem)] overflow-y-auto [scrollbar-width:none] xl:block [&::-webkit-scrollbar]:hidden">
        {/* ps-5 = the item text offset (20px), so the heading lines up with the first-level items */}
        <p className="mb-3 ps-5 text-sm font-semibold">On this page</p>
        <TOCItems>
          {items.map((item) => (
            <TOCItem key={item.url} item={item} />
          ))}
        </TOCItems>
      </nav>
    </TOCProvider>
  );
}
