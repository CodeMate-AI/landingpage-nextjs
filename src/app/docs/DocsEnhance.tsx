"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Progressive enhancement for published docs HTML (rendered with dangerouslySetInnerHTML):
// wraps each code block, shows its title and adds a Copy button. Without JS the plain block still reads fine.
export function DocsEnhance() {
  const pathname = usePathname();

  useEffect(() => {
    const timers = new Set<number>();

    document.querySelectorAll<HTMLPreElement>("[data-docs-content] pre").forEach((pre) => {
      if (pre.parentElement?.classList.contains("docs-code")) return;

      const wrap = document.createElement("div");
      wrap.className = "docs-code";
      pre.replaceWith(wrap);

      const title = pre.dataset.title;
      let head: HTMLDivElement | null = null;
      if (title) {
        head = document.createElement("div");
        head.className = "docs-code-title";
        const label = document.createElement("span");
        label.textContent = title;
        head.append(label);
        wrap.append(head);
      }
      wrap.append(pre);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "docs-code-copy";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
          btn.textContent = "Copied";
        } catch {
          btn.textContent = "Copy failed";
        }
        const t = window.setTimeout(() => {
          btn.textContent = "Copy";
          timers.delete(t);
        }, 2000);
        timers.add(t);
      });
      // With a title the button sits in the title row; without one it floats top-right
      if (head) head.append(btn);
      else {
        btn.classList.add("docs-code-copy-float");
        wrap.append(btn);
      }
    });

    // Tabs: build the tab bar from each panel's data-title and show one panel at a time.
    // Picking a tab selects the same-named tab in every other group on the page and is remembered
    // (so choosing "pnpm" once switches all the install snippets, like the Fumadocs tabs).
    const groups: { titles: string[]; select: (i: number) => void }[] = [];
    const TAB_KEY = "docs-tab";
    let savedTab: string | null = null;
    try {
      savedTab = localStorage.getItem(TAB_KEY);
    } catch {}

    document.querySelectorAll<HTMLElement>('[data-docs-content] [data-type="tabs"]').forEach((tabs) => {
      if (tabs.dataset.enhanced) return;
      const panels = Array.from(tabs.querySelectorAll<HTMLElement>(':scope > [data-type="tab"]'));
      if (!panels.length) return;
      tabs.dataset.enhanced = "true";

      const bar = document.createElement("div");
      bar.className = "docs-tabs-bar";
      bar.setAttribute("role", "tablist");

      const titles = panels.map((panel, i) => panel.dataset.title || `Tab ${i + 1}`);
      const buttons = panels.map((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.textContent = titles[i];
        b.addEventListener("click", () => choose(i));
        bar.append(b);
        return b;
      });
      groups.push({ titles, select });

      function choose(i: number) {
        select(i);
        try {
          localStorage.setItem(TAB_KEY, titles[i]);
        } catch {}
        groups.forEach((g) => {
          const j = g.titles.indexOf(titles[i]);
          if (g.select !== select && j >= 0) g.select(j);
        });
      }

      function select(index: number) {
        panels.forEach((p, i) => {
          p.hidden = i !== index;
          buttons[i].setAttribute("aria-selected", String(i === index));
          buttons[i].tabIndex = i === index ? 0 : -1;
        });
      }
      // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern
      bar.addEventListener("keydown", (e) => {
        const cur = buttons.findIndex((b) => b === document.activeElement);
        if (cur < 0) return;
        let next: number;
        if (e.key === "ArrowRight") next = (cur + 1) % buttons.length;
        else if (e.key === "ArrowLeft") next = (cur - 1 + buttons.length) % buttons.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = buttons.length - 1;
        else return;
        e.preventDefault();
        choose(next);
        buttons[next].focus();
      });

      tabs.prepend(bar);
      select(Math.max(0, titles.indexOf(savedTab ?? "")));
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [pathname]);

  return null;
}
