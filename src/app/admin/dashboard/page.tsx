"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch, clearAdminToken } from "@/lib/admin-api-client";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// Administrative dashboard providing blog post management, status tracking, deletion, and numbered pagination
export default function AdminDashboard() {
  // State variables for article list, pagination metadata, and data loading indicator
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
    hasMore: false,
  });
  const router = useRouter();

  // Load posts list whenever page or limit changes
  useEffect(() => {
    fetchPosts(page, limit);
  }, [page, limit]);

  // Fetches articles from /api/admin/posts with page and limit parameters
  const fetchPosts = async (currentPage = page, currentLimit = limit) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/posts?page=${currentPage}&limit=${currentLimit}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else if (res.status === 401) {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calls logout API to increment tokenVersion, clears Bearer token, and redirects user to login screen
  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch {}
    clearAdminToken();
    router.push("/admin/login");
  };

  // Prompts user confirmation and deletes article document by ObjectId
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await adminFetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        // If this was the last item on a page > 1, navigate back one page
        if (posts.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchPosts(page, limit);
        }
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Delete call failed.");
      }
    } catch (err) {
      alert("Delete call failed.");
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Explicitly reset to page 1 on page size change
  };

  // Renders visual status badges: Published (emerald), Draft (yellow), or Draft Pending (pulsing blue)
  const renderStatus = (post: any) =>
    post.published ? (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
          Published
        </span>
        {post.hasDraftChanges && (
          <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 animate-pulse">
            Draft Pending
          </span>
        )}
      </div>
    ) : (
      <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
        Draft
      </span>
    );

  // Generate an array of page numbers with ellipsis if totalPages is large
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const startRecord = pagination.total === 0 ? 0 : (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, pagination.total);

  return (
    <main className="min-h-screen bg-[#09090b] p-4 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Dashboard top header bar with action buttons */}
        <header className="mb-8 flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Blog Admin Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-400">Manage articles and publications</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/editor" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
              Create New Post
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-lg border border-[#27272a] px-4 py-2.5 text-sm transition-colors hover:bg-[#18181b] cursor-pointer">
              Log Out
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-neutral-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-[#27272a] bg-[#18181b] p-8 text-center">
            <p className="text-base text-neutral-300 font-medium">No articles found</p>
            <p className="mt-1 text-sm text-neutral-500">Get started by creating your first blog article.</p>
            <Link
              href="/admin/editor"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Create New Post
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile / Tablet view: responsive card layout */}
            <div className="space-y-4 md:hidden">
              {posts.map((post) => (
                <article key={post._id} className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 shadow-sm transition-colors duration-200 hover:border-[#3f3f46] hover:bg-[#1c1c20]">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{post.title}</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#27272a] px-3 py-1 text-xs font-medium text-neutral-300">{post.category}</span>
                      {renderStatus(post)}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/admin/editor?id=${post._id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-2 text-sm font-semibold text-blue-400 transition-all duration-200 hover:border-transparent hover:bg-blue-600 hover:text-white sm:flex-none"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-400 transition-all duration-200 hover:border-transparent hover:bg-red-600 hover:text-white sm:flex-none cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop view: structured tabular layout */}
            <div className="hidden overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b] md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#27272a] bg-[#131316] text-sm font-medium text-neutral-400">
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a] text-sm">
                  {posts.map((post) => (
                    <tr key={post._id} className="transition-colors hover:bg-[#202024]/40">
                      <td className="p-4 font-semibold text-white">{post.title}</td>
                      <td className="p-4 text-neutral-300">{post.category}</td>
                      <td className="p-4">{renderStatus(post)}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            href={`/admin/editor?id=${post._id}`}
                            className="inline-flex items-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 transition-all duration-200 hover:border-transparent hover:bg-blue-600 hover:text-white"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-transparent hover:bg-red-600 hover:text-white cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Responsive Numbered Pagination Bar */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-3 sm:flex-row sm:px-6">
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span>
                  Showing <strong className="text-white">{startRecord}</strong> to{" "}
                  <strong className="text-white">{endRecord}</strong> of{" "}
                  <strong className="text-white">{pagination.total}</strong> articles
                </span>
                <div className="flex items-center gap-1.5 border-l border-[#27272a] pl-3">
                  <span>Per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="rounded border border-[#27272a] bg-[#09090b] px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  &larr; Previous
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pNum, idx) =>
                    pNum === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-xs text-neutral-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${pNum}`}
                        type="button"
                        onClick={() => setPage(Number(pNum))}
                        className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          page === pNum
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-[#27272a] bg-[#09090b] text-neutral-300 hover:bg-[#27272a] hover:text-white"
                        }`}
                      >
                        {pNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  className="rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
