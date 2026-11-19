"use client";
import React from "react";

// Edit conflict warning for the docs editors, styled like the blog editor's banner
export default function ConflictBanner(props: {
  what: string;
  by: { email?: string; at?: string | Date } | null;
  busy: boolean;
  onReload: () => void;
  onOverwrite: () => void;
}) {
  const { what, by, busy, onReload, onOverwrite } = props;
  const when = by?.at ? new Date(by.at) : null;

  return (
    <div role="alert" className="mb-6 space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 sm:p-5">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Changed somewhere else</h3>
        <p className="text-xs leading-relaxed text-amber-300/90">
          This {what} was saved by <strong className="font-medium text-white">{by?.email || "another admin or tab"}</strong>
          {when && (
            <>
              {" "}on{" "}
              <strong className="font-medium text-white">
                {when.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </strong>
            </>
          )}
          {" "}after you opened it. Auto save is paused so neither version is lost.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-amber-500/20 pt-3">
        <button
          type="button"
          disabled={busy}
          // Confirm first: reloading drops the edits in this tab
          onClick={() => window.confirm("Discard your changes in this tab and load the latest saved version?") && onReload()}
          className="cursor-pointer rounded-lg border border-neutral-700 bg-[#18181b] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          Reload Latest Version
        </button>
        <button
          type="button"
          disabled={busy}
          // Confirm first: overwriting replaces the other save with this tab's version
          onClick={() => window.confirm("Replace the other saved version with yours?") && onOverwrite()}
          className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-50 sm:ml-auto"
        >
          Keep My Version
        </button>
      </div>
    </div>
  );
}
