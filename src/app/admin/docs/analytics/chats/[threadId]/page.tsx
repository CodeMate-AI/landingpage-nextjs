"use client";

import React, { useState, type MouseEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ChatDetail, ChatEventView, ChatTool } from "@/lib/docs-analytics-core";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { PAGE_SIZES } from "@/components/admin/page-sizes";
import { AnswerMarkdown } from "@/app/docs/ask-ai/Markdown";
import { useAnalyticsFetch } from "../../useAnalyticsFetch";
import { formatDateTime, plural } from "../../format";
import "../../analytics.css";

const NOT_FOUND = "Chat not found";
const btn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#27272a] px-4 text-sm transition-colors hover:bg-[#18181b] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:min-h-10";

// One tool call in words, e.g. Searched "install wsl", 4 pages, or Read /docs/install
function toolText(t: ChatTool): string {
  if (t.name === "read_page") return `Read ${t.input}`;
  return t.results === undefined ? `Searched "${t.input}"` : `Searched "${t.input}", ${plural(t.results, "page")}`;
}

// Links inside an answer open in a new tab so the admin keeps this page
function openLinksInNewTab(e: MouseEvent<HTMLDivElement>) {
  const link = (e.target as HTMLElement).closest("a");
  if (!link) return;
  e.preventDefault();
  window.open(link.href, "_blank", "noopener,noreferrer");
}

// Time of day on a 12-hour clock only when the question was asked on the chat's first day, the full date otherwise
function eventTime(iso: string, firstIso: string): string {
  const sameDay = new Date(iso).toDateString() === new Date(firstIso).toDateString();
  return sameDay ? new Date(iso).toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }) : formatDateTime(iso);
}

// The visitor's rating as a thumb and plain coloured words, without a badge box; unrated answers show nothing
function RatingNote({ rating }: { rating: ChatEventView["rating"] }) {
  if (rating !== 1 && rating !== -1) return null;
  const up = rating === 1;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
      <svg aria-hidden viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${up ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7v7H2.5V7zM5 7l2.5-5c1.1 0 2 .9 2 2v2h3.6a1.5 1.5 0 0 1 1.47 1.8l-.9 4.5A1.5 1.5 0 0 1 12.2 14H5" />
      </svg>
      {up ? "Rated helpful" : "Rated not helpful"}
    </span>
  );
}

// A magnifier for a docs search and a page for a page read, so the two tools tell apart at a glance
function ToolIcon({ name }: { name: ChatTool["name"] }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {name === "search_docs" ? <><circle cx="7" cy="7" r="4.25" /><path d="m10.25 10.25 3.25 3.25" /></> : <><path d="M4 1.75h5.5L12.25 4.5v9.75H4z" /><path d="M6.25 7.5h3.5M6.25 10h3.5" /></>}
    </svg>
  );
}

// The tools the model used before answering, as small chips in the order it called them
function ToolChips({ tools }: { tools: ChatTool[] | null }) {
  if (tools === null) return <p className="text-xs text-neutral-500">Tools not recorded for this answer</p>;
  if (tools.length === 0) return <p className="text-xs text-neutral-500">Answered without searching the docs</p>;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Tools used">
      {tools.map((t, i) => (
        <li key={i} className="flex max-w-full min-w-0 items-center gap-1.5 rounded-md bg-[#27272a]/50 px-2 py-1 text-xs text-neutral-400">
          <ToolIcon name={t.name} />
          <span className="truncate">{toolText(t)}</span>
        </li>
      ))}
    </ul>
  );
}

// One question and its answer; the number in its top line marks its place in the whole conversation
function ChatEvent({ event, n, firstAt }: { event: ChatEventView; n: number; firstAt: string }) {
  return (
    <li>
      {/* A not helpful answer also gets a red edge, the first thing to read on review */}
      <article className={`min-w-0 overflow-hidden rounded-xl border bg-[#18181b] ${event.rating === -1 ? "border-red-500/30" : "border-[#27272a]"}`}>
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            {/* One line: a long page path is cut with an ellipsis and shown whole on hover */}
            <p className="min-w-0 flex-1 truncate text-xs text-neutral-500 tabular-nums">
              {/* A real space after the label, so copied text and screen readers get "Question 1 10:24 am", not "Question 110:24 am" */}
              <span className="mr-1.5 font-semibold text-neutral-200">Question {n}</span>{" "}
              <time dateTime={event.createdAt} title={formatDateTime(event.createdAt)}>{eventTime(event.createdAt, firstAt)}</time>
              {event.page && (
                <>
                  {" on "}
                  <a href={`/docs/${event.page}`} target="_blank" rel="noopener noreferrer" title={`/docs/${event.page}`} className="text-neutral-400 underline decoration-neutral-700 underline-offset-4 hover:text-white hover:decoration-neutral-400">/docs/{event.page}</a>
                </>
              )}
            </p>
            <RatingNote rating={event.rating} />
          </div>
          {/* Visitor text stays plain React text so nothing they typed can run as HTML */}
          <h2 className="text-base font-semibold break-words whitespace-pre-wrap text-white sm:text-lg sm:leading-snug">{event.question}</h2>
          <ToolChips tools={event.tools} />
        </div>
        <div className="border-t border-[#27272a] bg-[#09090b]/40 p-4 text-sm text-neutral-200 sm:p-5 sm:text-[15px]">
          {/* Names who wrote the reply, so question and answer read as two turns of a conversation */}
          <p className="mb-2 text-xs font-medium text-neutral-500">Answer from CodeMate AI</p>
          {event.answer === null ? (
            <p className="text-neutral-500 italic">No answer saved: the reply was stopped or failed.</p>
          ) : (
            <AnswerMarkdown text={event.answer} onClick={openLinksInNewTab} />
          )}
        </div>
      </article>
    </li>
  );
}

// The ratings in one line under the title, e.g. "4 questions, 2 rated helpful, 1 rated not helpful", for the whole chat
function ratingSummary({ total, up, down }: ChatDetail): string {
  const parts = [plural(total, "question")];
  if (up) parts.push(`${up} rated helpful`);
  if (down) parts.push(`${down} rated not helpful`);
  if (!up && !down) parts.push("no ratings");
  return parts.join(", ");
}

// Facts about the chat as one divided band: two columns on phones, one row from tablet width up
function ChatFacts({ chat }: { chat: ChatDetail }) {
  const cell = "min-w-0 bg-[#18181b] px-4 py-3 sm:last:flex-1";
  return (
    <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#27272a] bg-[#27272a] text-sm sm:flex">
      <div className={`${cell} col-span-2`}>
        <dt className="text-xs text-neutral-500">Started</dt>
        <dd className="mt-0.5 whitespace-nowrap text-neutral-100 tabular-nums">{formatDateTime(chat.firstAt)}</dd>
      </div>
      <div className={cell}>
        <dt className="text-xs text-neutral-500">Questions</dt>
        <dd className="mt-0.5 text-neutral-100 tabular-nums">{chat.total.toLocaleString("en-GB")}</dd>
      </div>
      <div className={cell}>
        <dt className="text-xs text-neutral-500">Visitor</dt>
        <dd className="mt-0.5 text-neutral-100 tabular-nums">{chat.visitor ?? "Not recorded"}</dd>
      </div>
      {chat.firstPage && (
        <div className={`${cell} col-span-2`}>
          <dt className="text-xs text-neutral-500">First page</dt>
          {/* Long slugs are cut with an ellipsis; the full path shows on hover */}
          <dd className="mt-0.5 truncate text-neutral-100" title={`/docs/${chat.firstPage}`}>/docs/{chat.firstPage}</dd>
        </div>
      )}
    </dl>
  );
}

// Every question and answer of one Ask AI chat, for reviewing what visitors asked and what they got
export default function ChatDetailPage() {
  const router = useRouter();
  const { threadId } = useParams<{ threadId: string }>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZES[0]);
  const chat = useAnalyticsFetch<ChatDetail>(`/api/admin/docs/analytics/chats/${encodeURIComponent(threadId)}?page=${page}&limit=${limit}`);
  const events = chat.data?.events ?? [];
  // The header keeps the last loaded chat while another page loads, so it does not blink on every page change
  const [header, setHeader] = useState<ChatDetail | null>(null);
  if (chat.data && chat.data !== header) setHeader(chat.data);
  // Questions are numbered across the whole chat, so page 2 of 10 a page starts at question 11
  const offset = chat.data ? (chat.data.page - 1) * chat.data.limit : 0;
  const changePage = (next: number) => {
    setPage(next);
    // Instant, so the new page opens at the top rather than gliding past the old one
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Back keeps the range and filters the admin came from; a directly opened link has nothing to go back to
  const goBack = () => (window.history.length > 1 ? router.back() : router.push("/admin/docs/analytics"));

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-6 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Back on the left and the visitor's other chats on the right, so the header below holds only the chat */}
        <nav aria-label="Chat" className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={goBack} className={btn}>
            <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back to analytics
          </button>
          {chat.data?.visitor && (
            <Link href={`/admin/docs/analytics?range=90d&visitorOf=${encodeURIComponent(threadId)}`} className={btn}>
              Other chats by this visitor
            </Link>
          )}
        </nav>

        <header className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl sm:leading-tight">
            Chat <span className="text-neutral-400">{threadId.slice(0, 8)}</span>
          </h1>
          {/* Fixed height so the facts do not push the page down when they arrive */}
          <p className="mt-1 h-5 text-sm text-neutral-400">{header && ratingSummary(header)}</p>
          {header && <ChatFacts chat={header} />}
        </header>

        <div className="mt-8">
          {chat.loading ? (
            <div className="flex flex-col gap-4" aria-label="Loading chat">
              <div className="h-16 rounded-xl border border-[#27272a] bg-[#18181b] motion-safe:animate-pulse" />
              {[0, 1].map((i) => <div key={i} className="h-48 rounded-xl border border-[#27272a] bg-[#18181b] motion-safe:animate-pulse" />)}
            </div>
          ) : chat.error ? (
            <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              <span>{chat.error === NOT_FOUND ? "Chat not found. It may be older than 90 days, or the link is wrong." : chat.error}</span>
              {/* A missing chat will not appear on a retry */}
              {chat.error !== NOT_FOUND && <button onClick={chat.reload} className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-red-500/40 px-3 text-xs hover:bg-red-500/10 sm:min-h-8">Try again</button>}
            </div>
          ) : (
            <ol className="flex flex-col gap-6" aria-label="Questions in this chat">
              {events.map((e, i) => <ChatEvent key={e.id} event={e} n={offset + i + 1} firstAt={chat.data!.firstAt} />)}
            </ol>
          )}
          {/* Paging only once a chat has more questions than one page holds */}
          {chat.data && chat.data.total > limit && (
            <AdminPagination
              page={chat.data.page}
              totalPages={Math.ceil(chat.data.total / limit)}
              total={chat.data.total}
              limit={limit}
              noun="questions"
              onPageChange={changePage}
              // A new page size starts again at the first question
              onLimitChange={(n) => { setLimit(n); changePage(1); }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
