"use client";
import React from "react";

export type SaveStatus = "empty" | "dirty" | "blocked" | "saving" | "saved";

const STATUS: Record<SaveStatus, { dot: string; text: string }> = {
  empty: { dot: "bg-neutral-600", text: "Nothing to save yet" },
  dirty: { dot: "bg-amber-400", text: "Unsaved changes" },
  // Edited, but auto save cannot run yet (a docs page needs a title and URL first)
  blocked: { dot: "bg-amber-400", text: "Add a title and URL to save" },
  saving: { dot: "bg-blue-400 animate-pulse", text: "Saving..." },
  saved: { dot: "bg-emerald-500", text: "All changes saved" },
};

// One line under each editor title: save status, then the shared Auto save switch (same look in all three editors)
export default function AutoSaveToggle({ status, on, onChange }: { status: SaveStatus; on: boolean; onChange: (on: boolean) => void }) {
  const s = STATUS[status];
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
      <p role="status" className="flex items-center gap-2">
        <span aria-hidden="true" className={`size-2 rounded-full ${s.dot}`} />
        {s.text}
      </p>
      <span aria-hidden="true" className="h-3 w-px bg-[#27272a]" />
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        title={on ? "Drafts save automatically while you edit" : "Drafts save only when you click Save"}
        className="group flex cursor-pointer items-center gap-2 rounded-md py-1 transition-colors hover:text-neutral-200"
      >
        <span>Auto save</span>
        {/* Small track and knob; blue when on */}
        <span aria-hidden="true" className={`relative h-4 w-7 rounded-full transition-colors ${on ? "bg-blue-600" : "bg-[#3f3f46] group-hover:bg-[#52525b]"}`}>
          <span className={`absolute top-0.5 size-3 rounded-full bg-white shadow transition-all ${on ? "left-[14px]" : "left-0.5"}`} />
        </span>
        <span className={`w-5 text-left font-medium ${on ? "text-blue-400" : "text-neutral-500"}`}>{on ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
