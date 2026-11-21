"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch, clearAdminToken } from "@/lib/admin-api-client";
import { AdminPagination, PAGE_SIZES } from "@/components/admin/AdminPagination";

interface DocRow {
  _id: string;
  slug: string;
  title: string;
  published: boolean;
  hasDraftChanges: boolean;
  updatedAt: string;
}

type NavNode = { type: "page"; slug: string } | { type: "group"; children: NavNode[] };

function flattenSlugs(tree: NavNode[]): string[] {
  return tree.flatMap((node) => (node.type === "group" ? flattenSlugs(node.children) : [node.slug]));
}

function StatusBadge({ doc }: { doc: DocRow }) {
  if (!doc.published) {
    return (
      <span className="inline-flex rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
        Draft
      </span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
        Published
      </span>
      {doc.hasDraftChanges && (
        <span className="inline-flex rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
          Draft Pending
        </span>
      )}
    </div>
  );
}

// Docs admin dashboard: lists all docs pages with status, edit and delete
export default function AdminDocsDashboard() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<DocRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZES[0]);

  // Paged in the browser: the list is sorted by sidebar order, which the API does not know.
  // shortcut: loads every page at once, fine for hundreds; move paging to the API if docs reach thousands.
  const totalPages = Math.max(1, Math.ceil(docs.length / limit));
  const current = Math.min(page, totalPages); // a delete can empty the last page
  const visible = docs.slice((current - 1) * limit, current * limit);

  const load = async () => {
    setLoading(true);
    try {
      const [res, navRes] = await Promise.all([
        adminFetch("/api/admin/docs"),
        adminFetch("/api/admin/docs/nav"),
      ]);

      if (res.ok) {
        const pages: DocRow[] = (await res.json()).pages || [];
        const rank = new Map<string, number>();

        if (navRes.ok) {
          const navData = await navRes.json();
          const slugs = flattenSlugs(navData.draft || []);
          slugs.forEach((slug) => {
            if (!rank.has(slug)) rank.set(slug, rank.size);
          });
        }

        // Sort by sidebar order; unlisted pages appear at the end, newest first
        const at = (d: DocRow) => rank.get(d.slug) ?? Infinity;
        const sorted = [...pages].sort(
          (a, b) => at(a) - at(b) || +new Date(b.updatedAt) - +new Date(a.updatedAt)
        );

        setDocs(sorted);
      }
    } catch (err) {
      console.error("Docs list load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch {}
    clearAdminToken();
    router.push("/admin/login");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/docs/${toDelete._id}`, { method: "DELETE" });
      if (res.ok) {
        setToDelete(null);
        await load();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Delete failed.");
      }
    } catch {
      alert("Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  const btn = "inline-flex items-center justify-center rounded-lg border border-[#27272a] px-4 py-2.5 text-sm transition-colors hover:bg-[#18181b] cursor-pointer";

  return (
    <main className="min-h-screen bg-[#09090b] p-4 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Docs Admin</h1>
            <p className="mt-1 text-sm text-neutral-400">Manage documentation pages</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/docs/editor" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
              New Page
            </Link>
            <Link href="/admin/docs/sidebar" className={btn}>Edit Sidebar</Link>
            <Link href="/admin" className={btn}>Switch</Link>
            <button onClick={handleLogout} className={btn}>Log Out</button>
          </div>
        </header>

        {loading ? (
          <p className="text-sm text-neutral-400">Loading pages...</p>
        ) : docs.length === 0 ? (
          <p className="rounded-xl border border-[#27272a] bg-[#18181b] p-8 text-center text-sm text-neutral-400">
            No docs pages yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#27272a] bg-[#18181b]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#27272a] text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d._id} className="border-b border-[#27272a] last:border-0">
                    <td className="px-4 py-3 font-medium text-white">{d.title || "Untitled"}</td>
                    <td className="px-4 py-3 text-neutral-400">/docs/{d.slug}</td>
                    <td className="px-4 py-3"><StatusBadge doc={d} /></td>
                    <td className="px-4 py-3 text-neutral-400">{new Date(d.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/docs/editor?id=${d._id}`} className="rounded-md border border-[#27272a] px-3 py-1.5 text-xs hover:bg-[#27272a]">
                          Edit
                        </Link>
                        <button onClick={() => setToDelete(d)} className="cursor-pointer rounded-md border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && docs.length > 0 && (
          <AdminPagination
            page={current}
            totalPages={totalPages}
            total={docs.length}
            limit={limit}
            noun="pages"
            onPageChange={setPage}
            onLimitChange={(n) => {
              setLimit(n);
              setPage(1);
            }}
          />
        )}
      </div>

      {toDelete && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#27272a] bg-[#18181b] p-6">
            <h2 className="text-lg font-semibold text-white">Delete page</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Delete &ldquo;{toDelete.title}&rdquo;? This cannot be undone and removes it from the sidebar.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setToDelete(null)} disabled={isDeleting} className={btn}>Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
