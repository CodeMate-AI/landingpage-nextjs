"use client";

import React, { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  editorId: string;
}

// Same full-screen preview as the blog editor's modal. The page inside is /admin/docs/preview, which gets
// its content from the editor over a BroadcastChannel. The modal covers the editor, so it shows a snapshot;
// "Open in new tab" gives a preview that keeps updating while you edit.
export default function DocsPreviewModal({ isOpen, onClose, slug, editorId }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    // Esc pressed while focus is inside the preview frame arrives as a message from it
    const onMessage = (e: MessageEvent) => e.origin === window.location.origin && e.data?.type === "docs-preview-close" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#09090b]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] bg-[#09090b] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Preview Mode</span>
          <span className="hidden text-xs text-neutral-500 sm:inline-block">(Draft not published)</span>
          {slug && (
            <span className="hidden items-center gap-1.5 rounded border border-neutral-700/50 bg-neutral-800/80 px-2.5 py-1 font-mono text-xs text-neutral-300 md:inline-flex">
              <span className="text-neutral-500">Preview Live URL:</span> https://codemate.ai/docs/{slug}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open(`/admin/docs/preview?editor=${editorId}`, "_blank")}
            title="Keeps updating while you edit"
            className="cursor-pointer rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
          >
            Open in new tab
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
          >
            Close Preview
          </button>
        </div>
      </div>

      <div className="h-full w-full flex-1">
        <iframe src={`/admin/docs/preview?embed=true&editor=${editorId}`} title="Docs Page Live Preview" className="h-full w-full border-0" />
      </div>
    </div>
  );
}
