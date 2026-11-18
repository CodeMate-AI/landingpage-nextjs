"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ListTree, Menu, X } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";
import { ScrollProvider, useActiveAnchor, type TableOfContents } from "fumadocs-core/toc";
import { TOCProvider } from "fumadocs-ui/components/toc";
import { TOCItem, TOCItems } from "fumadocs-ui/components/toc/default";
import { SidebarTree } from "./DocsSidebar";

const bar = "inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-medium text-fd-muted-foreground transition hover:text-fd-foreground";

// Below lg: a "Menu" drawer and an "On this page" list under the header
export function DocsMobileBar({ tree, toc }: { tree: PageTree.Root; toc: TableOfContents }) {
  const pathname = usePathname();
  // Open state is tied to the route it was opened on, so navigating closes both without an effect
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const [tocAt, setTocAt] = useState<string | null>(null);
  const menuOpen = menuAt === pathname;
  const tocOpen = tocAt === pathname;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuAt(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // The rail's indents are keyed to the heading level (h2 = first level); shift so the shallowest heading is the first level
  const top = Math.min(...toc.map((x) => x.depth));
  const items = toc.map((t) => ({ ...t, depth: t.depth - top + 2 }));

  return (
    <TOCProvider toc={items} single>
    <div className="sticky top-[var(--docs-header-height)] z-30 -mx-5 border-b border-fd-border bg-fd-background px-5 sm:-mx-8 sm:px-8 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <button type="button" className={`${bar} shrink-0`} onClick={() => setMenuAt(pathname)} aria-haspopup="dialog">
          <Menu className="size-4" aria-hidden /> Menu
        </button>
        {toc.length > 0 && (
          <button type="button" className={`${bar} min-w-0`} aria-expanded={tocOpen} onClick={() => setTocAt(tocOpen ? null : pathname)}>
            <ListTree className="size-4 shrink-0" aria-hidden />
            {/* The section being read, so the closed bar already shows where you are */}
            <span className="truncate"><ActiveTitle toc={toc} /></span>
            <ChevronDown className={`size-4 shrink-0 transition-transform ${tocOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>
        )}
      </div>

      {tocOpen && (
        <ScrollProvider containerRef={listRef}>
          {/* Same rail as the desktop list: it bends between indent levels, with a bright stretch on the current heading. py-3 keeps each row 44px. */}
          <div ref={listRef} className="max-h-[50dvh] overflow-y-auto border-t border-fd-border py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TOCItems>
              {items.map((item) => (
                <TOCItem key={item.url} item={item} onClick={() => setTocAt(null)} className="flex min-h-11 items-center py-3 text-sm leading-snug" />
              ))}
            </TOCItems>
          </div>
        </ScrollProvider>
      )}

      <ReadProgress />

      {/* Portal: the bar is sticky (its own stacking level), the drawer must cover the header too */}
      {menuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Docs navigation">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setMenuAt(null)} />
            <div className="docs-scroll absolute inset-y-0 start-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto border-e border-fd-border bg-fd-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-fd-foreground">
              <div className="mb-3 flex items-center justify-between border-b border-fd-border pb-3">
                <Link href="/docs" className="flex items-center gap-2.5" onClick={() => setMenuAt(null)}>
                  <img src="/logos/brand/codemate-icon.svg" alt="" className="h-6 w-auto brightness-0 dark:brightness-100" />
                  <span className="text-sm font-semibold" translate="no">
                    CodeMate Documentation
                  </span>
                </Link>
                <button type="button" aria-label="Close menu" onClick={() => setMenuAt(null)} className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-fd-muted-foreground hover:text-fd-foreground">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <SidebarTree tree={tree} />
            </div>
          </div>,
          document.body,
        )}
    </div>
    </TOCProvider>
  );
}

function ActiveTitle({ toc }: { toc: TableOfContents }) {
  const id = useActiveAnchor();
  return <>{toc.find((t) => t.url === `#${id}`)?.title ?? "On this page"}</>;
}

// Reading progress: a 2px line on the bar's bottom edge, 0 when the article starts at the bar, 1 when its end reaches the screen bottom
function ReadProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const el = ref.current;
    const article = document.querySelector("article");
    if (!el || !article) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const barBottom = el.parentElement!.getBoundingClientRect().bottom;
      const r = article.getBoundingClientRect();
      const total = r.height - (window.innerHeight - barBottom);
      const p = total > 0 ? (barBottom - r.top) / total : 1;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);
  // Initial scaleX(0) is inline: Tailwind 4's scale-x-0 sets the separate `scale` property, which would multiply with the transform below
  return <div ref={ref} aria-hidden style={{ transform: "scaleX(0)" }} className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-fd-primary" />;
}
