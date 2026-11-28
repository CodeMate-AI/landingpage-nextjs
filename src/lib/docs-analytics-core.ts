// Docs analytics logic and types with no server imports, shared by the API, the admin pages and the check script.

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

// Range presets in days; "24h" is one day
export const RANGE_PRESETS = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 } as const;
export type RangePreset = keyof typeof RANGE_PRESETS;
// Chat events and page votes expire after 90 days (TTL), so no range can reach further back
export const MAX_RANGE_DAYS = 90;
// Highest chats page a URL may ask for: far past any real list, and small enough for the database skip
export const MAX_CHAT_PAGE = 1_000_000;
// The range shown when the URL names none
export const DEFAULT_PRESET: RangePreset = "7d";

export type Bucket = "hour" | "day";
// A validated range: [from, to), its bar size, and the IANA time zone bars are cut in
export interface ResolvedRange {
  from: Date;
  to: Date;
  bucket: Bucket;
  tz: string;
}

// Analytics answers are per admin and live, so neither browsers nor CDNs may keep them
export const NO_STORE = { "Cache-Control": "no-store" } as const;

// A time zone the runtime accepts, or UTC, so a bad value from the URL can never break a query
export function safeTimeZone(tz?: string): string {
  if (!tz) return "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

// Turns a preset or a custom from/to into a checked range ending no later than now, at most 90 days long
export function resolveRange(
  q: { range?: RangePreset; from?: Date; to?: Date; tz?: string },
  now: Date
): ResolvedRange | { error: string } {
  const tz = safeTimeZone(q.tz);
  const withBucket = (from: Date, to: Date): ResolvedRange => ({ from, to, tz, bucket: to.getTime() - from.getTime() <= 2 * DAY_MS ? "hour" : "day" });

  // A preset wins over custom dates, so shared links always mean "the last N days" when opened
  if (q.range || (!q.from && !q.to)) {
    const days = RANGE_PRESETS[q.range ?? DEFAULT_PRESET];
    return withBucket(new Date(now.getTime() - days * DAY_MS), now);
  }
  if (!q.from || !q.to || Number.isNaN(q.from.getTime()) || Number.isNaN(q.to.getTime())) {
    return { error: "A custom range needs both a start and an end date." };
  }
  // One minute of slack covers clock drift between the admin's browser and the server
  if (q.to.getTime() > now.getTime() + 60_000) return { error: "The range cannot end in the future." };
  // Data older than 90 days is already deleted, so an older start is pulled in rather than rejected
  const from = new Date(Math.max(q.from.getTime(), now.getTime() - MAX_RANGE_DAYS * DAY_MS));
  if (from.getTime() >= q.to.getTime()) return { error: "The range must end after it starts, within the last 90 days." };
  return withBucket(from, q.to);
}

// Wall-clock date and time of an instant in a time zone
function wallClock(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute"), second: get("second") };
}

// How far the zone's wall clock is ahead of UTC at this instant, in ms
function zoneOffset(date: Date, tz: string): number {
  const w = wallClock(date, tz);
  return Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second) - Math.floor(date.getTime() / 1000) * 1000;
}

// The instant the local hour or local day containing `date` began, matching MongoDB $dateTrunc with the same timezone
function startOfBucket(date: Date, bucket: Bucket, tz: string): Date {
  const w = wallClock(date, tz);
  const wall = Date.UTC(w.year, w.month - 1, w.day, bucket === "hour" ? w.hour : 0);
  // The offset at `date` can differ from the offset at the bucket start (daylight saving), so it is checked once more there
  const guess = wall - zoneOffset(date, tz);
  return new Date(wall - zoneOffset(new Date(guess), tz));
}

// Every bar start in the range, so days or hours with no questions still get a bar
export function bucketStarts(r: ResolvedRange): Date[] {
  const starts: Date[] = [];
  let start = startOfBucket(r.from, r.bucket, r.tz);
  while (start.getTime() < r.to.getTime()) {
    starts.push(start);
    // A local day is 23 to 25 hours long, so the next day is found by jumping past it and truncating, not by adding 24h
    start = r.bucket === "hour" ? new Date(start.getTime() + HOUR_MS) : startOfBucket(new Date(start.getTime() + 26 * HOUR_MS), "day", r.tz);
  }
  return starts;
}

// One point per bar start, with 0 where the database returned no count
export function fillSeries(starts: Date[], counts: ReadonlyMap<number, number>): SeriesPoint[] {
  return starts.map((s) => ({ start: s.toISOString(), questions: counts.get(s.getTime()) ?? 0 }));
}

// Share of up votes as a whole percent, or null when nobody voted
export function percent(up: number, down: number): number | null {
  return up + down === 0 ? null : Math.round((up * 100) / (up + down));
}

// Only the first 8 characters of a visitor id are ever shown, enough to tell visitors apart
export function shortVisitor(id?: string | null): string | null {
  return id ? id.slice(0, 8) : null;
}

// Shapes returned by the analytics API and rendered by the admin pages
export interface SeriesPoint {
  start: string;
  questions: number;
}
export interface PageVotes {
  slug: string;
  title: string | null; // null when the slug has no published page
  up: number;
  down: number;
}
export interface DownvotedAnswer {
  id: string;
  threadId: string | null;
  question: string;
  answer: string; // first 300 characters
  page: string | null;
  createdAt: string;
}
export interface AnalyticsOverview {
  range: { from: string; to: string; bucket: Bucket };
  summary: {
    pageVotes: { up: number; down: number };
    chats: number;
    questions: number;
    answerRatings: { up: number; down: number };
  };
  series: SeriesPoint[];
  topPages: PageVotes[];
  bottomPages: PageVotes[];
}
// One page of the answers rated not helpful in a range, newest first; loaded apart from the overview so it can page
export interface DownvotedList {
  rows: DownvotedAnswer[];
  total: number;
  page: number;
  limit: number;
}
export type FeedbackFilter = "any" | "down" | "up";
export interface ChatRow {
  threadId: string; // a chat with no threadId uses its event id
  firstQuestion: string; // first 200 characters
  page: string | null;
  questions: number;
  up: number;
  down: number;
  lastAt: string;
}
export interface ChatList {
  chats: ChatRow[];
  total: number;
  page: number;
  limit: number;
}
export interface ChatEventView {
  id: string;
  question: string;
  answer: string | null; // null when the answer stream never finished
  page: string | null;
  rating: 1 | -1 | null;
  tools: ChatTool[] | null; // null for answers saved before tools were recorded
  createdAt: string;
}
// One page of a chat's questions, oldest first, with totals for the whole chat so the header never depends on the page
export interface ChatDetail {
  threadId: string;
  visitor: string | null; // shortened visitor id
  total: number; // questions in the whole chat
  up: number; // answers rated helpful in the whole chat
  down: number;
  firstAt: string; // when the chat's first question was asked
  firstPage: string | null; // the docs page the first question was asked on
  page: number;
  limit: number;
  events: ChatEventView[];
}

// One tool call the Ask AI model made while answering, as stored on chat_events.tools
export interface ChatTool {
  name: "search_docs" | "read_page";
  input: string;
  results?: number; // pages returned, search_docs only
}

// The parts of an AI SDK step this file reads, typed structurally so it never imports the SDK
type StepLike = {
  toolCalls: ReadonlyArray<{ toolCallId: string; toolName: string; input: unknown }>;
  toolResults: ReadonlyArray<{ toolCallId: string; output: unknown }>;
};

// Keeps a stored record small: the 6-step limit in /api/ask allows several parallel calls per step, so this sits well above it
const MAX_TOOLS = 20;
// Both tool input schemas cap their text at 200 characters; the same cap keeps stored records small
const MAX_INPUT = 200;

// Turns the steps of a finished answer into the tool calls worth storing: the two docs tools, their input and result count
export function toolsFromSteps(steps: ReadonlyArray<StepLike>): ChatTool[] {
  const tools: ChatTool[] = [];
  for (const step of steps) {
    for (const call of step.toolCalls) {
      if (call.toolName !== "search_docs" && call.toolName !== "read_page") continue;
      const input = (call.input ?? {}) as { query?: unknown; path?: unknown };
      const text = String((call.toolName === "search_docs" ? input.query : input.path) ?? "").slice(0, MAX_INPUT);
      const tool: ChatTool = { name: call.toolName, input: text };
      if (call.toolName === "search_docs") {
        // The search tool returns { results: [...] }; a missing or failed result leaves the count out
        const output = step.toolResults.find((r) => r.toolCallId === call.toolCallId)?.output as { results?: unknown } | undefined;
        if (Array.isArray(output?.results)) tool.results = output.results.length;
      }
      tools.push(tool);
    }
  }
  return tools.slice(0, MAX_TOOLS);
}
