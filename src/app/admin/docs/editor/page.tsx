"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-api-client";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import slugify from "@/utils/slugify";

const EMPTY_DOC = { type: "doc", content: [] };
const input = "w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-2 text-sm text-white outline-none focus:border-blue-500";

function DocsEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const [id, setId] = useState<string | null>(params.get("id"));
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<any>(EMPTY_DOC);
  const [loading, setLoading] = useState(Boolean(params.get("id")));
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Load the existing page (draft fields) when editing
  useEffect(() => {
    const existing = params.get("id");
    if (!existing) return;
    (async () => {
      try {
        const res = await adminFetch(`/api/admin/docs/${existing}`);
        if (!res.ok) throw new Error();
        const { page } = await res.json();
        setTitle(page.title);
        setSlug(page.slug);
        setSlugTouched(true);
        setDescription(page.description || "");
        setContent(page.content || EMPTY_DOC);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  // Warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const edit = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setDirty(true);
  };

  const save = async (saveMode: "draft" | "publish") => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch(id ? `/api/admin/docs/${id}` : "/api/admin/docs", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({ slug, title, description, content, saveMode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Save failed." });
        return;
      }
      setDirty(false);
      setMessage({ type: "ok", text: saveMode === "publish" ? "Published." : "Draft saved." });
      if (!id && data.id) {
        setId(data.id);
        router.replace(`/admin/docs/editor?id=${data.id}`);
      }
    } catch {
      setMessage({ type: "err", text: "A connection error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const canSave = !saving && title.trim() !== "" && slug !== "";

  return (
    <main className="min-h-screen bg-[#09090b] p-4 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">{id ? "Edit docs page" : "New docs page"}</h1>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/docs" className="rounded-lg border border-[#27272a] px-4 py-2.5 text-sm hover:bg-[#18181b]">
              Back
            </Link>
            <button disabled={!canSave} onClick={() => save("draft")} className="cursor-pointer rounded-lg border border-[#27272a] px-4 py-2.5 text-sm hover:bg-[#18181b] disabled:opacity-50">
              Save Draft
            </button>
            <button disabled={!canSave} onClick={() => save("publish")} className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">
              Save &amp; Publish
            </button>
          </div>
        </header>

        {message && (
          <p className={`rounded-lg border p-3 text-sm ${message.type === "ok" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
            {message.text}
          </p>
        )}

        <div className="grid gap-4 rounded-xl border border-[#27272a] bg-[#18181b] p-4 sm:grid-cols-2 sm:p-6">
          <label className="space-y-1 text-xs text-neutral-400">
            Title
            <input
              className={input}
              value={title}
              onChange={(e) => {
                edit(setTitle)(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </label>
          <label className="space-y-1 text-xs text-neutral-400">
            Slug (/docs/{slug || "..."})
            <input
              className={input}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                edit(setSlug)(slugify(e.target.value));
              }}
            />
          </label>
          <label className="space-y-1 text-xs text-neutral-400 sm:col-span-2">
            Description
            <input className={input} value={description} onChange={(e) => edit(setDescription)(e.target.value)} />
          </label>
        </div>

        <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 sm:p-6">
          {loadError ? (
            <p className="text-sm text-red-400">Failed to load the page. Go back and try again.</p>
          ) : loading ? (
            <p className="text-sm text-neutral-400">Loading page...</p>
          ) : (
            <SimpleEditor docsBlocks content={content} onChange={edit(setContent)} currentPostId={id} currentSlug={slug} currentTitle={title} />
          )}
        </div>
      </div>
    </main>
  );
}

export default function DocsEditorPage() {
  return (
    <Suspense fallback={null}>
      <DocsEditor />
    </Suspense>
  );
}
