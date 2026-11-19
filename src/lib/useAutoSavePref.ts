"use client";
import { useSyncExternalStore } from "react";

// One "Auto save" setting shared by the blog, docs page and docs sidebar editors, remembered per browser
const KEY = "codemate_admin_autosave";
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Other tabs changing the setting update this tab too
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAutoSavePref(): [boolean, (on: boolean) => void] {
  // Server render assumes On (the default) so the first paint matches most users
  const on = useSyncExternalStore(subscribe, read, () => true);
  const set = (next: boolean) => {
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      // Storage blocked: the switch still reflects nothing new, so do not pretend it changed
      return;
    }
    listeners.forEach((l) => l());
  };
  return [on, set];
}
