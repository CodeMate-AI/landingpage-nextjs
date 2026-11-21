"use client";

import "@/app/docs/docs.css";
import React, { Suspense, useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RootProvider } from "fumadocs-ui/provider/next";
import type * as PageTree from "fumadocs-core/page-tree";
import type { TableOfContents } from "fumadocs-core/toc";
import { DocsThemeSync } from "@/app/docs/DocsThemeSync";
import { DocArticle } from "@/app/docs/DocArticle";
import { DocsSidebar } from "@/app/docs/components/DocsSidebar";
// Same typefaces as the published docs
import { docsFontVars } from "@/lib/docs-fonts";
import { DOCS_PREVIEW_CHANNEL, DOCS_PREVIEW_LAST, type DocsPreviewData } from "../previewChannel";

type Rendered = DocsPreviewData & { tree: PageTree.Root; toc: TableOfContents };

const shell = "flex min-h-screen items-center justify-center bg-[#09090b] p-4 text-center text-neutral-400";

// Shows what the editor sends over the channel: the article, the left sidebar and the right TOC. It has no
// login and calls no API (the editor does that), so it works the same in the modal iframe and in a new tab.
function PreviewContent() {
  const params = useSearchParams();
  const isEmbed = params.get("embed") === "true";
  // The editor tab this preview belongs to; without it (a hand-typed URL) nobody answers
  const editor = params.get("editor");
  const [data, setData] = useState<Rendered | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if (!editor) {
      // nobody to ask: go straight to the "no data" message instead of loading forever
      const t = window.setTimeout(() => setWaited(true), 0);
      return () => window.clearTimeout(t);
    }
    // snapshot from the editor's last render, for when no editor tab answers (timer: localStorage is client only)
    const restore = window.setTimeout(() => {
      try {
        const last = JSON.parse(localStorage.getItem(DOCS_PREVIEW_LAST) || "null");
        if (last?.editor === editor) setData((d) => d ?? (last.data as Rendered));
      } catch {}
    }, 0);
    const channel = new BroadcastChannel(DOCS_PREVIEW_CHANNEL);
    channel.onmessage = (e) => {
      if (e.data?.editor !== editor) return;
      if (e.data.type === "render") {
        setData(e.data.data as Rendered);
        setError(null);
      } else if (e.data.type === "error") {
        setError(e.data.status === 401 ? "Your admin session expired. Sign in again in the editor tab." : `The preview could not be rendered (error ${e.data.status}). It updates again after your next edit.`);
      }
    };
    channel.postMessage({ type: "hello", editor });
    // tells the editor to stop rendering for this preview (once, whichever of unmount or page close comes first)
    let left = false;
    const bye = () => {
      if (left) return;
      left = true;
      channel.postMessage({ type: "bye", editor });
    };
    window.addEventListener("pagehide", bye);
    const t = window.setTimeout(() => setWaited(true), 6000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(restore);
      window.removeEventListener("pagehide", bye);
      bye();
      channel.close();
    };
  }, [editor]);

  // In the modal, keys pressed inside this frame never reach the modal's own Esc handler: pass Esc up
  useEffect(() => {
    if (!isEmbed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && window.parent.postMessage({ type: "docs-preview-close" }, window.location.origin);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isEmbed]);

  // Links stay inside the preview: the sidebar and "next page" would otherwise open the real page in this frame
  useEffect(() => {
    const guard = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank") return;
      if (a.getAttribute("href")?.startsWith("#")) return;
      e.preventDefault();
    };
    document.addEventListener("click", guard, true);
    return () => document.removeEventListener("click", guard, true);
  }, []);

  if (!data) {
    return (
      <div className={shell}>
        {error ? (
          <p className="max-w-md text-sm text-red-400">{error}</p>
        ) : waited ? (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold text-white">No Preview Data Found</h1>
            <p className="max-w-md text-sm">Open the docs editor in another tab, then click &ldquo;Preview&rdquo; there.</p>
            <Link href="/admin/docs" className="rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-[#27272a]">
              Back to Docs
            </Link>
          </div>
        ) : (
          <p className="text-sm">Loading preview...</p>
        )}
      </div>
    );
  }

  const barHeight = isEmbed ? "0px" : "48px";
  return (
    <>
      {!isEmbed && (
        <div className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-[#27272a] bg-[#09090b]/95 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Preview Mode</span>
            <span className="hidden text-xs text-neutral-500 sm:inline-block">(Updates as you edit)</span>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
          >
            Close Tab
          </button>
        </div>
      )}

      {error && <p className="border-b border-red-500/20 bg-red-500/5 px-4 py-2 text-center text-xs text-red-400">{error} Showing the last render.</p>}

      {/* The public layout has a 64px header above the sidebar; here there is none (or only the slim bar above) */}
      <div className={`docs-shell ${docsFontVars} relative min-h-screen w-full overflow-x-clip bg-fd-background text-fd-foreground`} style={{ "--docs-header-height": barHeight } as CSSProperties}>
        <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
            <DocsSidebar tree={data.tree} activeUrl={`/docs/${data.slug}`} />
            <main className="min-w-0">
              <DocArticle
                preview
                slug={data.slug}
                title={data.title}
                description={data.description}
                label={data.label}
                html={data.html}
                toc={data.toc}
                tree={data.tree}
                prev={data.prev ?? undefined}
                next={data.next ?? undefined}
              />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

const noSubscribe = () => () => {};

export default function AdminDocsPreviewPage() {
  // The theme provider renders an inline <script>; React warns about scripts rendered on the client unless
  // they are data blocks, so the type changes there (the same trick as DocsThemeInit). DocsThemeInit itself is left out.
  // useSyncExternalStore gives the server value while hydrating and the client value after, so hydration matches.
  const scriptType = useSyncExternalStore(noSubscribe, () => "application/json", () => "text/javascript");
  return (
    <RootProvider search={{ enabled: false }} theme={{ scriptProps: { type: scriptType } }}>
      <DocsThemeSync />
      <Suspense fallback={<div className={shell}><p className="text-sm">Loading preview...</p></div>}>
        <PreviewContent />
      </Suspense>
    </RootProvider>
  );
}
