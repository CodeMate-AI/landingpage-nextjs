"use client";

import React, { useEffect } from "react";
import type { BlogDetailPost } from "@/types/blog";

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogDetailPost;
  onOpenInNewTab: () => void;
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  post,
  onOpenInNewTab,
}: BlogPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07111f] overflow-hidden">
      {/* Top Preview Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272a] bg-[#09090b] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Preview Mode
          </span>
          <span className="hidden sm:inline-block text-xs text-neutral-500">
            (Draft not published)
          </span>
          {post.slug && (
            <span className="hidden md:inline-flex items-center gap-1.5 rounded bg-neutral-800/80 px-2.5 py-1 text-xs text-neutral-300 font-mono border border-neutral-700/50">
              <span className="text-neutral-500">Preview Live URL:</span> https://codemate.ai/blog/{post.slug}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenInNewTab}
            className="rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
          >
            Open in New Tab
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
          >
            Close Preview
          </button>
        </div>
      </div>

      {/* Main Preview Reader Content loaded via isolated iframe */}
      <div className="flex-1 w-full h-full bg-[#07111f]">
        <iframe
          src="/admin/preview?embed=true"
          title="Blog Article Live Preview"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
