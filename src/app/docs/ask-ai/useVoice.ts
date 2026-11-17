"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Minimal typing for the Web Speech API (not in lib.dom for all TS versions)
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionCtor = new () => Recognition;

const getCtor = () => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};
const subscribe = () => () => {};

const BLOCKED = "Microphone access was blocked. Allow it in your browser settings to use voice input.";
const ERRORS: Record<string, string> = {
  "not-allowed": BLOCKED,
  "service-not-allowed": BLOCKED,
  "no-speech": "I did not hear anything. Try again.",
  "audio-capture": "No microphone was found.",
  network: "Voice input needs an internet connection.",
};

/** Browser speech to text. `onText` gets the full transcript so far (interim included). */
export function useVoice(onText: (text: string) => void) {
  const supported = useSyncExternalStore(subscribe, () => !!getCtor(), () => false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const rec = useRef<Recognition | null>(null);
  const cb = useRef(onText);
  useEffect(() => {
    cb.current = onText;
  });

  const stop = useCallback(() => rec.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor || rec.current) return;
    setError("");
    const r = new Ctor();
    r.lang = navigator.language || "en-US";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      cb.current(text);
    };
    r.onerror = (e) => {
      if (e.error === "aborted") return;
      const code = ` (${e.error})`;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        // Tell "microphone blocked" apart from "Chrome's speech service refused": try the mic directly
        navigator.mediaDevices
          ?.getUserMedia({ audio: true })
          .then((s) => {
            s.getTracks().forEach((t) => t.stop());
            setError(`The microphone works, but the browser's speech service refused the request${code}. Check your internet connection, VPN or extensions, then try again.`);
          })
          .catch(() => setError(BLOCKED));
      } else setError((ERRORS[e.error] ?? "Voice input failed. Please try again.") + (ERRORS[e.error] ? "" : code));
    };
    r.onend = () => {
      rec.current = null;
      setListening(false);
    };
    rec.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      rec.current = null;
    }
  }, []);

  // Ask the browser for microphone permission directly. If the visitor blocked it earlier, Chrome
  // will not show the prompt again; only the site settings can undo that, so say how.
  const enable = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      setError("");
      start();
    } catch {
      setError("Still blocked. Click the lock icon next to the address bar, set Microphone to Allow, then try again.");
    }
  }, [start]);

  // When the visitor flips the permission to Allow in the browser, drop the stale "blocked" message
  useEffect(() => {
    if (error !== BLOCKED || !navigator.permissions) return;
    let status: PermissionStatus | undefined;
    const onChange = () => status?.state !== "denied" && setError("");
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((s) => {
        status = s;
        s.addEventListener("change", onChange);
        onChange();
      })
      .catch(() => {});
    return () => status?.removeEventListener("change", onChange);
  }, [error]);

  // Never leave the microphone open when the panel unmounts
  useEffect(() => () => rec.current?.abort(), []);

  return { supported, listening, error, start, stop, enable, blocked: error === BLOCKED };
}
