"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-api-client";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import slugify from "@/utils/slugify";
import type { JSONContent } from "@tiptap/react";
import DocsPreviewModal from "../DocsPreviewModal";
import AutoSaveToggle from "@/components/AutoSaveToggle";
import ConflictBanner from "@/components/ConflictBanner";
import { useAutoSavePref } from "@/lib/useAutoSavePref";
import { DOCS_PREVIEW_CHANNEL, DOCS_PREVIEW_LAST } from "../previewChannel";

const EMPTY_DOC = { type: "doc", content: [] };
// Same field styles as the blog editor (/admin/editor) so both editors look alike
const input = "w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-400";
const hintCls = "mt-1.5 text-xs text-neutral-400";

function DocsEditor() {
  const router = useRouter();
  const params = useSearchParams();
  const [id, setId] = useState<string | null>(params.get("id"));
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  // Tiptap document JSON
  const [content, setContent] = useState<JSONContent>(EMPTY_DOC);
  const [loading, setLoading] = useState(Boolean(params.get("id")));
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingMode, setSavingMode] = useState<"draft" | "publish">("draft");
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Edit conflict guard: version this tab last loaded or saved, and who saved over it (shows the banner)
  const versionRef = useRef(0);
  const [conflict, setConflict] = useState<{ email?: string; at?: string; mode: "draft" | "publish" } | null>(null);
  // Bumped by "Reload Latest Version" to run the load effect again
  const [reloadTick, setReloadTick] = useState(0);

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
        // Pages saved before versioning have none: 0 tells the server so
        versionRef.current = page.version ?? 0;
        setConflict(null);
        setDirty(false);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [params, reloadTick]);

  // Preview: the preview page (modal iframe or new tab) says "hello" on a channel. From then on this page
  // renders the current form through the admin API (it holds the login) and sends the result, again on every edit.
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewInput = useRef({ title, slug, description, content });
  const pushPreview = useRef<() => void>(() => {});
  // Number of open previews (modal and/or tab) of this editor; nothing is rendered while it is 0
  const previews = useRef(0);
  // Previews belong to one editor tab: they carry this id, and other editors' messages are ignored
  const [editorId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    previewInput.current = { title, slug, description, content };
    pushPreview.current();
  }, [title, slug, description, content]);

  useEffect(() => {
    const channel = new BroadcastChannel(DOCS_PREVIEW_CHANNEL);
    let ctrl: AbortController | null = null;
    let timer = 0;
    const send = async () => {
      window.clearTimeout(timer);
      ctrl?.abort();
      const mine = new AbortController();
      ctrl = mine;
      try {
        const res = await adminFetch("/api/admin/docs/preview", { method: "POST", body: JSON.stringify(previewInput.current), signal: mine.signal });
        const data = res.ok ? await res.json() : null;
        // a newer edit took over, or the last preview closed while this was running
        if (mine.signal.aborted || previews.current === 0) return;
        channel.postMessage(data ? { type: "render", editor: editorId, data } : { type: "error", editor: editorId, status: res.status });
        // last render, so a preview opened while this tab is gone (or replaced) still has something to show
        if (data) {
          try {
            localStorage.setItem(DOCS_PREVIEW_LAST, JSON.stringify({ editor: editorId, data }));
          } catch {}
        }
      } catch {
        // aborted by a newer edit, or offline: the next edit sends again
      }
    };
    pushPreview.current = () => {
      if (previews.current === 0) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(send, 500);
    };
    channel.onmessage = (e) => {
      if (e.data?.editor !== editorId) return;
      if (e.data.type === "hello") {
        previews.current++;
        send();
      } else if (e.data.type === "bye") {
        previews.current = Math.max(0, previews.current - 1);
      }
    };
    return () => {
      window.clearTimeout(timer);
      ctrl?.abort();
      channel.close();
      previews.current = 0;
    };
  }, [editorId]);

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
    // Count edits so a save knows if the form changed while its request was in flight
    revRef.current += 1;
    setRev(revRef.current);
  };

  // Auto save state: shared on/off setting, edit counter, and the edit count of the last failed auto save
  const [autoSave, setAutoSave] = useAutoSavePref();
  const [rev, setRev] = useState(0);
  const revRef = useRef(0);
  const [autoSaving, setAutoSaving] = useState(false);
  const [failedRev, setFailedRev] = useState(-1);

  const save = async (saveMode: "draft" | "publish", silent = false, forceOverwrite = false) => {
    const startRev = revRef.current;
    setSaving(true);
    setSavingMode(saveMode);
    setAutoSaving(silent);
    if (!silent) setMessage(null);
    try {
      const res = await adminFetch(id ? `/api/admin/docs/${id}` : "/api/admin/docs", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({ slug, title, description, content, saveMode, version: versionRef.current, forceOverwrite }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data.conflict) {
        // Someone saved since this tab loaded: pause auto save and let the user choose
        // Remember Save Draft vs Publish so "Keep My Version" repeats what the user clicked
        setConflict({ ...(data.lastModifiedBy || {}), mode: saveMode });
        return;
      }
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Save failed." });
        // Stop auto save retrying the same failing edit; the next edit tries again
        if (silent) setFailedRev(startRev);
        return;
      }
      if (typeof data.version === "number") versionRef.current = data.version;
      setConflict(null);
      // Edits typed during the request stay unsaved so auto save (or the user) saves them next
      if (revRef.current === startRev) setDirty(false);
      if (silent) setMessage((m) => (m?.type === "err" ? null : m));
      else setMessage({ type: "ok", text: saveMode === "publish" ? "Published." : "Draft saved." });
      if (!id && data.id) {
        setId(data.id);
        router.replace(`/admin/docs/editor?id=${data.id}`);
      }
    } catch {
      setMessage({ type: "err", text: "A connection error occurred." });
      if (silent) setFailedRev(startRev);
    } finally {
      setSaving(false);
      setAutoSaving(false);
    }
  };

  const canSave = !saving && title.trim() !== "" && slug !== "";

  // Auto save: 1.5 s after the last edit, save a draft (never publishes); needs a title and slug first
  const saveRef = useRef(save);
  // Keep the latest save (with current form values) for the timer without restarting it on every render
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    if (!autoSave || !dirty || !canSave || conflict || rev === failedRev) return;
    const timer = setTimeout(() => void saveRef.current("draft", true), 1500);
    return () => clearTimeout(timer);
  }, [autoSave, dirty, canSave, conflict, rev, failedRev]);
  const saveHint = canSave ? undefined : saving ? "Saving..." : "Add a title and URL slug to save";

  return (
    <main className="min-h-screen bg-[#09090b] p-4 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#27272a] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{id ? "Modify Docs Page" : "Compose Docs Page"}</h1>
            {/* Save status and the shared Auto save switch sit together under the title */}
            <AutoSaveToggle status={autoSaving ? "saving" : dirty ? "dirty" : id ? "saved" : "empty"} on={autoSave} onChange={setAutoSave} />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="cursor-pointer rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white"
            >
              Preview
            </button>
            <Link href="/admin/docs" className="text-sm text-neutral-400 transition-colors hover:text-neutral-200">
              Cancel
            </Link>
          </div>
        </header>

        {conflict && (
          <ConflictBanner
            what="page"
            by={conflict}
            busy={saving}
            onReload={() => setReloadTick((t) => t + 1)}
            onOverwrite={() => void save(conflict.mode, false, true)}
          />
        )}

        {message && (
          <p className={`mb-6 rounded-lg border p-3 text-sm ${message.type === "ok" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
            {message.text}
          </p>
        )}

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="doc-title" className={labelCls}>Title</label>
            <input
              id="doc-title"
              className={input}
              required
              value={title}
              onChange={(e) => {
                edit(setTitle)(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>

          <div>
            <label htmlFor="doc-slug" className={labelCls}>Page URL</label>
            <div className="flex items-stretch overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b]">
              <span className="flex select-none items-center border-r border-[#27272a] px-3 text-sm text-neutral-500">/docs/</span>
              <input
                id="doc-slug"
                className="min-w-0 flex-1 bg-transparent p-3 text-white focus:outline-none"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  edit(setSlug)(slugify(e.target.value));
                }}
              />
            </div>
            <p className={hintCls}>{slugTouched ? "Custom URL. Changing it breaks links to the old one." : "Follows the title until you edit it."}</p>
          </div>

          <div>
            <label htmlFor="doc-desc" className={labelCls}>Description</label>
            <textarea id="doc-desc" rows={2} className={input} value={description} onChange={(e) => edit(setDescription)(e.target.value)} />
            <p className={hintCls}>Optional. Shown in search results and link previews.</p>
          </div>

          <div>
            <label className={labelCls}>Content Editor</label>
            {loadError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                Failed to load the page. Please refresh, or go back to the docs list.
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-3 rounded-lg border border-[#27272a] bg-[#18181b] p-8 text-sm text-neutral-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />
                <span>Loading page content...</span>
              </div>
            ) : (
              <SimpleEditor docsBlocks content={content} onChange={edit(setContent)} currentPostId={id} currentSlug={slug} currentTitle={title} />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <button
              type="button"
              disabled={!canSave}
              title={saveHint}
              onClick={() => save("draft")}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] px-6 py-3 text-center font-semibold text-neutral-300 transition hover:bg-[#232329] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving && savingMode === "draft" ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              disabled={!canSave}
              title={saveHint}
              onClick={() => save("publish")}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving && savingMode === "publish" ? "Saving..." : "Save & Publish"}
            </button>
          </div>
        </form>

        <DocsPreviewModal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} slug={slug || "untitled"} editorId={editorId} />
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
