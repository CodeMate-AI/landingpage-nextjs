import React from "react";
import { percent, type PageVotes } from "@/lib/docs-analytics-core";
import { card, panelTitle } from "./format";

// One page with its share of helpful votes as a green and red split, so pages compare down the column
function PageRow({ row }: { row: PageVotes }) {
  const total = row.up + row.down;
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex items-baseline justify-between gap-3">
        {/* Votes can outlive a page: a slug with no published page is shown but not linked */}
        {row.title ? (
          <a href={`/docs/${row.slug}`} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-sm font-medium text-white underline-offset-4 hover:underline focus-visible:underline">
            {row.title}
          </a>
        ) : (
          <span className="min-w-0 truncate text-sm text-neutral-400">/docs/{row.slug}</span>
        )}
        <span className="shrink-0 text-sm font-semibold text-white tabular-nums">{percent(row.up, row.down)}%</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-[#27272a]" aria-hidden>
        <div className="bg-emerald-400" style={{ width: `${(row.up / total) * 100}%` }} />
        <div className="bg-red-400" style={{ width: `${(row.down / total) * 100}%` }} />
      </div>
      <p className="text-xs text-neutral-500 tabular-nums">{row.up} up, {row.down} down</p>
    </li>
  );
}

function PageList({ title, rows, empty }: { title: string; rows: PageVotes[]; empty: string }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-medium text-neutral-300">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-[#27272a] px-4 py-6 text-center text-sm text-neutral-500">{empty}</p>
      ) : (
        <ul className="divide-y divide-[#27272a]">
          {rows.map((r) => <PageRow key={r.slug} row={r} />)}
        </ul>
      )}
    </div>
  );
}

// "Was this page helpful?" votes: the best and worst rated docs pages side by side, stacked on small screens
export function PageFeedback({ top, bottom }: { top: PageVotes[]; bottom: PageVotes[] }) {
  return (
    <section className={`${card} p-4 sm:p-5`}>
      <h2 className={panelTitle}>Page feedback</h2>
      <p className="mt-1 text-sm text-neutral-400">Votes from the &ldquo;Was this page helpful?&rdquo; question on each docs page.</p>
      <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2">
        <PageList title="Most helpful" rows={top} empty="No page got a helpful vote in this range." />
        <PageList title="Least helpful" rows={bottom} empty="No page got a not helpful vote in this range." />
      </div>
    </section>
  );
}
