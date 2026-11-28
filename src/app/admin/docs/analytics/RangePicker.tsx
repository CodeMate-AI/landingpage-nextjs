"use client";

import React, { useState } from "react";
import { RANGE_PRESETS, type RangePreset } from "@/lib/docs-analytics-core";
import { dateBounds, type RangeState } from "./rangeParams";
import { segment, segmentOff, segmentOn } from "./format";

const PRESETS = Object.keys(RANGE_PRESETS) as RangePreset[];
const dateInput =
  "min-h-11 w-full rounded-lg border border-[#27272a] bg-[#09090b] px-3 text-sm text-white [color-scheme:dark] focus:border-blue-500 focus:outline-none sm:min-h-9 sm:w-auto";

// One segmented control for the presets plus "Custom", which opens a date pair applied together so a half-picked range never loads
export function RangePicker({ value, onChange }: { value: RangeState; onChange: (next: RangeState) => void }) {
  const custom = Boolean(value.from && value.to);
  const [open, setOpen] = useState(custom);
  const [from, setFrom] = useState(value.from ?? "");
  const [to, setTo] = useState(value.to ?? "");
  // Fixed for this page view so the inputs' limits do not change while the admin picks
  const [bounds] = useState(() => dateBounds(new Date()));
  const canApply = Boolean(from && to && from <= to);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
      <div role="group" aria-label="Date range" className="grid w-full grid-cols-5 overflow-hidden rounded-lg border border-[#27272a] bg-[#18181b] p-0.5 sm:inline-grid sm:w-auto">
        {PRESETS.map((p) => {
          const on = !custom && !open && value.range === p;
          return (
            <button key={p} type="button" aria-pressed={on} onClick={() => { setOpen(false); onChange({ range: p }); }} className={`${segment} rounded-md ${on ? segmentOn : segmentOff}`}>
              {p}
            </button>
          );
        })}
        <button type="button" aria-expanded={open} aria-controls="analytics-custom" onClick={() => setOpen((v) => !v)} className={`${segment} rounded-md ${custom || open ? segmentOn : segmentOff}`}>
          Custom
        </button>
      </div>

      {open && (
        <form
          id="analytics-custom"
          className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (canApply) onChange({ from, to });
          }}
        >
          <label className="flex flex-col gap-1 text-xs text-neutral-400 sm:flex-row sm:items-center sm:gap-2">
            From
            <input type="date" value={from} min={bounds.min} max={bounds.max} onChange={(e) => setFrom(e.target.value)} className={dateInput} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-neutral-400 sm:flex-row sm:items-center sm:gap-2">
            To
            <input type="date" value={to} min={from || bounds.min} max={bounds.max} onChange={(e) => setTo(e.target.value)} className={dateInput} />
          </label>
          <button
            type="submit"
            disabled={!canApply}
            className="col-span-2 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-9"
          >
            Apply dates
          </button>
        </form>
      )}
    </div>
  );
}
