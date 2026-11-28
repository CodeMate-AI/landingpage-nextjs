"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChatList, ChatRow, FeedbackFilter } from "@/lib/docs-analytics-core";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { readChatFilters, withChatFilters, type ChatFilterState } from "./rangeParams";
import { useAnalyticsFetch } from "./useAnalyticsFetch";
import { card, formatDateTime, panelTitle, plural, segment, segmentOff, segmentOn } from "./format";

const FILTERS: { value: FeedbackFilter; label: string }[] = [
  { value: "any", label: "All" },
  { value: "down", label: "Not helpful" },
  { value: "up", label: "Helpful" },
];
const chatHref = (c: ChatRow) => `/admin/docs/analytics/chats/${c.threadId}`;

// The visitor's ratings in a chat as small coloured counts, or "Not rated" when nobody rated
function Feedback({ chat }: { chat: ChatRow }) {
  if (!chat.up && !chat.down) return <span className="text-neutral-500">Not rated</span>;
  return (
    <span className="inline-flex gap-2 tabular-nums">
      {chat.up > 0 && <span className="text-emerald-400">{chat.up} helpful</span>}
      {chat.down > 0 && <span className="text-red-400">{chat.down} not helpful</span>}
    </span>
  );
}

// Ask AI chats in the range, one row per chat, with feedback filter and paging kept in the URL
export function ChatsTable({ rangeQs }: { rangeQs: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const filters = readChatFilters(params);
  const api = new URLSearchParams(rangeQs);
  api.set("feedback", filters.feedback);
  api.set("page", String(filters.p));
  api.set("limit", String(filters.limit));
  if (filters.visitorOf) api.set("visitorOf", filters.visitorOf);
  const list = useAnalyticsFetch<ChatList>(`/api/admin/docs/analytics/chats?${api}`);

  const update = (patch: Partial<ChatFilterState>) => router.replace(`?${withChatFilters(params, patch)}`, { scroll: false });

  return (
    <section className={`${card} p-4 sm:p-5`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className={panelTitle}>AI chats</h2>
          <p className="mt-1 text-sm text-neutral-400">Every Ask AI conversation, newest activity first.</p>
        </div>
        <div role="group" aria-label="Filter by rating" className="grid grid-cols-3 rounded-lg border border-[#27272a] bg-[#09090b]/40 p-0.5 sm:inline-grid">
          {FILTERS.map((f) => {
            const on = filters.feedback === f.value;
            return (
              // A new filter starts again at the first page
              <button key={f.value} type="button" aria-pressed={on} onClick={() => update({ feedback: f.value, p: 1 })} className={`${segment} rounded-md ${on ? segmentOn : segmentOff}`}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {filters.visitorOf && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
          <span>Showing one visitor&apos;s chats only.</span>
          <Link href={`?${withChatFilters(params, { visitorOf: undefined, p: 1 })}`} replace scroll={false} className="inline-flex min-h-11 items-center font-medium text-white underline underline-offset-4 sm:min-h-0">
            Show all chats
          </Link>
        </div>
      )}

      <div className="mt-4">
        {list.loading ? (
          <div className="flex flex-col gap-2" aria-label="Loading chats">
            {[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-[#27272a]/50 motion-safe:animate-pulse" />)}
          </div>
        ) : list.error ? (
          <p role="alert" className="flex flex-wrap items-center gap-3 text-sm text-red-300">
            {list.error}
            <button onClick={list.reload} className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-red-500/40 px-3 text-xs hover:bg-red-500/10 sm:min-h-8">Try again</button>
          </p>
        ) : !list.data || list.data.total === 0 ? (
          <p className="rounded-lg border border-dashed border-[#27272a] px-4 py-8 text-center text-sm text-neutral-500">
            {filters.feedback === "any" ? "No one used Ask AI in this range." : "No chats match this filter in this range."}
          </p>
        ) : (
          <>
            {/* Phones and small tablets: one card per chat */}
            <ul className="flex flex-col gap-2 md:hidden">
              {list.data.chats.map((c) => (
                <li key={c.threadId}>
                  <Link href={chatHref(c)} className="block rounded-lg border border-[#27272a] bg-[#09090b]/40 p-3 transition hover:border-neutral-600 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-blue-500">
                    {/* Visitor text stays plain React text so nothing they typed can run as HTML */}
                    <p className="line-clamp-2 font-medium break-words text-white">{c.firstQuestion}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                      <span>{plural(c.questions, "question")}</span>
                      {c.page && <span>/docs/{c.page}</span>}
                      <Feedback chat={c} />
                      <span>{formatDateTime(c.lastAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Tablets in landscape and wider: a table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-neutral-500">
                  <tr className="border-b border-[#27272a]">
                    <th className="py-2.5 pr-4 font-medium">First question</th>
                    <th className="py-2.5 pr-4 font-medium">Page</th>
                    <th className="py-2.5 pr-4 text-right font-medium">Questions</th>
                    <th className="py-2.5 pr-4 font-medium">Rating</th>
                    <th className="py-2.5 text-right font-medium">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.chats.map((c) => (
                    <tr key={c.threadId} className="border-b border-[#27272a] transition-colors last:border-0 hover:bg-[#27272a]/30">
                      <td className="max-w-md py-3 pr-4">
                        <Link href={chatHref(c)} className="line-clamp-2 font-medium break-words text-white underline-offset-4 hover:text-blue-300 hover:underline focus-visible:underline">{c.firstQuestion}</Link>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap text-neutral-400">{c.page ? `/docs/${c.page}` : <span className="text-neutral-500">Unknown</span>}</td>
                      <td className="py-3 pr-4 text-right text-white tabular-nums">{c.questions}</td>
                      <td className="py-3 pr-4 whitespace-nowrap"><Feedback chat={c} /></td>
                      <td className="py-3 text-right whitespace-nowrap text-neutral-400 tabular-nums">{formatDateTime(c.lastAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* The API clamps a page past the end, so the bar shows the page it actually returned */}
            <AdminPagination
              page={list.data.page}
              totalPages={Math.max(1, Math.ceil(list.data.total / list.data.limit))}
              total={list.data.total}
              limit={list.data.limit}
              noun="chats"
              onPageChange={(p) => update({ p })}
              onLimitChange={(limit) => update({ limit, p: 1 })}
            />
          </>
        )}
      </div>
    </section>
  );
}
