"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Mic, Send, Square } from "lucide-react";
import { useAsk } from "./context";
import { useVoice } from "./useVoice";

const DRAFT = "docs-ask-draft";
const readDraft = () => {
  try {
    return localStorage.getItem(DRAFT) ?? "";
  } catch {
    return "";
  }
};

export function AskInput({ focusSignal }: { focusSignal: boolean }) {
  const { ask, busy, stop } = useAsk();
  const [text, setText] = useState(readDraft);
  const ref = useRef<HTMLTextAreaElement>(null);
  const base = useRef("");
  const voice = useVoice((t) => setText((base.current ? base.current + " " : "") + t));

  useEffect(() => {
    try {
      if (text) localStorage.setItem(DRAFT, text);
      else localStorage.removeItem(DRAFT);
    } catch {}
  }, [text]);
  useEffect(() => {
    if (focusSignal) ref.current?.focus();
  }, [focusSignal]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (busy || !text.trim()) return;
    voice.stop();
    ask(text);
    setText("");
  };
  const onKey = (e: KeyboardEvent) => {
    // isComposing: Enter confirms an IME candidate, it must not send
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
  };
  const toggleMic = () => {
    if (voice.listening) return voice.stop();
    base.current = text.trim();
    voice.start();
  };

  return (
    <form onSubmit={submit} className="border-t border-fd-border p-3">
      <div className="flex items-end gap-2 rounded-xl border border-fd-border bg-fd-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-fd-ring">
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          maxLength={500}
          aria-label="Ask a question"
          placeholder={voice.listening ? "Listening..." : busy ? "Answering..." : "Ask a question"}
          className="max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1 text-sm outline-none [field-sizing:content]"
        />
        {voice.supported && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={voice.listening ? "Stop voice input" : "Start voice input"}
            aria-pressed={voice.listening}
            title="Voice input uses your browser's speech service."
            className={`relative grid size-8 shrink-0 place-items-center rounded-lg hover:bg-fd-accent ${voice.listening ? "text-red-500" : "text-fd-muted-foreground"}`}
          >
            {voice.listening && <span className="docs-ask-pulse absolute inset-1 rounded-full bg-red-500/20" aria-hidden />}
            <Mic className="relative size-4" />
          </button>
        )}
        {busy ? (
          <button type="button" onClick={stop} aria-label="Stop generating" className="grid size-8 shrink-0 place-items-center rounded-lg bg-fd-primary text-fd-primary-foreground">
            <Square className="size-3.5 fill-current" />
          </button>
        ) : (
          <button type="submit" disabled={!text.trim()} aria-label="Send" className="grid size-8 shrink-0 place-items-center rounded-lg bg-fd-primary text-fd-primary-foreground disabled:opacity-40">
            <Send className="size-4" />
          </button>
        )}
      </div>
      {voice.error && (
        <p role="alert" className="mt-1.5 text-xs text-red-500">
          {voice.error}{" "}
          {voice.blocked && (
            <button type="button" onClick={voice.enable} className="font-medium underline">
              Turn on microphone
            </button>
          )}
        </p>
      )}
      <p className="mt-2 text-center text-[11px] text-fd-muted-foreground">
        AI can make mistakes. Please verify.
      </p>
    </form>
  );
}
