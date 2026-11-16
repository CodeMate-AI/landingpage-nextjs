"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

// The root layout hard-codes `bg-zinc-950 text-white dark` on <body>, which pins Fumadocs to dark.
// While on /docs, swap those for the active theme; restore on leaving so the landing page is untouched.
const DARK_ONLY = ["bg-zinc-950", "text-white"];

export function DocsThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const { classList } = document.body;
    const light = resolvedTheme === "light";
    classList.toggle("dark", !light);
    DARK_ONLY.forEach((c) => classList.toggle(c, !light));
    return () => {
      classList.add("dark", ...DARK_ONLY);
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    };
  }, [resolvedTheme]);

  return null;
}
