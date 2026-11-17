"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { getVisitorId, sendVote } from "./ask-ai/context";

// Votes are kept per page in memory; the server keeps one vote per visitor and page (toggle off sends 0)
export function PageFeedback({ slug }: { slug: string }) {
  const [vote, setVote] = useState<1 | -1 | 0>(0);
  const choose = (v: 1 | -1) => {
    const next = vote === v ? 0 : v;
    setVote(next);
    sendVote("/api/feedback/page", { page: slug, vote: next, visitorId: getVisitorId() });
  };
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-fd-border pt-4 text-sm text-fd-muted-foreground">
      <span>Was this page helpful?</span>
      {([1, -1] as const).map((v) => {
        const Icon = v === 1 ? ThumbsUp : ThumbsDown;
        return (
          <button
            key={v}
            type="button"
            onClick={() => choose(v)}
            aria-pressed={vote === v}
            aria-label={v === 1 ? "Yes, helpful" : "No, not helpful"}
            className={`rounded-full border border-fd-border p-2 hover:bg-fd-accent ${vote === v ? "bg-fd-accent text-fd-foreground" : ""}`}
          >
            <Icon className={`size-4 ${vote === v ? "fill-current" : ""}`} />
          </button>
        );
      })}
      {vote !== 0 && <span>Thanks for the feedback</span>}
    </div>
  );
}
