"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TiptapEditor from "@/components/admin/TiptapEditor";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [published, setPublished] = useState(false);
  const [contentJson, setContentJson] = useState<any>({ type: "doc", content: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        const post = data.post;
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setCategory(post.category);
        setCoverImage(post.coverImage || "");
        setPublished(post.published);
        setContentJson(post.content);
        setTagsInput(post.tags.map((t: any) => t.label).join(", "));
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        alert("Failed to load post for editing.");
      }
    } catch {
      alert("Failed to load post for editing.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => ({ label: t, tone: "slate" }));

    const payload = {
      title,
      excerpt,
      category,
      coverImage,
      published,
      tags,
      content: contentJson,
    };

    try {
      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = postId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json();
        alert(data.error || "Save error occurred.");
      }
    } catch {
      alert("Save execution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] p-8 font-sans text-neutral-100">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between border-b border-[#27272a] pb-6">
          <h1 className="text-3xl font-bold text-white">{postId ? "Modify Article" : "Compose Article"}</h1>
          <button onClick={() => router.push("/admin/dashboard")} className="text-neutral-400 hover:text-neutral-200">
            Cancel
          </button>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Excerpt / Subheading</label>
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Cover Image URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Security, Comparison, CORA"
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Content Editor</label>
            {(!postId || contentJson.content.length > 0) && <TiptapEditor content={contentJson} onChange={setContentJson} />}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-blue-600 focus:ring-0"
            />
            <label htmlFor="published" className="text-sm font-medium text-neutral-300">
              Publish directly to feed (makes this post public)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Saving Article..." : "Save Post"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminEditor() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-100">Loading editor workspace...</div>}>
      <EditorContent />
    </Suspense>
  );
}
