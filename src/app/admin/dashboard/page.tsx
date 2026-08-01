"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      } else if (res.status === 401) {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((current) => current.filter((p) => p._id !== id));
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json();
        alert(data.error || "Delete call failed.");
      }
    } catch (err) {
      alert("Delete call failed.");
    }
  };

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

  return (
    <main className="min-h-screen bg-[#09090b] p-4 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Blog Admin Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-400">Manage articles and publications</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/editor" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
              Create New Post
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center justify-center rounded-lg border border-[#27272a] px-4 py-2.5 text-sm transition-colors hover:bg-[#18181b]">
              Log Out
            </button>
          </div>
        </header>

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <>
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
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-sm font-semibold text-red-400 transition-all duration-200 hover:border-transparent hover:bg-red-600 hover:text-white sm:flex-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

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
                            className="inline-flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-transparent hover:bg-red-600 hover:text-white"
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
          </>
        )}
      </div>
    </main>
  );
}
