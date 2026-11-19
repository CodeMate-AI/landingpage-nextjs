"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, FileText, Folder, FolderOpen, GripVertical, IndentDecrease, IndentIncrease, Plus, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-api-client";
import type { NavItem } from "@/lib/docs-validation";

// The tree is edited as a flat list of rows with a depth; it is rebuilt into a tree on save.
type Row = { id: string; depth: number; kind: "page" | "group"; slug?: string; title?: string };
type PageInfo = { slug: string; title: string; published: boolean };
const MAX_DEPTH = 2;
// Pixels of sideways drag that equal one nesting level, also the visual indent per level
const INDENT = 28;

// Random ids stay unique even when hot reload resets module state (a counter restarted at r1 and clashed)
const newId = () => crypto.randomUUID();

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

// Index just past the last descendant of rows[i], so a group and its children move as one block
function subtreeEnd(rows: Row[], i: number): number {
  let j = i + 1;
  while (j < rows.length && rows[j].depth > rows[i].depth) j++;
  return j;
}

// Rows shown on screen: children of collapsed groups (and of the group being dragged) are hidden
function visibleRows(rows: Row[], collapsed: Set<string>, draggingId: string | null): Row[] {
  const out: Row[] = [];
  let hideBelow = Infinity;
  for (const r of rows) {
    if (r.depth > hideBelow) continue;
    hideBelow = Infinity;
    out.push(r);
    if (r.kind === "group" && (collapsed.has(r.id) || r.id === draggingId)) hideBelow = r.depth;
  }
  return out;
}

// Where a dragged row would land: the row it follows and its new depth from the sideways offset
function project(rows: Row[], visible: Row[], collapsed: Set<string>, activeId: string, overId: string, offsetX: number) {
  const from = visible.findIndex((r) => r.id === activeId);
  const to = visible.findIndex((r) => r.id === overId);
  const moved = arrayMove(visible, from, to);
  const at = moved.findIndex((r) => r.id === activeId);
  const prev = moved[at - 1];
  const next = moved[at + 1];
  const active = rows.find((r) => r.id === activeId)!;
  const ai = rows.indexOf(active);
  // How deep the dragged block's own children go, so nesting never passes MAX_DEPTH
  const sub = Math.max(...rows.slice(ai, subtreeEnd(rows, ai)).map((r) => r.depth)) - active.depth;
  const canNestIntoPrev = prev?.kind === "group" && !collapsed.has(prev.id);
  const max = Math.min(!prev ? 0 : canNestIntoPrev ? prev.depth + 1 : prev.depth, MAX_DEPTH - sub);
  // Never sit above the next row's level, or that row would be pulled out of its group
  const min = Math.min(next && next.id !== activeId ? next.depth : 0, max);
  const depth = Math.max(min, Math.min(max, active.depth + Math.round(offsetX / INDENT)));
  return { prevId: prev?.id ?? null, depth };
}

// Dark, searchable page menu for a group's "+" button (the native select rendered white and unreadable)
function PagePicker({ unplaced, buttonClass, onPick }: { unplaced: PageInfo[]; buttonClass: string; onPick: (slug: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const q = query.trim().toLowerCase();
  const matches = unplaced.filter((p) => !q || p.title.toLowerCase().includes(q) || p.slug.includes(q));

  // Close on a click outside the menu or on Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={box} className="relative">
      <button className={buttonClass} onClick={() => (open ? close() : setOpen(true))} aria-label="Add page to group" aria-expanded={open} title="Add page to group">
        <Plus size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-80 overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b] shadow-xl shadow-black/50">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search unplaced pages"
            aria-label="Search unplaced pages"
            className="w-full border-b border-[#27272a] bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500"
          />
          <ul className="max-h-72 overflow-y-auto p-1">
            {matches.length === 0 && <li className="px-3 py-2 text-sm text-neutral-500">No matching pages.</li>}
            {matches.map((p) => (
              <li key={p.slug}>
                {/* Slug under the title tells apart pages with the same name, like two "Quick Start" pages */}
                <button
                  onClick={() => { onPick(p.slug); close(); }}
                  className="flex w-full cursor-pointer items-start gap-2 rounded-md px-2.5 py-2 text-left hover:bg-[#27272a] focus:bg-[#27272a] focus:outline-none"
                >
                  <FileText size={15} className="mt-0.5 shrink-0 text-neutral-500" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-neutral-100">{p.title}</span>
                    <span className="block truncate text-xs text-neutral-500">/docs/{p.slug}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SortableRow(props: {
  row: Row;
  depth: number;
  label: string;
  missing: boolean;
  childCount: number;
  collapsed: boolean;
  canIndent: boolean;
  unplaced: PageInfo[];
  onToggle: () => void;
  onTitle: (t: string) => void;
  onDepth: (d: number) => void;
  onAddPage: (slug: string) => void;
  onRemove: () => void;
}) {
  const { row, depth, label, missing, childCount, collapsed, canIndent, unplaced, onToggle, onTitle, onDepth, onAddPage, onRemove } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const isGroup = row.kind === "group";
  // Small square icon button; actions stay dim until the row is hovered or focused
  const icon = "grid size-7 cursor-pointer place-items-center rounded-md text-neutral-400 transition hover:bg-[#27272a] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-30";

  return (
    <div
      ref={setNodeRef}
      // Vertical-only transform; the sideways position comes from the projected depth
      style={{ transform: CSS.Translate.toString(transform && { ...transform, x: 0 }), transition }}
      // focus-within lifts the row so an open "+" menu sits above the rows below it
      className={`relative focus-within:z-20 ${isDragging ? "z-10" : ""}`}
    >
      {/* One guide line per level so the parent of each row is easy to follow */}
      {Array.from({ length: depth }, (_, d) => (
        <span key={d} aria-hidden className="absolute inset-y-0 w-px bg-[#27272a]" style={{ left: d * INDENT + 14 }} />
      ))}
      <div
        style={{ marginLeft: depth * INDENT, transition: "margin-left 120ms ease" }}
        className={`group/row mb-1.5 flex items-center gap-1.5 rounded-lg border px-1.5 py-1.5 transition-colors ${
          isDragging ? "border-blue-500/60 bg-[#111827] shadow-lg shadow-black/40" : "border-[#27272a] bg-[#09090b] hover:border-[#3f3f46]"
        }`}
      >
        <button {...attributes} {...listeners} aria-label="Drag to reorder or nest" className="cursor-grab touch-none rounded-md p-1 text-neutral-600 hover:text-neutral-300 active:cursor-grabbing">
          <GripVertical size={16} />
        </button>

        {isGroup ? (
          <>
            <button onClick={onToggle} aria-label={collapsed ? "Expand group" : "Collapse group"} aria-expanded={!collapsed} className={icon}>
              <ChevronRight size={15} className={`transition-transform ${collapsed ? "" : "rotate-90"}`} />
            </button>
            {collapsed ? <Folder size={16} className="shrink-0 text-amber-400/80" /> : <FolderOpen size={16} className="shrink-0 text-amber-400/80" />}
            <input
              value={row.title || ""}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="Group title"
              aria-label="Group title"
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm font-semibold text-white outline-none hover:border-[#27272a] focus:border-blue-500 focus:bg-[#18181b]"
            />
            <span className="shrink-0 rounded-full bg-[#27272a] px-2 py-0.5 text-[11px] tabular-nums text-neutral-400">{childCount}</span>
          </>
        ) : (
          <>
            <FileText size={16} className={`ml-1 shrink-0 ${missing ? "text-red-400" : "text-neutral-500"}`} />
            <span className={`min-w-0 flex-1 truncate px-1.5 text-sm ${missing ? "text-red-400" : "text-neutral-200"}`}>
              {label}
              <span className="ml-2 text-xs text-neutral-600">/docs/{row.slug}</span>
            </span>
          </>
        )}

        <div className="flex shrink-0 items-center opacity-60 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100">
          {/* Add an unplaced page straight into this group */}
          {isGroup && depth < MAX_DEPTH && unplaced.length > 0 && (
            <PagePicker unplaced={unplaced} buttonClass={icon} onPick={onAddPage} />
          )}
          <button className={icon} onClick={() => onDepth(depth - 1)} disabled={depth === 0} aria-label="Move out a level" title="Move out a level">
            <IndentDecrease size={15} />
          </button>
          <button className={icon} onClick={() => onDepth(depth + 1)} disabled={!canIndent} aria-label="Nest into group above" title="Nest into group above">
            <IndentIncrease size={15} />
          </button>
          <button className={`${icon} hover:text-red-400`} onClick={onRemove} aria-label="Remove" title={isGroup ? "Remove group and send its pages to Unplaced" : "Remove from sidebar"}>
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocsSidebarEditor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  // Collapsed group ids, plus live drag state used to preview where a row will land
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [drag, setDrag] = useState<{ activeId: string; overId: string; offsetX: number } | null>(null);
  const loaded = useRef(false);
  // Small move threshold so clicking the grip does not start a drag; keyboard drag still works
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
  const groups = rows.filter((r) => r.kind === "group" && r.depth < MAX_DEPTH);

  const visible = visibleRows(rows, collapsed, drag?.activeId ?? null);
  const projected = drag ? project(rows, visible, collapsed, drag.activeId, drag.overId, drag.offsetX) : null;

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const onDragStart = (e: DragStartEvent) => setDrag({ activeId: String(e.active.id), overId: String(e.active.id), offsetX: 0 });
  const onDragMove = (e: DragMoveEvent) => setDrag((d) => d && { ...d, offsetX: e.delta.x });
  const onDragOver = (e: DragOverEvent) => setDrag((d) => d && e.over ? { ...d, overId: String(e.over.id) } : d);

  // Moves the dragged row and all its children to the projected spot and depth
  const onDragEnd = (e: DragEndEvent) => {
    setDrag(null);
    if (!projected || !e.over) return;
    const ai = rows.findIndex((r) => r.id === e.active.id);
    const end = subtreeEnd(rows, ai);
    const shift = projected.depth - rows[ai].depth;
    const block = rows.slice(ai, end).map((r) => ({ ...r, depth: r.depth + shift }));
    const rest = [...rows.slice(0, ai), ...rows.slice(end)];
    const pi = projected.prevId ? rest.findIndex((r) => r.id === projected.prevId) : -1;
    // After a collapsed group the block goes past its hidden children
    const at = pi < 0 ? 0 : collapsed.has(rest[pi].id) ? subtreeEnd(rest, pi) : pi + 1;
    if (block.length && pi >= 0 && rest[pi].kind === "group" && block[0].depth > rest[pi].depth) {
      // Dropped into a collapsed group: open it so the user sees where the row went
      setCollapsed((prev) => { const next = new Set(prev); next.delete(rest[pi].id); return next; });
    }
    change([...rest.slice(0, at), ...block, ...rest.slice(at)]);
  };

  // Changes the depth of a row together with its children
  const setDepth = (id: string, depth: number) => {
    const i = rows.findIndex((r) => r.id === id);
    const end = subtreeEnd(rows, i);
    const shift = depth - rows[i].depth;
    const block = rows.slice(i, end).map((r) => ({ ...r, depth: r.depth + shift }));
    if (shift >= 0) return change([...rows.slice(0, i), ...block, ...rows.slice(end)]);
    // Moving out: place the block after its old parent group, so later siblings stay in that group
    const rest = [...rows.slice(0, i), ...rows.slice(end)];
    let parent = i - 1;
    while (parent >= 0 && rest[parent].depth >= rows[i].depth) parent--;
    const at = parent < 0 ? i : subtreeEnd(rest, parent);
    change([...rest.slice(0, at), ...block, ...rest.slice(at)]);
  };

  // A row can nest one level deeper only under a group directly above, within MAX_DEPTH for its whole block
  const canIndent = (i: number) => {
    const prev = rows[i - 1];
    if (!prev) return false;
    const max = prev.kind === "group" ? prev.depth + 1 : prev.depth;
    const sub = Math.max(...rows.slice(i, subtreeEnd(rows, i)).map((r) => r.depth)) - rows[i].depth;
    return rows[i].depth < max && rows[i].depth + 1 + sub <= MAX_DEPTH;
  };

  // Removing a group also removes its children; their pages show up under Unplaced again
  const removeRow = (id: string) => {
    const i = rows.findIndex((r) => r.id === id);
    change([...rows.slice(0, i), ...rows.slice(subtreeEnd(rows, i))]);
  };

  // Inserts a page as the last child of a group, or at the end of the top level when groupId is empty
  const addPage = (slug: string, groupId: string) => {
    const page: Row = { id: newId(), depth: 0, kind: "page", slug };
    if (!groupId) return change([...rows, page]);
    const gi = rows.findIndex((r) => r.id === groupId);
    const end = subtreeEnd(rows, gi);
    setCollapsed((prev) => { const next = new Set(prev); next.delete(groupId); return next; });
    change([...rows.slice(0, end), { ...page, depth: rows[gi].depth + 1 }, ...rows.slice(end)]);
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
  const selectCls = "cursor-pointer rounded-lg border border-[#27272a] bg-[#18181b] px-3 py-2 text-sm text-neutral-200 outline-none hover:border-[#3f3f46] focus:border-blue-500";

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
              <div className="mb-1 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-white">Sidebar order</h2>
                <div className="flex gap-2">
                  {/* Collapse or expand every group at once for quick reordering of the top level */}
                  <button
                    className={btn}
                    onClick={() => setCollapsed(collapsed.size ? new Set() : new Set(rows.filter((r) => r.kind === "group").map((r) => r.id)))}
                  >
                    {collapsed.size ? "Expand all" : "Collapse all"}
                  </button>
                  <button className={btn} onClick={() => change([...rows, { id: newId(), depth: 0, kind: "group", title: "New group" }])}>
                    Add group
                  </button>
                </div>
              </div>
              {/* Short hint so the drag-to-nest gesture is discoverable */}
              <p className="mb-4 text-xs text-neutral-500">Drag up or down to reorder. Drag right to nest under the group above, left to move out.</p>
              {rows.length === 0 && <p className="text-sm text-neutral-500">Empty. Add a group or a page below.</p>}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                onDragCancel={() => setDrag(null)}
              >
                <SortableContext items={visible.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                  {visible.map((r) => {
                    const i = rows.indexOf(r);
                    return (
                      <SortableRow
                        key={r.id}
                        row={r}
                        depth={projected && r.id === drag?.activeId ? projected.depth : r.depth}
                        label={titleOf.get(r.slug || "") ?? `${r.slug} (missing page)`}
                        missing={r.kind === "page" && !titleOf.has(r.slug || "")}
                        childCount={r.kind === "group" ? rows.slice(i + 1, subtreeEnd(rows, i)).filter((c) => c.kind === "page").length : 0}
                        collapsed={collapsed.has(r.id)}
                        canIndent={canIndent(i)}
                        unplaced={unplaced}
                        onToggle={() => toggle(r.id)}
                        onTitle={(t) => change(rows.map((x) => (x.id === r.id ? { ...x, title: t } : x)))}
                        onDepth={(d) => setDepth(r.id, Math.max(0, d))}
                        onAddPage={(slug) => addPage(slug, r.id)}
                        onRemove={() => removeRow(r.id)}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </section>

            <section className="rounded-xl border border-[#27272a] bg-[#18181b] p-4">
              <h2 className="mb-3 text-sm font-semibold text-white">Unplaced pages</h2>
              {unplaced.length === 0 ? (
                <p className="text-sm text-neutral-500">Every page is in the sidebar.</p>
              ) : (
                unplaced.map((p) => (
                  <div key={p.slug} className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#27272a] bg-[#09090b] p-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText size={16} className="shrink-0 text-neutral-500" />
                      {p.title} <span className="text-neutral-500">/docs/{p.slug}</span>
                    </span>
                    {/* Pick the destination group directly instead of adding at the bottom and nesting by hand */}
                    <select aria-label={`Add ${p.title} to`} value="" onChange={(e) => e.target.value && addPage(p.slug, e.target.value === "__top" ? "" : e.target.value)} className={selectCls}>
                      {/* Placeholder shows on the closed button only, not as a choice in the open list */}
                      <option value="" disabled hidden>Add to...</option>
                      <option value="__top">Top level</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>{"  ".repeat(g.depth)}{g.title || "Untitled group"}</option>
                      ))}
                    </select>
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
