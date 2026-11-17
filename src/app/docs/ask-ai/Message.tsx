"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, FileText, Loader2, Search, ThumbsDown, ThumbsUp, TriangleAlert } from "lucide-react";
import { AnswerMarkdown } from "./Markdown";
import { useAsk, type AskMessage } from "./context";

interface ToolPart {
  type: string;
  toolCallId: string;
  state: string;
  input?: { query?: string; path?: string };
  output?: { results?: unknown[]; title?: string; url?: string; error?: string };
  errorText?: string;
}

function toolParts(message: AskMessage): ToolPart[] {
  return message.parts.filter((p) => p.type.startsWith("tool-") && "toolCallId" in p) as unknown as ToolPart[];
}

function ToolRow({ part }: { part: ToolPart }) {
  const name = part.type.slice(5);
  const failed = part.state === "output-error" || part.state === "output-denied" || !!part.output?.error;
  const done = part.state === "output-available" && !failed;

  let label: ReactNode;
  if (name === "search_docs") {
    const n = part.output?.results?.length ?? 0;
    label = done ? (
      <>
        Searched <q>{part.input?.query}</q>, {n} {n === 1 ? "page" : "pages"}
      </>
    ) : (
      <>
        Searching <q>{part.input?.query ?? "..."}</q>
      </>
    );
  } else if (name === "read_page") {
    label = (
      <>
        {done ? "Read" : "Reading"} <code>{part.output?.title ?? part.input?.path ?? "..."}</code>
      </>
    );
  } else {
    label = name;
  }

  const Icon = name === "read_page" ? FileText : Search;
  return (
    <div className="docs-ask-tool flex min-w-0 items-center gap-2 rounded-lg border border-fd-border bg-fd-secondary/60 px-2 py-1.5 text-xs text-fd-muted-foreground">
      {failed ? (
        <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
      ) : done ? (
        <Icon className="size-3.5 shrink-0" aria-hidden />
      ) : (
        <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
      )}
      <span className={`truncate ${done || failed ? "" : "docs-ask-shimmer"}`}>{failed ? "That step failed" : label}</span>
      {done && <Check className="ms-auto size-3.5 shrink-0 text-fd-primary" aria-hidden />}
    </div>
  );
}

/** Shown before the first step arrives, and between steps while no answer text exists yet */
export function Thinking() {
  return (
    <div className="docs-ask-tool flex items-center gap-2 text-xs text-fd-muted-foreground" role="status">
      <span className="docs-ask-shimmer">Thinking</span>
      <span className="docs-ask-dots" aria-hidden>
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function Feedback({ message }: { message: AskMessage }) {
  const { votes, vote } = useAsk();
  const current = votes[message.id] ?? 0;
  if (!message.metadata?.eventId) return null;
  return (
    <div className="mt-1 flex items-center gap-0.5 text-fd-muted-foreground">
      {([1, -1] as const).map((v) => {
        const Icon = v === 1 ? ThumbsUp : ThumbsDown;
        const active = current === v;
        return (
          <button
            key={v}
            type="button"
            aria-label={v === 1 ? "Good answer" : "Bad answer"}
            aria-pressed={active}
            onClick={() => vote(message, active ? 0 : v)}
            className={`rounded-full p-1.5 transition-colors hover:bg-fd-accent ${active ? "text-fd-foreground" : ""}`}
          >
            <Icon className={`size-3.5 ${active ? "fill-current" : ""}`} />
          </button>
        );
      })}
      {current !== 0 && <span className="ms-1 text-xs">Thanks for the feedback</span>}
    </div>
  );
}

export function AssistantMessage({ message, streaming }: { message: AskMessage; streaming: boolean }) {
  const router = useRouter();
  const { setOpen } = useAsk();
  const tools = toolParts(message);
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

  // Links in answers: docs pages navigate in-app, anything else opens in a new tab without an opener
  const onLink = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!a || !href) return;
    e.preventDefault();
    if (href.startsWith("/docs")) {
      router.push(href);
      if (window.matchMedia("(max-width: 767px)").matches) setOpen(false);
    } else if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const showSteps = tools.length > 0;
  const collapsed = !streaming && text.length > 0 && showSteps;
  const searches = tools.filter((t) => t.type === "tool-search_docs").length;
  const reads = tools.filter((t) => t.type === "tool-read_page").length;

  return (
    <div className="text-sm">
      {showSteps &&
        (collapsed ? (
          <details className="docs-ask-steps mb-2 text-xs text-fd-muted-foreground">
            <summary className="flex cursor-pointer list-none items-center gap-1 py-0.5 hover:text-fd-foreground">
              <ChevronRight className="docs-ask-chevron size-3.5" aria-hidden />
              Searched the docs
              {searches > 1 ? `, ${searches} searches` : ""}
              {reads ? `, read ${reads} ${reads === 1 ? "page" : "pages"}` : ""}
            </summary>
            <div className="mt-1 flex flex-col gap-1">
              {tools.map((t) => (
                <ToolRow key={t.toolCallId} part={t} />
              ))}
            </div>
          </details>
        ) : (
          <div className="mb-2 flex flex-col gap-1">
            {tools.map((t) => (
              <ToolRow key={t.toolCallId} part={t} />
            ))}
          </div>
        ))}
      {streaming && !text && tools.every((t) => t.state === "output-available") && <Thinking />}
      {text && <AnswerMarkdown text={text} onClick={onLink} />}
      {!streaming && text && <Feedback message={message} />}
    </div>
  );
}

export function UserMessage({ message }: { message: AskMessage }) {
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  return <div className="ml-8 whitespace-pre-wrap break-words rounded-xl bg-fd-secondary px-3 py-2 text-sm">{text}</div>;
}
