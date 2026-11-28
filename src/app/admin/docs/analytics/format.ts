// Date and time for tables on a 12-hour clock, in the admin's own time zone, e.g. "26 Nov 2026, 2:05 pm"
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

// Short day for compact rows, e.g. "26 Nov"
export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// "1 question", "4 questions": counts read as words, never "1 questions"
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// A one-line plain-text preview of a Markdown answer: drops code fences, emphasis, link targets, table pipes and list markers
export function markdownPreview(md: string): string {
  return md
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // ">" only marks a quote at a line start; elsewhere it is text, as in "Account > API keys"
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*_`#|]/g, "")
    .replace(/^\s*(?:[-+]|\d+\.)\s+/gm, "")
    .replace(/-{3,}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Shared look for the analytics panels: one surface, one radius, one heading size across the page
export const card = "rounded-xl border border-[#27272a] bg-[#18181b]";
export const panelTitle = "text-base font-semibold text-white";
// Segmented controls (range presets, chat filters): 44px tall on touch screens, 36px with a mouse
export const segment =
  "inline-flex min-h-11 items-center justify-center px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:min-h-9 cursor-pointer";
export const segmentOn = "bg-[#27272a] text-white";
export const segmentOff = "text-neutral-400 hover:text-white hover:bg-[#27272a]/50";
