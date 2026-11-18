"use client";

import { ArrowUp, Bot } from "lucide-react";
import { useModKey } from "../components/useMac";
import { useAsk } from "./context";

// Bottom-right on every page: a bar on md and up, a round button on phones. Hidden while the panel is open.
export function AskFloating() {
  const { open, setOpen } = useAsk();
  const mod = useModKey();
  if (open) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 end-5 z-30 hidden min-h-12 w-[min(22rem,calc(100vw-2.5rem))] cursor-pointer items-center gap-2.5 rounded-full border border-fd-border bg-fd-popover py-1.5 ps-4 pe-1.5 text-sm text-fd-muted-foreground shadow-lg transition hover:text-fd-foreground md:flex"
      >
        <Bot className="size-4 shrink-0 text-fd-primary" aria-hidden />
        <span className="flex-1 truncate text-start">
          Ask <span translate="no">CodeMate AI</span>...
        </span>
        <kbd className="rounded border border-fd-border px-1.5 text-[11px]">{mod} I</kbd>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fd-primary text-fd-primary-foreground">
          <ArrowUp className="size-4" aria-hidden />
        </span>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask CodeMate AI"
        className="fixed bottom-5 end-5 z-30 flex size-14 cursor-pointer items-center justify-center rounded-full bg-fd-primary text-fd-primary-foreground shadow-lg md:hidden"
      >
        <Bot className="size-6" aria-hidden />
      </button>
    </>
  );
}
