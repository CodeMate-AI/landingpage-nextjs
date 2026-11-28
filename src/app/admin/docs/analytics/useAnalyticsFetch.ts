"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api-client";

const FALLBACK_ERROR = "Could not load analytics.";

type Loaded<T> = { url: string; tick: number; data: T | null; error: string | null };

// Loads one analytics API URL. "loading" is derived from whether the stored result is for the current URL, so the
// effect only sets state after the response arrives (no synchronous setState in an effect) and old numbers are
// never shown as if they belonged to a newly chosen range.
export function useAnalyticsFetch<T>(url: string) {
  const [result, setResult] = useState<Loaded<T> | null>(null);
  // Bumped by "Try again" to fetch the same URL once more
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await adminFetch(url, { signal: ctrl.signal });
        const body = await res.json().catch(() => ({}));
        if (ctrl.signal.aborted) return;
        setResult(res.ok ? { url, tick, data: body as T, error: null } : { url, tick, data: null, error: body.error || FALLBACK_ERROR });
      } catch {
        // An aborted request belongs to a range the admin already left
        if (!ctrl.signal.aborted) setResult({ url, tick, data: null, error: FALLBACK_ERROR });
      }
    })();
    return () => ctrl.abort();
  }, [url, tick]);

  const current = result !== null && result.url === url && result.tick === tick;
  return {
    data: current ? result.data : null,
    error: current ? result.error : null,
    loading: !current,
    reload: () => setTick((t) => t + 1),
  };
}
