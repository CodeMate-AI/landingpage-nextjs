"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/admin-api-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Allow unauthenticated access directly to login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    // 2. Inspect tab-isolated sessionStorage for active Bearer token
    const token = getAdminToken();
    if (!token) {
      setIsAuthenticated(false);
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Render minimal dark shell during initial tab token verification
  if (isAuthenticated === null && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-neutral-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-700 border-t-blue-500" />
          <p className="text-xs font-medium text-neutral-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated and redirecting, render dark background to prevent UI flash
  if (!isAuthenticated && pathname !== "/admin/login") {
    return <div className="min-h-screen bg-[#09090b]" />;
  }

  return <>{children}</>;
}
