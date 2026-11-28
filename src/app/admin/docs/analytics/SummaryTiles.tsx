import React from "react";
import { percent, type AnalyticsOverview } from "@/lib/docs-analytics-core";
import { plural } from "./format";

// Green share for up votes, red for down, so the split reads at a glance without a legend
function SplitMeter({ up, down }: { up: number; down: number }) {
  const total = up + down;
  if (total === 0) return <div className="h-1.5 rounded-full bg-[#27272a]" aria-hidden />;
  return (
    <div className="flex h-1.5 overflow-hidden rounded-full bg-[#27272a]" aria-hidden>
      <div className="bg-emerald-400" style={{ width: `${(up / total) * 100}%` }} />
      <div className="bg-red-400" style={{ width: `${(down / total) * 100}%` }} />
    </div>
  );
}

function Stat({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 bg-[#18181b] p-4 sm:p-5">
      <dt className="text-sm text-neutral-400">{label}</dt>
      {/* A step smaller on phones so "No ratings" fits half the screen width */}
      <dd className="text-2xl font-semibold tracking-tight text-white tabular-nums sm:text-3xl">{value}</dd>
      {children && <dd className="flex flex-col gap-2 text-xs text-neutral-500">{children}</dd>}
    </div>
  );
}

const votes = (up: number, down: number) => `${up} up, ${down} down`;

// The four headline numbers in one band: two vote shares with their split, chats, and questions
export function SummaryTiles({ summary }: { summary: AnalyticsOverview["summary"] }) {
  const { pageVotes, chats, questions, answerRatings } = summary;
  const pageShare = percent(pageVotes.up, pageVotes.down);
  const answerShare = percent(answerRatings.up, answerRatings.down);

  return (
    // One band with 1px dividers (the gap shows the border colour) instead of four boxes: 2 by 2 until wide screens
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#27272a] bg-[#27272a] lg:grid-cols-4">
      <Stat label="Pages rated helpful" value={pageShare === null ? "No votes" : `${pageShare}%`}>
        <SplitMeter up={pageVotes.up} down={pageVotes.down} />
        {pageShare !== null && <span>{votes(pageVotes.up, pageVotes.down)}</span>}
      </Stat>
      <Stat label="AI answers rated good" value={answerShare === null ? "No ratings" : `${answerShare}%`}>
        <SplitMeter up={answerRatings.up} down={answerRatings.down} />
        {answerShare !== null && <span>{votes(answerRatings.up, answerRatings.down)}</span>}
      </Stat>
      <Stat label="AI chats" value={String(chats)}>
        <span>{chats ? plural(chats, "conversation") : "No conversations yet"}</span>
      </Stat>
      <Stat label="Questions asked" value={String(questions)}>
        {/* No average when there are no chats to divide by */}
        <span>{chats ? `${(questions / chats).toFixed(1)} per chat on average` : "No questions yet"}</span>
      </Stat>
    </dl>
  );
}
