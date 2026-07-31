"use client";
import React, { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  // bgColor is set only on loadPost (preserves DB value). No UI picker — always defaults to #07111f for new posts.
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [bgColor, setBgColor] = useState("#07111f");
  
  // published is set only on loadPost to initialise the current live state.
  // It is read in resolvedPublished logic in handleSave to preserve existing publish state on draft saves.
  const [published, setPublished] = useState(false);
  const [contentJson, setContentJson] = useState<any>({ type: "doc", content: [] });
  const [author, setAuthor] = useState("Ayush Singhal");
  const [authorRole, setAuthorRole] = useState("Founder & CEO");
  const [readTime, setReadTime] = useState("");
  const [publishedAtCustom, setPublishedAtCustom] = useState("");
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingMode, setSavingMode] = useState<"draft" | "publish" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const saveModeRef = useRef<"draft" | "publish">("draft");

  const loadPost = useCallback(async () => {
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
        setLoadError(false);
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
        setLoadError(true);
      }
    } catch {
      alert("Failed to load post for editing.");
      setLoadError(true);
    }
  }, [postId, router]);

  useEffect(() => {
    if (postId) {
      void loadPost();
    }
  }, [postId, loadPost]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavingMode(saveModeRef.current);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => ({ label: t, tone: "slate" }));

    const resolvedPublished =
      saveModeRef.current === "publish"
        ? true
        : postId
        ? published
        : false;

    const payload = {
      title,
      excerpt,
      category,
      coverImage,
      bgColor,
      published: resolvedPublished,
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
      setSavingMode(null);
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
                  className="rounded-lg border border-blue-500/20 bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
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
            {loadError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                Failed to load post content. Please refresh the page or go back to the dashboard.
              </div>
            ) : !postId || contentJson.content.length > 0 ? (
              <SimpleEditor content={contentJson} onChange={setContentJson} />
            ) : (
              <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-4 text-sm text-neutral-500">
                Loading content...
              </div>
            )}
          </div>

          {/* Table of Contents / Outline custom editor */}
          <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 sm:p-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#27272a] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Table of Contents Outline</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Define manual scroll sections to show on the left-side tracker.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (!contentJson || !contentJson.content) return;
                    
                    // Determine highest heading level.
                    // We start tracking from level 2 (h2) because level 2 (h2) is mapped
                    // visually to "Heading 1" in the CMS editor toolbar dropdown UI.
                    let minLevel = 99;
                    for (const node of contentJson.content) {
                      if (node.type === "heading" && node.attrs?.level) {
                        const lvl = node.attrs.level;
                        if (lvl >= 2 && lvl <= 4 && lvl < minLevel) {
                          minLevel = lvl;
                        }
                      }
                    }
                    const targetLevel = minLevel === 99 ? 2 : minLevel;

                    const generated: { id: string; title: string }[] = [];
                    const idCounts: Record<string, number> = {};
                    for (const node of contentJson.content) {
                      if (node.type === "heading" && node.attrs?.level === targetLevel) {
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
                  Generate from Headings
                </button>
              </div>
            </div>

            {sections.length === 0 ? (
              <p className="text-sm text-neutral-500 py-2">
                No custom outline sections. Click Generate from Headings to begin.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-[#27272a]/80 bg-[#1d1d22]/40 px-4 py-3 text-neutral-300 transition duration-150 hover:bg-[#1d1d22]/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/10 text-xs font-semibold text-blue-400">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              onClick={() => {
                saveModeRef.current = "draft";
              }}
              suppressHydrationWarning
              className="w-full sm:w-auto rounded-lg border border-[#27272a] bg-[#18181b] px-6 py-3 font-semibold text-neutral-300 transition hover:bg-[#232329] disabled:opacity-50 text-center"
            >
              {loading && savingMode === "draft" ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={() => {
                saveModeRef.current = "publish";
              }}
              suppressHydrationWarning
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 text-center"
            >
              {loading && savingMode === "publish" ? "Saving..." : "Save & Publish"}
            </button>
          </div>
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
