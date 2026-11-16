"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { Sparkles, X, Send, Square, ThumbsUp, ThumbsDown } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string; eventId?: string; rating?: "up" | "down"; failed?: boolean };

const STARTERS = ["What is CodeMate?", "How do I deploy an app with Build?", "How do I install CORA-CLI?"];

function renderMarkdown(src: string) {
  // Answers are text; no images (a remote image would be a tracking pixel) or embedded elements
  return DOMPurify.sanitize(marked.parse(src, { async: false }) as string, { FORBID_TAGS: ["img", "svg", "style", "form", "input"] });
}

export function AskAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const page = pathname.startsWith("/docs/") ? pathname.slice(6).split("/")[0] : undefined;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;
      const history: Msg[] = [...messages.filter((m) => !m.failed), { role: "user", content: question }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const patch = (p: Partial<Msg>) => setMessages((all) => all.map((m, i) => (i === all.length - 1 ? { ...m, ...p } : m)));
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-12).map(({ role, content }) => ({ role, content })), page }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => null);
          patch({ content: err?.error ?? "Something went wrong. Please try again.", failed: true });
          return;
        }
        patch({ eventId: res.headers.get("x-docs-event") || undefined });
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          patch({ content: acc });
        }
        if (!acc.trim()) patch({ content: "I could not find an answer. Please try rephrasing.", failed: true });
      } catch (error) {
        if ((error as Error).name !== "AbortError") patch({ content: "Connection lost. Please try again.", failed: true });
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, messages, page]
  );

  const rate = (index: number, rating: "up" | "down") => {
    const m = messages[index];
    if (!m.eventId || m.rating) return;
    setMessages((all) => all.map((x, i) => (i === index ? { ...x, rating } : x)));
    fetch("/api/ask/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.eventId, rating }),
    }).catch(() => {});
  };

  const onAnswerClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    const href = a?.getAttribute("href");
    if (!a || !href) return;
    e.preventDefault();
    if (!href.startsWith("/docs")) {
      // Anything else opens in a new tab without leaking the opener, and never a javascript: url
      if (/^https?:\/\//i.test(href)) window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(href);
    if (window.matchMedia("(max-width: 767px)").matches) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ms-auto inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-fd-border bg-fd-secondary/50 px-2 py-1 text-xs font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        aria-label="Ask AI"
      >
        <Sparkles className="size-4" aria-hidden />
        <span>Ask AI</span>
      </button>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[60] md:left-auto" role="dialog" aria-modal="true" aria-label="Ask AI">
          <button type="button" className="absolute inset-0 bg-black/40 md:hidden" aria-label="Close Ask AI" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 flex flex-col bg-fd-background md:left-auto md:w-[26rem] md:border-l md:border-fd-border md:shadow-2xl">
            <div className="flex items-center justify-between border-b border-fd-border px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4" aria-hidden /> Ask AI
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1.5 text-fd-muted-foreground hover:bg-fd-accent" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-fd-muted-foreground">Ask anything about CodeMate. Answers come from these docs.</p>
                  <div className="flex flex-col items-start gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-lg border border-fd-border px-3 py-1.5 text-left text-sm hover:bg-fd-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="ml-8 whitespace-pre-wrap break-words rounded-xl bg-fd-secondary px-3 py-2 text-sm">
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="text-sm">
                    {m.content ? (
                      <div
                        className={`docs-ask-answer prose prose-sm max-w-none ${m.failed ? "text-fd-muted-foreground" : ""}`}
                        onClick={onAnswerClick}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                      />
                    ) : (
                      <span className="text-fd-muted-foreground">Searching the docs...</span>
                    )}
                    {!m.failed && m.eventId && !(busy && i === messages.length - 1) && (
                      <div className="mt-2 flex gap-1 text-fd-muted-foreground">
                        <button type="button" onClick={() => rate(i, "up")} disabled={!!m.rating} aria-label="Helpful" className={`rounded p-1 hover:bg-fd-accent ${m.rating === "up" ? "text-fd-foreground" : ""}`}>
                          <ThumbsUp className="size-3.5" />
                        </button>
                        <button type="button" onClick={() => rate(i, "down")} disabled={!!m.rating} aria-label="Not helpful" className={`rounded p-1 hover:bg-fd-accent ${m.rating === "down" ? "text-fd-foreground" : ""}`}>
                          <ThumbsDown className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <form
              className="border-t border-fd-border p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  maxLength={500}
                  rows={2}
                  placeholder="Ask a question"
                  className="min-h-[2.75rem] flex-1 resize-none rounded-lg border border-fd-border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                />
                {busy ? (
                  <button type="button" onClick={() => abortRef.current?.abort()} className="rounded-lg border border-fd-border p-2.5 hover:bg-fd-accent" aria-label="Stop">
                    <Square className="size-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={!input.trim()} className="rounded-lg bg-fd-primary p-2.5 text-fd-primary-foreground disabled:opacity-40" aria-label="Send">
                    <Send className="size-4" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-fd-muted-foreground">AI answers can be wrong. Questions and answers are stored for 90 days.</p>
            </form>
          </div>
        </div>,
        document.body
        )}
    </>
  );
}
