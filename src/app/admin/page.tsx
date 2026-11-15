"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch, clearAdminToken } from "@/lib/admin-api-client";

const sections = [
  { href: "/admin/dashboard", title: "Blogs", desc: "Write and publish blog articles" },
  { href: "/admin/docs", title: "Docs", desc: "Manage documentation pages and sidebar" },
];

export default function AdminChooserPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch {}
    clearAdminToken();
    router.push("/admin/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] p-4 font-sans text-neutral-100">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">CodeMate Admin</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-xl border border-[#27272a] bg-[#18181b] p-6 transition-colors hover:border-blue-500"
            >
              <h2 className="text-xl font-semibold text-white">{s.title}</h2>
              <p className="mt-1 text-sm text-neutral-400">{s.desc}</p>
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 cursor-pointer rounded-lg border border-[#27272a] px-4 py-2.5 text-sm transition-colors hover:bg-[#18181b]"
        >
          Log Out
        </button>
      </div>
    </main>
  );
}
