"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { adminFetch } from "@/lib/admin-api-client";
import type { NavItem } from "@/lib/docs-validation";

// The tree is edited as a flat list of rows with a depth; it is rebuilt into a tree on save.
type Row = { id: string; depth: number; kind: "page" | "group"; slug?: string; title?: string };
const MAX_DEPTH = 2;

let counter = 0;
const newId = () => `r${++counter}`;

function flatten(tree: NavItem[], depth = 0): Row[] {
  return tree.flatMap((n) =>
    n.type === "page"
      ? [{ id: newId(), depth, kind: "page" as const, slug: n.slug }]
      : [{ id: newId(), depth, kind: "group" as const, title: n.title }, ...flatten(n.children, depth + 1)]
  );
}

// Keeps depths valid: first row at 0, a row can only nest under a group directly above it
function normalize(rows: Row[]): Row[] {
  return rows.map((r, i) => {
    const prev = rows[i - 1];
    const max = !prev ? 0 : prev.kind === "group" ? prev.depth + 1 : prev.depth;
    return { ...r, depth: Math.min(r.depth, max, MAX_DEPTH) };
  });
}

function build(rows: Row[]): NavItem[] {
  const root: NavItem[] = [];
  const stack: NavItem[][] = [root];
  for (const r of rows) {
    if (r.kind === "group") {
      const node: NavItem = { type: "group", title: r.title || "", children: [] };
      stack[r.depth].push(node);
      stack[r.depth + 1] = node.children;
    } else {
      stack[r.depth].push({ type: "page", slug: r.slug || "" });
    }
  }
  return root;
}

function SortableRow(props: {
  row: Row;
  label: string;
  missing: boolean;
  onTitle: (t: string) => void;
  onDepth: (d: number) => void;
  onRemove: () => void;
}) {
  const { row, label, missing, onTitle, onDepth, onRemove } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id });
  const small = "cursor-pointer rounded-md border border-[#27272a] px-2 py-1 text-xs hover:bg-[#27272a]";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, marginLeft: row.depth * 24 }}
      className="mb-2 flex items-center gap-2 rounded-lg border border-[#27272a] bg-[#09090b] p-2"
    >
      <button {...attributes} {...listeners} aria-label="Drag to reorder" className="cursor-grab px-2 text-neutral-500">
        ⋮⋮
      </button>
      {row.kind === "group" ? (
        <input
          value={row.title || ""}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="Group title"
          className="min-w-0 flex-1 rounded-md border border-[#27272a] bg-[#18181b] px-2 py-1 text-sm font-semibold text-white outline-none focus:border-blue-500"
        />
      ) : (
        <span className={`min-w-0 flex-1 truncate text-sm ${missing ? "text-red-400" : "text-neutral-200"}`}>{label}</span>
      )}
      <button className={small} onClick={() => onDepth(row.depth - 1)} disabled={row.depth === 0} aria-label="Outdent">
        ←
      </button>
      <button className={small} onClick={() => onDepth(row.depth + 1)} disabled={row.depth >= MAX_DEPTH} aria-label="Indent">
        →
      </button>
      <button className={`${small} text-red-400`} onClick={onRemove} aria-label="Remove">
        ✕
      </button>
    </div>
  );
}

export default function DocsSidebarEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [pages, setPages] = useState<{ slug: string; title: string; published: boolean }[]>([]);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const loaded = useRef(false);

  const load = async () => {
    try {
      const [navRes, pagesRes] = await Promise.all([adminFetch("/api/admin/docs/nav"), adminFetch("/api/admin/docs")]);
      if (navRes.ok) {
        const nav = await navRes.json();
        setRows(flatten(nav.draft || []));
        setHasDraftChanges(nav.hasDraftChanges);
      }
      if (pagesRes.ok) setPages((await pagesRes.json()).pages || []);
      setDirty(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    load();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const change = (next: Row[]) => {
    setRows(normalize(next));
    setDirty(true);
  };

  const titleOf = new Map(pages.map((p) => [p.slug, p.title]));
  const placed = new Set(rows.filter((r) => r.kind === "page").map((r) => r.slug));
  const unplaced = pages.filter((p) => !placed.has(p.slug));

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const from = rows.findIndex((r) => r.id === e.active.id);
    const to = rows.findIndex((r) => r.id === e.over!.id);
    change(arrayMove(rows, from, to));
  };

  const removeRow = (index: number) => {
    const r = rows[index];
    const next = rows.filter((_, i) => i !== index);
    if (r.kind === "group") {
      // Children move up one level
      for (let i = index; i < next.length && next[i].depth > r.depth; i++) next[i] = { ...next[i], depth: next[i].depth - 1 };
    }
    change(next);
  };

  const save = async (saveMode: "draft" | "publish") => {
    if (rows.some((r) => r.kind === "group" && !r.title?.trim())) {
      setMessage({ type: "err", text: "Every group needs a title." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await adminFetch("/api/admin/docs/nav", {
        method: "PUT",
        body: JSON.stringify({ tree: build(rows), saveMode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Save failed." });
        return;
      }
      setMessage({ type: "ok", text: saveMode === "publish" ? "Sidebar published." : "Draft saved." });
      await load();
    } catch {
      setMessage({ type: "err", text: "A connection error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const btn = "cursor-pointer rounded-lg border border-[#27272a] px-4 py-2.5 text-sm hover:bg-[#18181b] disabled:opacity-50";

  return (
    <main className="min-h-screen bg-[#09090b] p-4 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Docs sidebar</h1>
            {hasDraftChanges && !dirty && (
              <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                Draft Pending
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/docs" className={btn}>Back</Link>
            <button disabled={saving || loading} onClick={() => save("draft")} className={btn}>Save Draft</button>
            <button disabled={saving || loading} onClick={() => save("publish")} className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">
              Publish
            </button>
          </div>
        </header>

        {message && (
          <p className={`rounded-lg border p-3 text-sm ${message.type === "ok" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
            {message.text}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-neutral-400">Loading sidebar...</p>
        ) : (
          <>
            <section className="rounded-xl border border-[#27272a] bg-[#18181b] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Sidebar order</h2>
                <button className={btn} onClick={() => change([...rows, { id: newId(), depth: 0, kind: "group", title: "New group" }])}>
                  Add group
                </button>
              </div>
              {rows.length === 0 && <p className="text-sm text-neutral-500">Empty. Add a group or a page below.</p>}
              <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                  {rows.map((r, i) => (
                    <SortableRow
                      key={r.id}
                      row={r}
                      label={titleOf.get(r.slug || "") ?? `${r.slug} (missing page)`}
                      missing={r.kind === "page" && !titleOf.has(r.slug || "")}
                      onTitle={(t) => change(rows.map((x) => (x.id === r.id ? { ...x, title: t } : x)))}
                      onDepth={(d) => change(rows.map((x) => (x.id === r.id ? { ...x, depth: Math.max(0, d) } : x)))}
                      onRemove={() => removeRow(i)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </section>

            <section className="rounded-xl border border-[#27272a] bg-[#18181b] p-4">
              <h2 className="mb-3 text-sm font-semibold text-white">Unplaced pages</h2>
              {unplaced.length === 0 ? (
                <p className="text-sm text-neutral-500">Every page is in the sidebar.</p>
              ) : (
                unplaced.map((p) => (
                  <div key={p.slug} className="mb-2 flex items-center justify-between rounded-lg border border-[#27272a] bg-[#09090b] p-2 text-sm">
                    <span>
                      {p.title} <span className="text-neutral-500">/docs/{p.slug}</span>
                    </span>
                    <button className={btn} onClick={() => change([...rows, { id: newId(), depth: 0, kind: "page", slug: p.slug }])}>
                      Add
                    </button>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
