"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { DownvotedList } from "@/lib/docs-analytics-core";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { PAGE_SIZES } from "@/components/admin/page-sizes";
import { useAnalyticsFetch } from "./useAnalyticsFetch";
import { card, formatDateTime, markdownPreview, panelTitle } from "./format";


// The AI answers a visitor rated not helpful: the review queue, a page at a time, each row opening its whole chat.
// The parent keys it on the range, so a new range starts again at page 1.
export function DownvotedAnswers({ rangeQs }: { rangeQs: string }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZES[0]);
  const api = new URLSearchParams(rangeQs);
  api.set("page", String(page));
  api.set("limit", String(limit));
  const list = useAnalyticsFetch<DownvotedList>(`/api/admin/docs/analytics/downvoted?${api}`);


  // The badge and pager keep the last loaded list while the next page loads, so they do not vanish on every page change
  const [shown, setShown] = useState<DownvotedList | null>(null);
  if (list.data && list.data !== shown) setShown(list.data);
  const total = shown?.total ?? 0;

  return (
    <section className={`${card} p-4 sm:p-5`}>
      <div className="flex items-center gap-3">
        <h2 className={panelTitle}>Answers rated not helpful</h2>
        {total > 0 && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-400 tabular-nums ring-1 ring-inset ring-red-500/20">{total.toLocaleString("en-GB")}</span>}
      </div>
      <p className="mt-1 text-sm text-neutral-400">Read these first: they show where the docs or the AI fell short.</p>

      <div className="mt-4">
        {list.loading ? (
          <div className="flex flex-col gap-2" aria-label="Loading answers">
            {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-lg bg-[#27272a]/50 motion-safe:animate-pulse" />)}
          </div>
        ) : list.error ? (
          <p role="alert" className="flex flex-wrap items-center gap-3 text-sm text-red-300">
            {list.error}
            <button onClick={list.reload} className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-red-500/40 px-3 text-xs hover:bg-red-500/10 sm:min-h-8">Try again</button>
          </p>
        ) : total === 0 ? (
          <p className="rounded-lg border border-dashed border-[#27272a] px-4 py-6 text-center text-sm text-neutral-500">No AI answer was rated not helpful in this range.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {list.data?.rows.map((r) => (
              <li key={r.id}>
                {/* Older chats have no threadId; the chat page also accepts the event id */}
                <Link
                  href={`/admin/docs/analytics/chats/${r.threadId ?? r.id}`}
                  className="group block rounded-lg border border-[#27272a] bg-[#09090b]/40 p-3 transition hover:-translate-y-px hover:border-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:p-4"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    {/* Visitor text stays plain React text so nothing they typed can run as HTML */}
                    <p className="min-w-0 font-medium break-words text-white group-hover:text-blue-300">{r.question}</p>
                    <p className="shrink-0 text-xs text-neutral-500">{formatDateTime(r.createdAt)}</p>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm break-words text-neutral-400">{markdownPreview(r.answer)}</p>
                  {r.page && <p className="mt-2 text-xs text-neutral-500">Asked on /docs/{r.page}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Paging only once there is more than one page; the server clamps a page past the end to the last one */}
      {shown && total > limit && (
        <AdminPagination
          page={shown.page}
          totalPages={Math.ceil(total / limit)}
          total={total}
          limit={limit}
          noun="answers"
          onPageChange={setPage}
          // A new page size starts again at the first page
          onLimitChange={(n) => { setLimit(n); setPage(1); }}
        />
      )}
    </section>
  );
}
