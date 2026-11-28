import { DEFAULT_PRESET, MAX_CHAT_PAGE, RANGE_PRESETS, type FeedbackFilter, type RangePreset } from "@/lib/docs-analytics-core";
import { ID } from "@/lib/docs-ai/messages";
import { PAGE_SIZES } from "@/components/admin/page-sizes";

// The range as kept in the page URL: a preset, or custom local dates (YYYY-MM-DD, both inclusive)
export interface RangeState {
  range?: RangePreset;
  from?: string;
  to?: string;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

const isPreset = (value: string | null): value is RangePreset => value !== null && value in RANGE_PRESETS;

// Reads the range from the URL; anything missing or malformed falls back to the default preset
export function readRange(params: URLSearchParams): RangeState {
  const range = params.get("range");
  if (isPreset(range)) return { range };
  const from = params.get("from");
  const to = params.get("to");
  if (from && to && DATE.test(from) && DATE.test(to) && from <= to) return { from, to };
  return { range: DEFAULT_PRESET };
}

// The API query for a range: presets resolve on the server; custom dates become local midnights, ending at
// the end of the last day (or now, if that day is today, since the API rejects ranges that end in the future)
export function rangeQuery(state: RangeState, tz: string, now: Date): string {
  const q = new URLSearchParams({ tz });
  if (state.from && state.to) {
    const from = new Date(`${state.from}T00:00:00`);
    // The next local midnight, not +24h, so 23h and 25h daylight saving days end exactly at the day's end
    const nextMidnight = new Date(`${state.to}T00:00:00`);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    const to = new Date(Math.min(nextMidnight.getTime(), now.getTime()));
    q.set("from", from.toISOString());
    q.set("to", to.toISOString());
  } else {
    q.set("range", state.range ?? DEFAULT_PRESET);
  }
  return q.toString();
}

// The page URL query after a range change: other filters stay, and the chats table goes back to its first page
export function withRange(params: URLSearchParams, next: RangeState): string {
  const q = new URLSearchParams(params);
  for (const key of ["range", "from", "to", "p"]) q.delete(key);
  if (next.from && next.to) {
    q.set("from", next.from);
    q.set("to", next.to);
  } else {
    q.set("range", next.range ?? DEFAULT_PRESET);
  }
  return q.toString();
}

// Today and the oldest day that still has data, as local YYYY-MM-DD for date inputs
export function dateBounds(now: Date) {
  const local = (d: Date) => d.toLocaleDateString("en-CA");
  return { min: local(new Date(now.getTime() - 90 * DAY_MS)), max: local(now) };
}

// The chats table state as kept in the page URL (feedback, p, limit, visitorOf)
export interface ChatFilterState {
  feedback: FeedbackFilter;
  p: number;
  limit: number;
  visitorOf?: string;
}

const FEEDBACK: FeedbackFilter[] = ["any", "down", "up"];

// Reads the chats table state from the URL; invalid values fall back to the defaults the API also uses
export function readChatFilters(params: URLSearchParams): ChatFilterState {
  const feedback = params.get("feedback") as FeedbackFilter;
  const p = Number(params.get("p"));
  const limit = Number(params.get("limit"));
  const visitorOf = params.get("visitorOf");
  return {
    feedback: FEEDBACK.includes(feedback) ? feedback : "any",
    // Same bounds as the API, so a hand-edited page number resets instead of failing the request
    p: Number.isInteger(p) && p >= 1 && p <= MAX_CHAT_PAGE ? p : 1,
    limit: PAGE_SIZES.includes(limit) ? limit : PAGE_SIZES[0],
    visitorOf: visitorOf && ID.safeParse(visitorOf).success ? visitorOf : undefined,
  };
}

// The page URL query with some chats table values changed; defaults are left out to keep links short
export function withChatFilters(params: URLSearchParams, patch: Partial<ChatFilterState>): string {
  const next = { ...readChatFilters(params), ...patch };
  const q = new URLSearchParams(params);
  const set = (key: string, value: string | undefined, fallback: string) => (value && value !== fallback ? q.set(key, value) : q.delete(key));
  set("feedback", next.feedback, "any");
  set("p", String(next.p), "1");
  set("limit", String(next.limit), String(PAGE_SIZES[0]));
  set("visitorOf", next.visitorOf, "");
  return q.toString();
}
