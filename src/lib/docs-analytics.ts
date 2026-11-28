// Docs analytics queries over codemate_docs: page votes, Ask AI chat events and the running chat totals in docs-chat-rollups.ts.
// Server only. Kept free of next/cache imports (docs-data.ts) so the check script can run it outside Next.js.
import { ObjectId, type Document } from "mongodb";
import { getDocsDatabase } from "@/lib/mongodb";
import { once } from "@/lib/docs-ai/once";
import {
  bucketStarts,
  fillSeries,
  shortVisitor,
  type AnalyticsOverview,
  type ChatDetail,
  type ChatList,
  type ChatTool,
  type DownvotedList,
  type FeedbackFilter,
  type PageVotes,
  type ResolvedRange,
} from "@/lib/docs-analytics-core";
// The per-chat and per-15-minute running totals the overview and the chats table read
import { buildRollupsOnce, QUESTION_SLOTS, THREADS, type SlotDoc, type ThreadDoc } from "@/lib/docs-chat-rollups";

// An admin page must never hang on a slow aggregation; the route turns a timeout into its 500 message
const QUERY_OPTIONS = { maxTimeMS: 5000 };
const TOP_PAGES = 10;
const ANSWER_SNIPPET = 300;
const OBJECT_ID = /^[a-f0-9]{24}$/;

// Indexes and the updatedAt backfill are created here, once per server process, because scripts/ (setup-docs-db.ts)
// is local-only and never runs in production. Both steps are idempotent.
const ensureAnalyticsIndexes = once(async () => {
  const db = await getDocsDatabase();
  const events = db.collection("chat_events");
  const votes = db.collection("page_feedback");
  await Promise.all([
    events.createIndex({ threadId: 1, createdAt: 1 }),
    events.createIndex({ rating: 1, createdAt: -1 }),
    events.createIndex({ visitorId: 1, createdAt: -1 }),
    votes.createIndex({ updatedAt: 1 }),
  ]);
  // Votes saved before updatedAt existed take their only known date, so range filters still count them
  await votes.updateMany({ updatedAt: { $exists: false } }, [{ $set: { updatedAt: "$createdAt" } }]);
  // Chats and questions logged before the running totals existed are added to them once. A failed build is logged and
  // left for the next server process, so the page still loads with the live totals instead of re-running it on every visit.
  await buildRollupsOnce().catch((error) => console.error("Building the Ask AI chat totals failed:", error));
});

async function collections() {
  await ensureAnalyticsIndexes();
  const db = await getDocsDatabase();
  return {
    events: db.collection("chat_events"),
    votes: db.collection("page_feedback"),
    // The running totals kept by /api/ask and /api/ask/feedback (docs-chat-rollups.ts)
    threads: db.collection<ThreadDoc>(THREADS),
    slots: db.collection<SlotDoc>(QUESTION_SLOTS),
  };
}

// Half-open range filter on a date field
const inRange = (field: string, r: ResolvedRange) => ({ [field]: { $gte: r.from, $lt: r.to } });
// Counts of up and down values of a field, for $group
const upDown = (field: string) => ({
  up: { $sum: { $cond: [{ $eq: [`$${field}`, 1] }, 1, 0] } },
  down: { $sum: { $cond: [{ $eq: [`$${field}`, -1] }, 1, 0] } },
});

// Everything on the analytics page except the chats table. titles maps published slugs to page titles.
export async function getOverview(r: ResolvedRange, titles: ReadonlyMap<string, string>): Promise<AnalyticsOverview> {
  const { events, votes, threads, slots } = await collections();

  const [pageRows, slotRows, chats, ratedUp, ratedDown] = await Promise.all([
    // One row per voted page; the summary totals are summed from the same rows
    votes.aggregate([{ $match: inRange("updatedAt", r) }, { $group: { _id: "$page", ...upDown("vote") } }], QUERY_OPTIONS).toArray(),
    // Questions come from the 15-minute slots, grouped into bars cut in the admin's time zone the same way bucketStarts() lists them
    slots
      .aggregate([{ $match: inRange("_id", r) }, { $group: { _id: { $dateTrunc: { date: "$_id", unit: r.bucket, timezone: r.tz } }, n: { $sum: "$n" } } }], QUERY_OPTIONS)
      .toArray(),
    // A chat counts in the range when its latest question does, the same rule as the chats table
    threads.countDocuments(inRange("lastAt", r), QUERY_OPTIONS),
    // Rated answers are a small share of all answers, and the rating index finds them directly
    events.countDocuments({ rating: 1, ...inRange("createdAt", r) }, QUERY_OPTIONS),
    events.countDocuments({ rating: -1, ...inRange("createdAt", r) }, QUERY_OPTIONS),
  ]);

  const pages: PageVotes[] = pageRows.map((p) => ({ slug: String(p._id), title: titles.get(String(p._id)) ?? null, up: p.up, down: p.down }));
  const counts = new Map<number, number>(slotRows.map((s: Document) => [new Date(s._id).getTime(), s.n]));

  return {
    range: { from: r.from.toISOString(), to: r.to.toISOString(), bucket: r.bucket },
    summary: {
      pageVotes: { up: sum(pages, "up"), down: sum(pages, "down") },
      chats,
      // Summed from the same slots as the chart, so the total always matches its bars
      questions: slotRows.reduce((n: number, s: Document) => n + s.n, 0),
      answerRatings: { up: ratedUp, down: ratedDown },
    },
    series: fillSeries(bucketStarts(r), counts),
    // Only pages someone voted up rank as most upvoted, and only pages someone voted down as most downvoted
    topPages: pages.filter((p) => p.up > 0).sort((a, b) => b.up - a.up || a.down - b.down).slice(0, TOP_PAGES),
    bottomPages: pages.filter((p) => p.down > 0).sort((a, b) => b.down - a.down || a.up - b.up).slice(0, TOP_PAGES),
  };
}

// A stale or edited URL can ask for a page past the end; this clamps it to the last page (page 1 for an empty list)
const clampPage = (page: number, total: number, limit: number) => Math.min(page, Math.max(1, Math.ceil(total / limit)));

// One page of the answers rated not helpful in the range, newest first; the rating index serves both the count and the page
export async function listDownvoted(r: ResolvedRange, q: { page: number; limit: number }): Promise<DownvotedList> {
  const { events } = await collections();
  const filter = { rating: -1, ...inRange("createdAt", r) };
  const total = await events.countDocuments(filter, QUERY_OPTIONS);
  const page = clampPage(q.page, total, q.limit);
  const rows = await events
    .find(filter, { ...QUERY_OPTIONS, projection: { question: 1, answer: 1, page: 1, threadId: 1, createdAt: 1 } })
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * q.limit)
    .limit(q.limit)
    .toArray();
  return {
    rows: rows.map((e) => ({
      id: String(e._id),
      threadId: e.threadId ?? null,
      question: String(e.question ?? ""),
      answer: String(e.answer ?? "").slice(0, ANSWER_SNIPPET),
      page: e.page ?? null,
      createdAt: new Date(e.createdAt).toISOString(),
    })),
    total,
    page,
    limit: q.limit,
  };
}

function sum(rows: PageVotes[], key: "up" | "down") {
  return rows.reduce((n, row) => n + row[key], 0);
}

// One page of chats in the range, newest activity first, filtered by feedback and optionally by one visitor
export async function listChats(
  r: ResolvedRange,
  q: { feedback: FeedbackFilter; page: number; limit: number; visitorOf?: string }
): Promise<ChatList> {
  const { threads } = await collections();
  // A chat is in the range when its latest question is, and its counts cover the whole chat
  const filter: Document = inRange("lastAt", r);

  // "Other chats by this visitor" names a chat, so the full visitor id never travels in a URL
  if (q.visitorOf) {
    const owner = await threads.findOne({ _id: q.visitorOf }, { projection: { visitorId: 1 } });
    if (!owner?.visitorId) return { chats: [], total: 0, page: 1, limit: q.limit };
    filter.visitorId = owner.visitorId;
  }
  // Stored flags rather than down > 0, so each filter has an index that also gives the table's order
  if (q.feedback === "down") filter.hasDown = true;
  if (q.feedback === "up") filter.hasUp = true;

  const total = await threads.countDocuments(filter, QUERY_OPTIONS);
  const page = clampPage(q.page, total, q.limit);
  const rows = await threads
    .find(filter, QUERY_OPTIONS)
    .sort({ lastAt: -1, _id: 1 })
    .skip((page - 1) * q.limit)
    .limit(q.limit)
    .toArray();

  return {
    chats: rows.map((c) => ({
      threadId: c._id,
      firstQuestion: c.firstQuestion,
      page: c.page ?? null,
      questions: c.questions,
      up: c.up,
      down: c.down,
      lastAt: c.lastAt.toISOString(),
    })),
    total,
    page,
    limit: q.limit,
  };
}

// One page of a chat's questions and answers, oldest first, with whole-chat totals; null when no chat has this id
export async function getChat(threadId: string, q: { page: number; limit: number }): Promise<ChatDetail | null> {
  const { events } = await collections();
  // A chat saved without a threadId is listed under its event id (see chatKeyOf in docs-chat-rollups.ts)
  let filter: Document = { threadId };
  if ((await events.countDocuments(filter, { ...QUERY_OPTIONS, limit: 1 })) === 0 && OBJECT_ID.test(threadId)) {
    filter = { _id: new ObjectId(threadId), threadId: null };
  }
  // Totals for the whole chat, so the header and numbering stay right on every page
  const [stats] = await events
    .aggregate(
      [
        { $match: filter },
        { $sort: { createdAt: 1 } },
        { $group: { _id: null, total: { $sum: 1 }, ...upDown("rating"), firstAt: { $first: "$createdAt" }, firstPage: { $first: "$page" }, visitorId: { $first: "$visitorId" } } },
      ],
      QUERY_OPTIONS
    )
    .toArray();
  if (!stats) return null;

  const page = clampPage(q.page, stats.total, q.limit);
  const rows = await events.find(filter, QUERY_OPTIONS).sort({ createdAt: 1, _id: 1 }).skip((page - 1) * q.limit).limit(q.limit).toArray();

  return {
    threadId,
    visitor: shortVisitor(stats.visitorId),
    total: stats.total,
    up: stats.up,
    down: stats.down,
    firstAt: new Date(stats.firstAt).toISOString(),
    firstPage: stats.firstPage ?? null,
    page,
    limit: q.limit,
    events: rows.map((e) => ({
      id: String(e._id),
      question: String(e.question ?? ""),
      answer: typeof e.answer === "string" ? e.answer : null,
      page: e.page ?? null,
      rating: e.rating === 1 ? 1 : e.rating === -1 ? -1 : null,
      tools: Array.isArray(e.tools) ? (e.tools as ChatTool[]) : null,
      createdAt: new Date(e.createdAt).toISOString(),
    })),
  };
}
