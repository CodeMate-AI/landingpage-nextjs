"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, Bot, SquarePen, TriangleAlert, X } from "lucide-react";
import { useAsk } from "./context";
import { AskInput } from "./Input";
import { AssistantMessage, Thinking, UserMessage } from "./Message";

const STARTERS = ["What is CodeMate AI?", "How do I deploy an app with Build?", "How do I install CORA-CLI?"];

export function AskPanel() {
  const { open, setOpen, chat, ask, clear, retry, stopped, busy } = useAsk();
  const { messages, status, error } = chat;
  const listRef = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  // Stay mounted until the close animation ends
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Follow the answer while it streams, unless the reader scrolled up
  useEffect(() => {
    const el = listRef.current;
    if (el && follow.current) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  if (!mounted) return null;
  const last = messages.at(-1);
  // Once the assistant message exists it shows its own Thinking row, so only cover the gap before it
  const waiting = busy && last?.role === "user";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] md:left-auto md:w-[26rem]"
      data-state={open ? "open" : "closed"}
      onAnimationEnd={(e) => {
        if (!open && (e.target as HTMLElement).classList.contains("docs-ask-panel")) setMounted(false);
      }}
    >
      <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="docs-ask-backdrop absolute inset-0 bg-black/40 md:hidden" />
      <section
        role="dialog"
        aria-label="Ask AI"
        className="docs-ask-panel absolute inset-x-3 bottom-3 top-14 flex flex-col overflow-hidden rounded-2xl border border-fd-border bg-fd-popover text-fd-popover-foreground shadow-2xl md:inset-x-0 md:bottom-0 md:top-0 md:rounded-none md:border-y-0 md:border-r-0"
      >
        <header className="flex items-center gap-2 border-b border-fd-border px-3 py-2.5">
          <Bot className="size-4 text-fd-primary" aria-hidden />
          <h2 className="flex-1 text-sm font-semibold">Ask AI</h2>
          <button
            type="button"
            onClick={clear}
            disabled={messages.length === 0}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fd-muted-foreground hover:bg-fd-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <SquarePen className="size-3.5" aria-hidden /> New chat
          </button>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-md p-1.5 text-fd-muted-foreground hover:bg-fd-accent">
            <X className="size-4" />
          </button>
        </header>

        <div
          ref={listRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
          }}
          className="docs-ask-list flex flex-1 flex-col gap-4 overflow-y-auto p-3"
        >
          {messages.length === 0 && (
            <div className="my-auto flex flex-col gap-2">
              <p className="text-sm text-fd-muted-foreground">Ask anything about CodeMate AI. Answers come from these docs.</p>
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => ask(s)} className="rounded-lg border border-fd-border px-3 py-2 text-start text-sm hover:bg-fd-accent">
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <UserMessage key={m.id} message={m} />
            ) : (
              <AssistantMessage key={m.id} message={m} streaming={busy && i === messages.length - 1} />
            )
          )}
          {waiting && <Thinking />}
          {stopped && !busy && <p className="text-xs text-fd-muted-foreground">Stopped</p>}
          {error && !busy && (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-500">
              <TriangleAlert className="size-4 shrink-0" aria-hidden /> {errorText(error)}
            </p>
          )}
          {!busy && messages.length > 0 && (error || stopped) && (
            <div className="flex gap-2">
              <button type="button" onClick={retry} className="flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs text-fd-muted-foreground hover:bg-fd-accent">
                <RotateCcw className="size-3.5" aria-hidden /> Retry
              </button>
              {error && (
                <button type="button" onClick={clear} className="flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs text-fd-muted-foreground hover:bg-fd-accent">
                  New chat
                </button>
              )}
            </div>
          )}
        </div>
        <AskInput focusSignal={open} />
      </section>
    </div>,
    document.body
  );
}

// The API answers config, rate-limit and validation errors with `{ "error": "..." }` JSON
function errorText(error: Error) {
  try {
    const parsed = JSON.parse(error.message) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {}
  return error.message.length < 160 ? error.message : "Something went wrong. Please try again.";
}
