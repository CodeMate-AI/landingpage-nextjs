import React from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "@/lib/auth";
import { validateSessionFromDb } from "@/lib/authWrapper";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  // Bypass authentication check for the public login page to prevent redirect loops
  if (pathname === "/admin/login" || pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await validateSessionFromDb(token);
  if (!session) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
