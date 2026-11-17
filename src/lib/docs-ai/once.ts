/**
 * Runs an async task exactly once per server process and shares the pending promise across concurrent callers.
 * If the task fails, the cached promise is discarded so subsequent calls can retry (self-healing).
 * Commonly used for lazy one-time initialization like creating database indexes.
 */

export function once(task: () => Promise<unknown>) {
  let ready: Promise<unknown> | undefined;
  return () =>
    (ready ??= task().catch((e) => {
      ready = undefined;
      throw e;
    }));
}

