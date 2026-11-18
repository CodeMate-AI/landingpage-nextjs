"use client";

import { createContext, Fragment, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookOpen, Bot, Loader2, Search } from "lucide-react";
import { useAsk } from "../ask-ai/context";

// Port of the Pangolin docs search dialog: one provider, one dialog, results grouped per page.
// Backend is the existing /api/search (Fumadocs "advanced" structured results).

export interface QuickLink {
  title: string;
  url: string;
}

interface SearchCtx {
  open: () => void;
}
const Ctx = createContext<SearchCtx | null>(null);

export function useSiteSearch() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSiteSearch must be used inside <SiteSearchProvider>");
  return c;
}

const isTyping = (el: EventTarget | null) => {
  const t = el as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
};

export function SiteSearchProvider({ children, quickLinks }: { children: ReactNode; quickLinks: QuickLink[] }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);

  // Cmd/Ctrl+K from anywhere, "/" when not typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isOpen) return;
      const mod = e.metaKey || e.ctrlKey;
      if ((e.key.toLowerCase() === "k" && mod) || (e.key === "/" && !mod && !e.altKey && !isTyping(e.target))) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const value = useMemo(() => ({ open }), [open]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {isOpen && <SearchDialog quickLinks={quickLinks} onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

/* ---------- results ---------- */

interface RawResult {
  id: string;
  type: "page" | "heading" | "text";
  content: string;
  url: string;
}

interface PageResult {
  id: string;
  title: string;
  url: string;
  context?: string;
  snippet?: string;
}

const MAX_RESULTS = 10;

// Search returns a flat list (page, then its headings and text). Fold it into one row per page.
function groupResults(raw: RawResult[]): PageResult[] {
  const pages = new Map<string, PageResult>();
  let current: PageResult | undefined;
  for (const r of raw) {
    if (r.type === "page") {
      current = { id: r.id, title: r.content, url: r.url };
      pages.set(r.id, current);
      continue;
    }
    // heading and text rows carry the page url plus an anchor; find their page by url
    const base = r.url.split("#")[0];
    const page = [...pages.values()].find((p) => p.url.split("#")[0] === base) ?? current;
    if (!page) continue;
    if (r.type === "heading" && !page.context) {
      page.context = r.content;
      page.url = r.url;
    } else if (r.type === "text" && !page.snippet) {
      page.snippet = r.content;
    }
  }
  return [...pages.values()].slice(0, MAX_RESULTS);
}

function useSearchResults(query: string) {
  const [state, setState] = useState<{ query: string; results: PageResult[]; error: boolean } | null>(null);
  const cache = useRef(new Map<string, PageResult[]>());

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const hit = cache.current.get(q);
    if (hit) {
      setState({ query: q, results: hit, error: false });
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        const results = groupResults((await res.json()) as RawResult[]);
        cache.current.set(q, results);
        setState({ query: q, results, error: false });
      } catch (e) {
        if ((e as Error).name !== "AbortError") setState({ query: q, results: [], error: true });
      }
    }, 120);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  const q = query.trim();
  const settled = !!q && state?.query === q;
  return { results: settled ? state!.results : [], error: settled && state!.error, loading: !!q && !settled };
}

/* ---------- dialog ---------- */

type Row = { kind: "ask"; query: string } | { kind: "page"; page: PageResult } | { kind: "quick"; link: QuickLink };

function SearchDialog({ quickLinks, onClose }: { quickLinks: QuickLink[]; onClose: () => void }) {
  const router = useRouter();
  const { setOpen: openAsk } = useAsk();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const { results, error, loading } = useSearchResults(query);

  const q = query.trim();
  const words = q.split(/\s+/).filter(Boolean).length;
  const canAsk = words >= 3;

  const rows: Row[] = useMemo(() => {
    if (!q) return quickLinks.map((link) => ({ kind: "quick" as const, link }));
    const list: Row[] = results.map((page) => ({ kind: "page" as const, page }));
    return canAsk ? [{ kind: "ask" as const, query: q }, ...list] : list;
  }, [q, results, quickLinks, canAsk]);

  // Keep the highlighted row valid and in view
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const select = (row: Row, newTab = false) => {
    if (row.kind === "ask") {
      onClose();
      openAsk(true); // opens the panel only; nothing is sent
      return;
    }
    const url = row.kind === "page" ? row.page.url : row.link.url;
    if (newTab) window.open(url, "_blank", "noopener,noreferrer");
    else {
      onClose();
      router.push(url);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!rows.length) return;
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + d + rows.length) % rows.length);
    } else if (e.key === "Enter" && rows[active]) {
      e.preventDefault();
      select(rows[active], e.metaKey || e.ctrlKey);
    }
  };

  const label = !q ? "Popular" : "Documentation";
  const showEmpty = !!q && !loading && !error && results.length === 0;

  return (
    <div className="fixed inset-0 z-[1020]" onKeyDown={onKeyDown}>
      <div className="docs-search-fade absolute inset-0 bg-black/25 backdrop-blur-[2px]" onMouseDown={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the docs"
        className="docs-search-pop absolute left-1/2 top-3 flex max-h-[calc(100dvh-1.5rem)] w-[min(640px,calc(100vw-1.5rem))] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-fd-border bg-fd-popover text-fd-popover-foreground shadow-2xl md:top-[12vh] md:max-h-[min(560px,76vh)]"
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-fd-border px-4">
          {loading ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-fd-muted-foreground" aria-hidden />
          ) : (
            <Search className="size-4 shrink-0 text-fd-muted-foreground" aria-hidden />
          )}
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search the docs…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={rows.length ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-fd-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-fd-border px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground transition hover:text-fd-foreground"
          >
            Esc
          </button>
        </div>

        <div ref={listRef} id={listId} role="listbox" aria-label="Search results" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {error && <p className="px-3 py-8 text-center text-sm text-fd-muted-foreground">Search is unavailable right now.</p>}
          {showEmpty && (
            <p className="px-3 py-6 text-center text-sm text-fd-muted-foreground">
              No pages match “{q}”{canAsk ? null : "."}
              {canAsk && (
                <>
                  . Try asking <span translate="no">CodeMate AI</span> instead.
                </>
              )}
            </p>
          )}
          {rows.length > 0 && !error && (
            <>
              {rows.map((row, i) => (
                <Fragment key={row.kind === "ask" ? "ask" : row.kind === "page" ? row.page.id : row.link.url}>
                  {i === rows.findIndex((r) => r.kind !== "ask") && (
                    <div className="px-2 pb-1.5 pt-3 text-xs font-medium text-fd-muted-foreground" role="presentation">
                      {label}
                    </div>
                  )}
                  <ResultRow id={`${listId}-${i}`} index={i} row={row} q={q} active={i === active} onHover={() => setActive(i)} onSelect={(nt) => select(row, nt)} />
                </Fragment>
              ))}
            </>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-4 border-t border-fd-border px-4 py-2 text-xs text-fd-muted-foreground md:flex">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to navigate
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> to open
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>Esc</Kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-fd-border bg-fd-background px-1.5 font-mono text-[11px]">{children}</kbd>;
}

function ResultRow({
  id,
  index,
  row,
  q,
  active,
  onHover,
  onSelect,
}: {
  id: string;
  index: number;
  row: Row;
  q: string;
  active: boolean;
  onHover: () => void;
  onSelect: (newTab: boolean) => void;
}) {
  const isAsk = row.kind === "ask";
  const title = row.kind === "ask" ? null : row.kind === "page" ? row.page.title : row.link.title;
  const detail = row.kind === "page" ? [row.page.context, row.page.snippet].filter(Boolean) : [];

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-index={index}
      onMouseMove={onHover}
      onClick={(e) => onSelect(e.metaKey || e.ctrlKey)}
      className={`flex cursor-pointer gap-3 rounded-md px-2 py-2 ${isAsk ? "items-center" : "items-start"} ${active ? "bg-fd-accent text-fd-accent-foreground" : ""}`}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-fd-border bg-fd-background text-fd-muted-foreground">
        {isAsk ? <Bot className="size-3.5" aria-hidden /> : <BookOpen className="size-3.5" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        {isAsk ? (
          <span className="block truncate text-sm font-medium">
            Ask <span translate="no">CodeMate AI</span>: <span className="text-fd-muted-foreground">“{row.query}”</span>
          </span>
        ) : (
          <>
            <span className="block truncate text-sm font-medium">
              <Highlight text={title!} q={q} />
            </span>
            {detail.length > 0 && (
              <span className="mt-0.5 line-clamp-2 block text-xs text-fd-muted-foreground">
                {detail.map((d, i) => (
                  <Fragment key={i}>
                    {i > 0 && " · "}
                    <Highlight text={d!} q={q} />
                  </Fragment>
                ))}
              </span>
            )}
          </>
        )}
      </span>
      {row.kind === "quick" && row.link.url.startsWith("http") && <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-fd-muted-foreground" aria-hidden />}
    </div>
  );
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Highlight({ text, q }: { text: string; q: string }) {
  const terms = q.split(/\s+/).filter((w) => w.length > 1);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(escapeRe).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-fd-primary/20 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
