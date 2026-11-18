"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

// Syncs active theme on /docs and restores landing page defaults on unmount
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

// Injected before first paint to prevent dark mode flash in light theme
const INIT = `
try {
  var theme = localStorage.getItem("theme");
  var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  var isLight = theme === "light" || ((!theme || theme === "system") && prefersLight);

  if (isLight) {
    document.body.classList.remove("dark", "bg-zinc-950", "text-white");
  }
} catch (e) {}
`.trim();

export function DocsThemeInit() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "application/json"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: INIT }}
    />
  );
}
