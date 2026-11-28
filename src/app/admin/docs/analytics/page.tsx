"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch, clearAdminToken } from "@/lib/admin-api-client";
import type { AnalyticsOverview, RangePreset } from "@/lib/docs-analytics-core";
import { RangePicker } from "./RangePicker";
import { rangeQuery, readRange, withRange, type RangeState } from "./rangeParams";
import { useAnalyticsFetch } from "./useAnalyticsFetch";
import { SummaryTiles } from "./SummaryTiles";
import { QuestionsChart } from "./QuestionsChart";
import { PageFeedback } from "./PageFeedback";
import { DownvotedAnswers } from "./DownvotedAnswers";
import { ChatsTable } from "./ChatsTable";
import { formatDay } from "./format";

const btn =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-[#27272a] px-4 text-sm transition-colors hover:bg-[#18181b] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer sm:min-h-10";
const PRESET_NAMES: Record<RangePreset, string> = { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" };

// The range in words for the page heading, e.g. "Last 7 days" with "19 Nov to 26 Nov" once the server has resolved it
function RangeHeading({ range, resolved }: { range: RangeState; resolved?: AnalyticsOverview["range"] }) {
  const name = range.from ? "Custom range" : PRESET_NAMES[range.range ?? "7d"];
  // The server's end is exclusive, so the last day shown is the one just before it
  const span = resolved ? `${formatDay(resolved.from)} to ${formatDay(new Date(new Date(resolved.to).getTime() - 1).toISOString())}` : "";
  return (
    <div className="min-w-0">
      <h2 className="text-xl font-semibold text-white">{name}</h2>
      <p className="mt-0.5 h-5 text-sm text-neutral-400 tabular-nums">{span}</p>
    </div>
  );
}

// Grey blocks in the shape of the band and chart, so the page does not jump when the numbers arrive
function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-label="Loading analytics">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#27272a] bg-[#27272a] lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3 bg-[#18181b] p-4 sm:p-5">
            <div className="h-4 w-24 rounded bg-[#27272a] motion-safe:animate-pulse" />
            <div className="h-8 w-16 rounded bg-[#27272a] motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-80 rounded-xl border border-[#27272a] bg-[#18181b] motion-safe:animate-pulse" />
    </div>
  );
}

// Docs analytics: page votes, Ask AI chats and answer ratings for a chosen range, kept in the URL
function AnalyticsDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const range = readRange(params);
  // Read once per page view: a new Date on every render would change the URL and refetch forever
  const [{ tz, now }] = useState(() => ({ tz: Intl.DateTimeFormat().resolvedOptions().timeZone, now: new Date() }));
  // The same range query feeds the overview and the chats table, so both always show the same period
  const rangeQs = rangeQuery(range, tz, now);
  const overview = useAnalyticsFetch<AnalyticsOverview>(`/api/admin/docs/analytics?${rangeQs}`);

  // replace, not push: switching ranges should not fill the back button with every range tried
  const changeRange = (next: RangeState) => router.replace(`?${withRange(params, next)}`, { scroll: false });

  const handleLogout = async () => {
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } catch {}
    clearAdminToken();
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-6 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl sm:leading-tight">Docs Analytics</h1>
            <p className="mt-1 text-sm text-neutral-400">How readers rate the docs and what they ask Ask AI. Data is kept for 90 days.</p>
          </div>
          {/* The buttons keep one line beside the title; the subtitle wraps instead */}
          <nav aria-label="Admin" className="flex shrink-0 flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
            <Link href="/admin/docs" className={btn}>Back to Docs</Link>
            <Link href="/admin" className={btn}>Switch</Link>
            <button onClick={handleLogout} className={btn}>Log Out</button>
          </nav>
        </header>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <RangeHeading range={range} resolved={overview.data?.range} />
          {/* Keyed on the range so the date inputs reset when the URL range changes */}
          <RangePicker key={`${range.range}-${range.from}-${range.to}`} value={range} onChange={changeRange} />
        </div>

        {overview.loading ? (
          <OverviewSkeleton />
        ) : overview.error ? (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{overview.error}</span>
            <button onClick={overview.reload} className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-red-500/40 px-3 text-xs hover:bg-red-500/10 sm:min-h-8">Try again</button>
          </div>
        ) : overview.data ? (
          // Numbers first, then the trend, then what needs attention, then the detail lists
          <div className="flex flex-col gap-6">
            <SummaryTiles summary={overview.data.summary} />
            <QuestionsChart series={overview.data.series} bucket={overview.data.range.bucket} tz={tz} />
            {/* Keyed on the range so a new range starts its list again at page 1 */}
            <DownvotedAnswers key={rangeQs} rangeQs={rangeQs} />
            <PageFeedback top={overview.data.topPages} bottom={overview.data.bottomPages} />
            <ChatsTable rangeQs={rangeQs} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

// useSearchParams needs a Suspense boundary in the App Router
export default function AnalyticsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#09090b]" />}>
      <AnalyticsDashboard />
    </Suspense>
  );
}
