"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
// lucide "clipboard" and "check"
const CLIPBOARD = svg('<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>');
const CHECK = svg('<path d="M20 6 9 17l-5-5"/>');
const CROSS = svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');

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
      // Icon-only button (clipboard, then a check for 2s); the label is for screen readers and the tooltip
      const show = (icon: string, label: string) => {
        btn.innerHTML = icon;
        btn.setAttribute("aria-label", label);
        btn.title = label;
      };
      show(CLIPBOARD, "Copy code");
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
          show(CHECK, "Copied");
        } catch {
          show(CROSS, "Copy failed");
        }
        const t = window.setTimeout(() => {
          show(CLIPBOARD, "Copy code");
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

  // FAQ block: answers are hidden only once this class is added, so without JS they stay readable
  useEffect(() => {
    document.querySelectorAll("[data-docs-content] .faq-pill-container").forEach((el) => el.classList.add("faq-js"));
    // One delegated listener; opening a question closes the others, like the blog
    const onClick = (e: MouseEvent) => {
      const summary = (e.target as Element | null)?.closest?.("[data-docs-content] .faq-pill-summary");
      const card = summary?.closest(".faq-pill-card");
      if (!summary || !card) return;
      const open = !card.classList.contains("open");
      card.closest(".faq-pill-container")?.querySelectorAll(".faq-pill-card").forEach((c) => {
        const isThis = c === card && open;
        c.classList.toggle("open", isThis);
        c.querySelector(".faq-pill-summary")?.setAttribute("aria-expanded", String(isThis));
        const badge = c.querySelector(".faq-circle-badge");
        if (badge) badge.textContent = isThis ? "−" : "+";
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
