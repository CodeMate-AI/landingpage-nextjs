"use client";

import React, { useState } from "react";
import type { Bucket, SeriesPoint } from "@/lib/docs-analytics-core";
import { card, panelTitle, plural } from "./format";

// Four even steps up to a round top, so gridline values read as whole numbers (0, 1, 2, 3, 4 or 0, 5, 10, 15, 20)
function axisTop(max: number) {
  const step = Math.max(1, Math.ceil(max / 4));
  return { step, top: step * 4 };
}

// Questions per day (or per hour for short ranges) as bars on a labelled axis, with a table view of the same numbers
export function QuestionsChart({ series, bucket, tz }: { series: SeriesPoint[]; bucket: Bucket; tz: string }) {
  const [asTable, setAsTable] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const hourly = bucket === "hour";
  const unit = hourly ? "hour" : "day";
  // Labels in the same time zone the server used to cut the buckets, on a 12-hour clock; hourly ticks drop the ":00" to stay short
  const full = new Intl.DateTimeFormat("en-GB", hourly ? { timeZone: tz, day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true } : { timeZone: tz, day: "numeric", month: "short" });
  const tick = new Intl.DateTimeFormat("en-GB", hourly ? { timeZone: tz, hour: "numeric", hour12: true } : { timeZone: tz, day: "numeric", month: "short" });
  const total = series.reduce((sum, p) => sum + p.questions, 0);
  const { step, top } = axisTop(Math.max(0, ...series.map((p) => p.questions)));
  // About five axis labels whatever the range, so 90 days never crowd a phone-width axis; the newest bucket is always
  // labelled, and a regular label closer to it than one stride is dropped so the two never touch
  const stride = Math.max(1, Math.ceil(series.length / 5));
  const shown = (i: number) => i === series.length - 1 || (i % stride === 0 && series.length - 1 - i >= stride);
  const point = active === null ? null : series[active];

  return (
    <section className={`${card} p-4 sm:p-5`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={panelTitle}>Questions per {unit}</h2>
          {/* The readout follows the pointer, and shows the range total otherwise */}
          <p className="mt-1 text-sm text-neutral-400 tabular-nums" aria-live="polite">
            {point ? <><span className="text-white">{full.format(new Date(point.start))}</span>: {plural(point.questions, "question")}</> : `${plural(total, "question")} in this range`}
          </p>
        </div>
        {/* Nothing to tabulate in an empty range, so the toggle only shows with data */}
        {total > 0 && <button type="button" onClick={() => setAsTable((v) => !v)} className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-[#27272a] px-3 text-sm text-neutral-300 transition hover:bg-[#27272a] hover:text-white active:scale-[0.98] sm:min-h-9">
          {asTable ? "Show chart" : "Show table"}
        </button>}
      </div>

      {total === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-400">No questions were asked in this range.</p>
      ) : asTable ? (
        <SeriesTable series={series} hourly={hourly} tz={tz} total={total} />
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-x-3">
          {/* Y axis: the gridline values, top to bottom */}
          <div className="flex h-48 flex-col justify-between text-right text-xs text-neutral-500 tabular-nums sm:h-56" aria-hidden>
            {[4, 3, 2, 1, 0].map((k) => <span key={k} className="-my-2 leading-4">{k * step}</span>)}
          </div>
          <div
            role="img"
            aria-label={`Questions per ${unit}, ${series.length} ${unit}s, ${total} in total. Use Show table for each value.`}
            onPointerLeave={() => setActive(null)}
            className="relative flex h-48 items-end gap-0.5 border-b border-neutral-600 sm:h-56 sm:gap-1"
          >
            {/* Gridlines behind the bars, one per axis value above zero */}
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#27272a]" style={{ bottom: `${(k / 4) * 100}%` }} aria-hidden />
            ))}
            {series.map((p, i) => (
              // Each slot is the full height so the pointer can land on short bars too
              <div key={p.start} title={`${full.format(new Date(p.start))}: ${plural(p.questions, "question")}`} onPointerEnter={() => setActive(i)} className="relative flex h-full min-w-0 flex-1 cursor-default items-end justify-center">
                <div
                  className={`w-full max-w-9 rounded-t-[3px] transition-colors ${p.questions === 0 ? "bg-neutral-700" : active === i ? "bg-blue-400" : "bg-blue-500"}`}
                  style={{ height: p.questions === 0 ? 2 : `${(p.questions / top) * 100}%` }}
                />
              </div>
            ))}
          </div>
          {/* X axis: a label under every few bars, aligned to the same slots */}
          <div aria-hidden />
          <div className="mt-2 flex h-4 gap-0.5 text-xs text-neutral-500 sm:gap-1" aria-hidden>
            {series.map((p, i) => (
              <div key={p.start} className="relative flex min-w-0 flex-1 justify-center">
                {/* Edge labels hug the plot's edges so they never spill past it; the newest is brighter */}
                {shown(i) && <span className={`absolute whitespace-nowrap ${i === series.length - 1 ? "right-0 text-neutral-300" : i === 0 ? "left-0" : ""}`}>{tick.format(new Date(p.start))}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// The chart's numbers as a table: newest first, each row with a bar sized to its count and its share of the range
function SeriesTable({ series, hourly, tz, total }: { series: SeriesPoint[]; hourly: boolean; tz: string; total: number }) {
  // Hour rows lead with the 12-hour time and day rows with the weekday; the dimmer part gives context
  const main = new Intl.DateTimeFormat("en-GB", hourly ? { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true } : { timeZone: tz, day: "numeric", month: "short" });
  const context = new Intl.DateTimeFormat("en-GB", hourly ? { timeZone: tz, day: "numeric", month: "short" } : { timeZone: tz, weekday: "short" });
  const max = Math.max(...series.map((p) => p.questions));
  const rows = [...series].reverse();
  const cell = "px-3 py-2.5 sm:px-4";

  return (
    // Thin dark scrollbar so the list blends with the panel instead of showing the system's light one
    <div className="max-h-96 overflow-y-auto rounded-lg border border-[#27272a] [scrollbar-color:#3f3f46_transparent] [scrollbar-width:thin]">
      <table className="w-full border-separate border-spacing-0 text-left text-sm tabular-nums">
        <thead className="sticky top-0 z-10 bg-[#18181b] text-xs text-neutral-500">
          <tr>
            <th scope="col" className={`${cell} border-b border-[#27272a] font-medium`}>{hourly ? "Hour" : "Day"}</th>
            <th scope="col" className={`${cell} w-full border-b border-[#27272a] font-medium`}>Questions</th>
            <th scope="col" className={`${cell} hidden border-b border-[#27272a] text-right font-medium sm:table-cell`}>Share</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const date = new Date(p.start);
            const empty = p.questions === 0;
            const busiest = !empty && p.questions === max;
            return (
              <tr key={p.start} className="transition-colors hover:bg-[#27272a]/40">
                <td className={`${cell} border-b border-[#27272a]/60 whitespace-nowrap`}>
                  <span className={empty ? "text-neutral-500" : "text-neutral-200"}>{main.format(date)}</span>
                  <span className="ml-2 text-xs text-neutral-500">{context.format(date)}</span>
                </td>
                <td className={`${cell} border-b border-[#27272a]/60`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-8 shrink-0 text-right font-medium ${empty ? "text-neutral-600" : "text-white"}`}>{p.questions}</span>
                    {/* Bar length is the row's count against the busiest bucket */}
                    <div className="h-2 min-w-12 flex-1 overflow-hidden rounded-full bg-[#27272a]/60" aria-hidden>
                      <div className={`h-full rounded-full ${busiest ? "bg-blue-400" : "bg-blue-500/70"}`} style={{ width: `${(p.questions / max) * 100}%` }} />
                    </div>
                    {busiest && <span className="shrink-0 rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[11px] font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">Busiest</span>}
                  </div>
                </td>
                <td className={`${cell} hidden border-b border-[#27272a]/60 text-right text-neutral-400 sm:table-cell`}>{empty ? "-" : `${Math.round((p.questions / total) * 100)}%`}</td>
              </tr>
            );
          })}
        </tbody>
        {/* The total stays in view at the bottom while the rows scroll */}
        <tfoot className="sticky bottom-0 bg-[#18181b] text-sm">
          <tr>
            <th scope="row" className={`${cell} border-t border-[#27272a] font-medium text-neutral-300`}>Total</th>
            <td className={`${cell} border-t border-[#27272a]`}><span className="inline-block w-8 text-right font-semibold text-white">{total}</span></td>
            <td className={`${cell} hidden border-t border-[#27272a] text-right text-neutral-400 sm:table-cell`}>100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
