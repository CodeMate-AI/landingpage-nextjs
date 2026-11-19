"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useSiteSearch } from "./SiteSearch";
import { ThemeToggle } from "./ThemeToggle";
import { useModKey } from "./useMac";

// Edit here to change the header links and the call to action
const LINKS = [
  { label: "Website", href: "https://codemate.ai" },
  { label: "Download", href: "https://codemate.ai/download" },
];
const GET_STARTED = "https://app.codemate.ai/download";

// Same container and columns as the page below, so the search lines up with the content column
export function DocsHeader() {
  const { open: openSearch } = useSiteSearch();
  const mod = useModKey();

  return (
    <header className="sticky top-0 z-40 border-b border-fd-border bg-fd-background">
      <div className="mx-auto flex h-[var(--docs-header-height)] w-full max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(max-content,1fr)_minmax(0,34rem)_minmax(max-content,1fr)] lg:gap-6">
        {/* Icon goes to the main site homepage; the title goes to the docs home */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <Link href="/" aria-label="CodeMate homepage" className="rounded-md transition-opacity hover:opacity-80">
            {/* White icon: darkened in light mode */}
            <img src="/logos/brand/codemate-icon.svg" alt="" className="h-7 w-auto brightness-0 dark:brightness-100" />
          </Link>
          <Link href="/docs" aria-label="CodeMate Docs home" className="whitespace-nowrap text-sm font-semibold sm:text-base" translate="no">
            CodeMate <span className="max-[339px]:hidden">Documentation</span>
          </Link>
        </div>

        {/* lg:contents puts the search and the right group straight into the 3-column grid: search sits in the middle of the screen */}
        <div className="flex min-w-0 flex-1 items-center gap-4 lg:contents">
          <div className="hidden min-w-0 flex-1 items-center md:flex">
            <button
              type="button"
              onClick={openSearch}
              className="mx-auto flex h-10 w-full max-w-xl cursor-pointer items-center gap-2 rounded-lg border border-fd-border bg-fd-secondary/50 px-3 text-sm text-fd-muted-foreground transition hover:bg-fd-accent"
            >
              <Search className="size-4 shrink-0" aria-hidden />
              <span className="flex-1 truncate text-start">Search docs</span>
              <kbd className="hidden rounded border border-fd-border bg-fd-background px-1.5 font-mono text-[11px] sm:block">{mod} K</kbd>
            </button>
          </div>

          <div className="ms-auto flex shrink-0 items-center gap-1 lg:justify-self-end">
            <nav aria-label="CodeMate" className="docs-header-links hidden items-center gap-1 xl:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md px-2.5 py-2 text-sm text-fd-muted-foreground transition hover:text-fd-foreground"
                >
                  {l.label}
                  <ArrowUpRight className="size-3" aria-hidden />
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              aria-label="Search"
              onClick={openSearch}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-fd-muted-foreground transition hover:text-fd-foreground md:hidden"
            >
              <Search className="size-5" aria-hidden />
            </button>
            <a
              href={GET_STARTED}
              target="_blank"
              rel="noopener noreferrer"
              className="ms-2 inline-flex h-9 items-center rounded-md bg-fd-primary px-4 text-sm font-semibold text-fd-primary-foreground transition hover:opacity-90 max-sm:hidden"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
