"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { BlogDetailPost } from "@/types/blog";
import BlogPostClient from "@/app/blog/[slug]/BlogPostClient";
import "@/app/blog/blog.css";

function PreviewContent() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get("embed") === "true";
  const [post, setPost] = useState<BlogDetailPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clean up any remaining Lenis classes, inline styles, or instances
    document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling");
    document.documentElement.style.removeProperty("scroll-behavior");
    document.body.style.removeProperty("overflow");

    const win = window as any;
    if (win.lenis) {
      try {
        win.lenis.destroy();
        win.lenis = null;
      } catch (e) {}
    }

    try {
      const stored = sessionStorage.getItem("admin_blog_preview") || localStorage.getItem("admin_blog_preview");
      if (stored) {
        const parsed: BlogDetailPost = JSON.parse(stored);
        setPost(parsed);
      }
    } catch (err) {
      console.error("Failed to load preview payload from storage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-neutral-400">
        <p className="text-sm">Loading preview...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#07111f] p-4 text-center">
        <h1 className="text-xl font-semibold text-white">No Preview Data Found</h1>
        <p className="max-w-md text-sm text-neutral-400">
          No active draft was found in your browser session. Please return to the editor and click &ldquo;Preview&rdquo; again.
        </p>
        <Link
          href="/admin/editor"
          className="rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-[#27272a]"
        >
          Return to Editor
        </Link>
      </div>
    );
  }

  return (
    <>
      {!isEmbed && (
        <div className="sticky top-0 z-50 flex items-center justify-between border-b border-[#27272a] bg-[#09090b]/95 px-4 py-2.5 backdrop-blur sm:px-6">
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

          <button
            type="button"
            onClick={() => window.close()}
            className="rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
          >
            Close Tab
          </button>
        </div>
      )}

      <div className="blog-body blog-preview-mode min-h-screen">
        <BlogPostClient post={post} posts={[post]} isPreview={true} />
      </div>
    </>
  );
}

export default function AdminStandalonePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-neutral-400">
          <p className="text-sm">Loading preview...</p>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
