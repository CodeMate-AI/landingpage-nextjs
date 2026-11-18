"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Plain icon button: both icons render and CSS picks one, so nothing flashes before the theme is known
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-fd-muted-foreground transition hover:text-fd-foreground sm:size-10"
    >
      <Moon className="size-[18px] dark:hidden" aria-hidden />
      <Sun className="hidden size-[18px] dark:block" aria-hidden />
    </button>
  );
}
