"use client";

// The list lives in a plain module that server code can read; it is used here and re-exported so existing imports keep working
import { PAGE_SIZES } from "./page-sizes";
export { PAGE_SIZES };

// Phones get 44px-tall targets; from the sm breakpoint the bar keeps its compact desktop size
const navBtn =
  "min-h-11 sm:min-h-0 rounded-lg border border-[#27272a] bg-[#09090b] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  noun: string; // "articles", "pages"
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

// Shared pagination bar for the blog and docs admin lists
export function AdminPagination({ page, totalPages, total, limit, noun, onPageChange, onLimitChange }: Props) {
  // At most 3 page numbers, sliding with the current page (1 2 3, then 2 3 4, ...) so 500 pages never flood the bar
  const first = Math.max(1, Math.min(page - 1, totalPages - 2));
  const numbers = Array.from({ length: Math.min(3, totalPages) }, (_, i) => first + i);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-[#27272a] bg-[#18181b] px-4 py-3 sm:flex-row sm:px-6">
      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
        <span>
          Showing <strong className="text-white">{start}</strong> to <strong className="text-white">{end}</strong> of{" "}
          {/* Every noun passed in is a plain plural, so one item drops the trailing "s" ("1 chat", not "1 chats") */}
          <strong className="text-white">{total}</strong> {total === 1 ? noun.replace(/s$/, "") : noun}
        </span>
        <div className="flex items-center gap-1.5 border-l border-[#27272a] pl-3">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            // 44px tall on phones like the page buttons; compact from the sm breakpoint
            className="min-h-11 sm:min-h-0 rounded border border-[#27272a] bg-[#09090b] px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Wraps instead of overflowing on the narrowest phones */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={navBtn}>
          &larr; Previous
        </button>
        <div className="flex items-center gap-1">
          {numbers.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={`min-h-11 min-w-11 sm:min-h-0 sm:min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                page === n
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-[#27272a] bg-[#09090b] text-neutral-300 hover:bg-[#27272a] hover:text-white"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className={navBtn}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
