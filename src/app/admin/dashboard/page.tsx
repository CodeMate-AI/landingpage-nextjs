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

  return (
    <main className="min-h-screen bg-[#09090b] p-8 font-sans text-neutral-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between border-b border-[#27272a] pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Blog Admin Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-400">Manage articles and publications</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/editor" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500">
              Create New Post
            </Link>
            <button onClick={handleLogout} className="rounded-lg border border-[#27272a] px-4 py-2.5 text-sm hover:bg-[#18181b]">
              Log Out
            </button>
          </div>
        </header>

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#27272a] bg-[#131316] text-sm font-medium text-neutral-400">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a] text-sm">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-[#202024]/40">
                    <td className="p-4 font-semibold text-white">{post.title}</td>
                    <td className="p-4 text-neutral-300">{post.category}</td>
                    <td className="p-4">
                      {post.published ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="space-x-2 p-4 text-right">
                      <Link href={`/admin/editor?id=${post._id}`} className="font-medium text-blue-400 hover:text-blue-300">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="ml-3 font-medium text-red-400 hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
