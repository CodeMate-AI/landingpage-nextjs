"use client";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [bgColor, setBgColor] = useState("#07111f");
  const [published, setPublished] = useState(false);
  const [contentJson, setContentJson] = useState<any>({ type: "doc", content: [] });
  const [author, setAuthor] = useState("Ayush Singhal");
  const [authorRole, setAuthorRole] = useState("Founder & CEO");
  const [readTime, setReadTime] = useState("");
  const [publishedAtCustom, setPublishedAtCustom] = useState("");
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        setBgColor(post.bgColor || "#07111f");
        setPublished(post.published);
        setContentJson(post.content);
        setTagsInput(post.tags.map((t: any) => t.label).join(", "));
        setAuthor(post.author || "Ayush Singhal");
        setAuthorRole(post.authorRole || "Founder & CEO");
        setReadTime(post.readTime || "");
        setPublishedAtCustom(post.publishedAtCustom || "");
        setSections(post.sections || []);
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
      bgColor,
      published,
      tags,
      content: contentJson,
      author,
      authorRole,
      readTime: readTime || undefined,
      publishedAtCustom: publishedAtCustom || undefined,
      sections: sections.length > 0 ? sections : undefined,
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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url || "");
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Image upload failed.");
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] p-4 sm:p-6 lg:p-8 font-sans text-neutral-100">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between border-b border-[#27272a] pb-6">
          <h1 className="text-3xl font-bold text-white">{postId ? "Modify Article" : "Compose Article"}</h1>
          <button type="button" onClick={() => router.push("/admin/dashboard")} className="text-neutral-400 hover:text-neutral-200" suppressHydrationWarning>
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
                suppressHydrationWarning
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
                suppressHydrationWarning
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  suppressHydrationWarning
                  className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  suppressHydrationWarning
                  className="rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#232329] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">
                Card Background Color
                <span className="ml-2 text-xs text-neutral-500">(shown on listing card)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#07111f"
                  className="flex-1 rounded-lg border border-[#27272a] bg-[#18181b] p-3 font-mono text-sm text-white focus:outline-none"
                />
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-12 w-12 cursor-pointer rounded-lg border border-[#27272a] bg-[#18181b] p-1"
                  title="Pick a background color"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Security, Comparison, CORA"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Metadata overrides grid */}
          <div className="grid grid-cols-1 gap-6 border-t border-[#27272a] pt-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ayush Singhal"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Author Role / Title</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Founder & CEO"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Custom Date Override</label>
              <input
                type="text"
                value={publishedAtCustom}
                onChange={(e) => setPublishedAtCustom(e.target.value)}
                placeholder="e.g. July 22, 2026 (optional)"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Custom Read Time Override</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 7 min read (optional)"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Content Editor</label>
            {(!postId || contentJson.content.length > 0) && <SimpleEditor content={contentJson} onChange={setContentJson} />}
          </div>

          {/* Table of Contents / Outline custom editor */}
          <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 sm:p-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#27272a] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Table of Contents Outline</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Define manual scroll anchors. IDs must contain only lowercase letters, numbers, and hyphens.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (!contentJson || !contentJson.content) return;
                    const generated: { id: string; title: string }[] = [];
                    const idCounts: Record<string, number> = {};
                    for (const node of contentJson.content) {
                      if (node.type === "heading" && node.attrs?.level === 2) {
                        let titleText = "";
                        if (node.content) {
                          titleText = node.content.map((c: any) => c.text || "").join("");
                        }
                        if (titleText) {
                          const baseId = titleText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          let id = baseId;
                          if (idCounts[baseId] !== undefined) {
                            idCounts[baseId]++;
                            id = `${baseId}-${idCounts[baseId]}`;
                          } else {
                            idCounts[baseId] = 0;
                          }
                          generated.push({ id, title: titleText });
                        }
                      }
                    }
                    setSections(generated);
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition"
                >
                  Auto-Generate from Headings
                </button>
                <button
                  type="button"
                  onClick={() => setSections([...sections, { id: "", title: "" }])}
                  className="inline-flex items-center justify-center rounded-lg border border-[#27272a] bg-[#1d1d22] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#27272a] transition"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {sections.length === 0 ? (
              <p className="text-sm text-neutral-500 py-2">
                No custom outline sections. Click Auto-Generate or Add Item to begin.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {sections.map((section, idx) => (
                  <div key={idx} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Section Title (e.g. Pricing Model)"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].title = e.target.value;
                          if (!updated[idx].id) {
                            updated[idx].id = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          }
                          setSections(updated);
                        }}
                        className="w-full rounded-lg border border-[#27272a] bg-[#1d1d22] p-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Anchor ID (e.g. pricing-model)"
                        value={section.id}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[idx].id = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "");
                          setSections(updated);
                        }}
                        className="w-full rounded-lg border border-[#27272a] bg-[#1d1d22] p-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSections(sections.filter((_, sIdx) => sIdx !== idx));
                      }}
                      className="inline-flex items-center justify-center p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            suppressHydrationWarning
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
