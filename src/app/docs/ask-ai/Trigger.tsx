"use client";

import { useSyncExternalStore } from "react";
import { Bot } from "lucide-react";
import { useAsk } from "./context";

const subscribe = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

export function AskTrigger() {
  const { setOpen } = useAsk();
  return (
    <button type="button" onClick={() => setOpen(true)} className="ms-auto flex items-center gap-1.5 rounded-lg border border-fd-border px-2.5 py-1.5 text-xs font-medium hover:bg-fd-accent">
      <Bot className="size-4 text-fd-primary" aria-hidden /> Ask AI
    </button>
  );
}

export function AskBar() {
  const { open, setOpen } = useAsk();
  const mac = useSyncExternalStore(subscribe, isMac, () => false);
  if (open) return null;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-4 left-1/2 z-40 flex w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 items-center gap-2 rounded-full border border-fd-border bg-fd-popover/90 px-4 py-2.5 text-sm text-fd-muted-foreground shadow-lg backdrop-blur hover:text-fd-foreground"
    >
      <Bot className="size-4 text-fd-primary" aria-hidden />
      <span className="flex-1 text-start">Ask a question...</span>
      <kbd className="hidden rounded border border-fd-border px-1.5 text-[11px] sm:block">{mac ? "Cmd" : "Ctrl"} I</kbd>
    </button>
  );
}
