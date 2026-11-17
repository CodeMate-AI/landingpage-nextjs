"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

export type AskMessage = UIMessage<{ eventId?: string }>;
export type Vote = 1 | -1 | 0;

interface AskContext {
  chat: UseChatHelpers<AskMessage>;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** open the panel and send `text` (ignored while an answer is streaming) */
  ask: (text: string) => void;
  stop: () => void;
  retry: () => void;
  clear: () => void;
  stopped: boolean;
  votes: Record<string, Vote>;
  vote: (message: AskMessage, value: Vote) => void;
  busy: boolean;
}

const Ctx = createContext<AskContext | null>(null);

export function useAsk() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAsk must be used inside <AskProvider>");
  return c;
}

const randomId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// Anonymous id so a visitor can change their own votes. Falls back to memory when storage is blocked.
let memoryVisitor: string | undefined;
export function getVisitorId() {
  try {
    let id = localStorage.getItem("docs-visitor-id");
    if (!id) localStorage.setItem("docs-visitor-id", (id = randomId()));
    return id;
  } catch {
    return (memoryVisitor ??= randomId());
  }
}

function sendVote(url: string, body: Record<string, unknown>) {
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => {});
}
export { sendVote };

// One provider per page, so request context lives at module level (mutated outside render)
const live: { page?: string; thread: string | null } = { thread: null };

export function AskProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [stopped, setStopped] = useState(false);
  const pathname = usePathname();
  const page = pathname.startsWith("/docs/") ? pathname.slice(6).split("/")[0] : undefined;

  // The transport reads these when a request is sent, not when it is created

  useEffect(() => {
    live.page = page;
  }, [page]);

  const [transport] = useState(
    () =>
      new DefaultChatTransport<AskMessage>({
        api: "/api/ask",
        // Send only the newest messages and only their text; the server ignores everything else anyway
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: {
            ...body,
            messages: messages.slice(-30).map((m) => ({ role: m.role, parts: m.parts.filter((p) => p.type === "text") })),
          },
        }),
        body: () => ({ page: live.page, threadId: (live.thread ??= randomId()), visitorId: getVisitorId() }),
      })
  );
  const chat = useChat<AskMessage>({ id: "docs-ask", transport });
  const { sendMessage, regenerate, setMessages, clearError, status } = chat;
  const stopChat = chat.stop;
  const busy = status === "submitted" || status === "streaming";

  const ask = useCallback(
    (text: string) => {
      const q = text.trim();
      setOpen(true);
      if (!q || busy) return;
      setStopped(false);
      void sendMessage({ text: q });
    },
    [busy, sendMessage]
  );
  const stop = useCallback(() => {
    stopChat();
    setStopped(true);
  }, [stopChat]);
  const retry = useCallback(() => {
    setStopped(false);
    void regenerate();
  }, [regenerate]);
  const clear = useCallback(() => {
    stopChat();
    setMessages([]);
    clearError();
    setVotes({});
    setStopped(false);
    live.thread = null;
  }, [stopChat, setMessages, clearError]);
  const vote = useCallback((message: AskMessage, value: Vote) => {
    setVotes((v) => ({ ...v, [message.id]: value }));
    const id = message.metadata?.eventId;
    if (id) sendVote("/api/ask/feedback", { id, vote: value, visitorId: getVisitorId() });
  }, []);

  // Cmd/Ctrl+I opens and closes the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== "i") return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;
      e.preventDefault();
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ chat, open, setOpen, ask, stop, retry, clear, stopped, votes, vote, busy }),
    [chat, open, ask, stop, retry, clear, stopped, votes, vote, busy]
  );
  return <Ctx value={value}>{children}</Ctx>;
}
