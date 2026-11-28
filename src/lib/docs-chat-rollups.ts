// Running totals of Ask AI chats, kept up to date as questions and ratings arrive, so the analytics page reads a few
// small documents instead of scanning every chat event (a month of raw events at full traffic is far past the
// 5-second query limit and the database's in-memory sort cap). Server only.
import type { Db, ObjectId } from "mongodb";
import { getDocsDatabase } from "@/lib/mongodb";
import { once } from "@/lib/docs-ai/once";

// One document per chat: its opening question, totals and last activity
export const THREADS = "chat_threads";
// Questions asked per 15-minute slot
export const QUESTION_SLOTS = "question_counts";
// Every real time zone offset is a multiple of 15 minutes, so these slots add up to exact local hours and days
export const SLOT_MS = 15 * 60_000;
// Chat events expire after 90 days; the totals built from them go at the same age
const RETENTION_S = 90 * 86400;
// The chats table shows this much of each opening question
export const FIRST_QUESTION_CHARS = 200;

export interface ThreadDoc {
  _id: string; // the chat key: the client threadId, or the event id of a question saved without one
  firstQuestion: string;
  page: string | null; // the docs page the first question was asked on
  visitorId: string | null;
  firstAt: Date;
  lastAt: Date;
  questions: number;
  up: number;
  down: number;
  hasUp: boolean; // up > 0, stored so the "Helpful" filter can be served from an index
  hasDown: boolean; // down > 0, for the "Not helpful" filter
}
export interface SlotDoc {
  _id: Date; // the slot's start
  at: Date; // the same instant, for the TTL index (a TTL index cannot sit on _id)
  n: number;
}

// A chat is every event sharing a threadId; an event saved without one is a chat of its own, keyed by its id
export const chatKeyOf = (e: { _id: ObjectId; threadId?: string | null }) => e.threadId ?? String(e._id);
// The start of the 15-minute slot an instant falls in, counted from the Unix epoch like $dateTrunc's 15-minute bins
const slotOf = (d: Date) => new Date(Math.floor(d.getTime() / SLOT_MS) * SLOT_MS);

// The expiry and query indexes, created once per server process from either the write path or the analytics page,
// because scripts/ (setup-docs-db.ts) never runs in production
export const ensureRollupIndexes = once(async () => {
  const db = await getDocsDatabase();
  const threads = db.collection<ThreadDoc>(THREADS);
  await Promise.all([
    threads.createIndex({ lastAt: 1 }, { expireAfterSeconds: RETENTION_S }),
    // One per chats-table filter, each ending in the table's sort so pages come straight off the index
    threads.createIndex({ lastAt: -1, _id: 1 }),
    threads.createIndex({ hasDown: 1, lastAt: -1, _id: 1 }),
    threads.createIndex({ hasUp: 1, lastAt: -1, _id: 1 }),
    threads.createIndex({ visitorId: 1, lastAt: -1, _id: 1 }),
    // Finds the oldest chat, which tells whether older chat events still need adding to the totals (rollupsMissing)
    threads.createIndex({ firstAt: 1 }),
    db.collection<SlotDoc>(QUESTION_SLOTS).createIndex({ at: 1 }, { expireAfterSeconds: RETENTION_S }),
  ]);
});

// Adds a just-logged question to its chat's totals and to its 15-minute slot
export async function recordQuestion(e: { _id: ObjectId; question: string; page: string | null; threadId: string | null; visitorId: string | null; createdAt: Date }) {
  await ensureRollupIndexes();
  const db = await getDocsDatabase();
  await Promise.all([
    db.collection<ThreadDoc>(THREADS).updateOne(
      { _id: chatKeyOf(e) },
      {
        $setOnInsert: { firstQuestion: e.question.slice(0, FIRST_QUESTION_CHARS), page: e.page, visitorId: e.visitorId, firstAt: e.createdAt, up: 0, down: 0, hasUp: false, hasDown: false },
        $max: { lastAt: e.createdAt },
        $inc: { questions: 1 },
      },
      { upsert: true }
    ),
    db.collection<SlotDoc>(QUESTION_SLOTS).updateOne({ _id: slotOf(e.createdAt) }, { $setOnInsert: { at: slotOf(e.createdAt) }, $inc: { n: 1 } }, { upsert: true }),
  ]);
}

// Moves a chat's helpful and not-helpful totals from an answer's old rating to its new one (0 = rating taken back)
export async function recordRating(before: { _id: ObjectId; threadId?: string | null; rating?: number | null }, vote: -1 | 0 | 1) {
  // +1 when the answer gains this rating, -1 when it loses it, 0 when it is unchanged
  const delta = (v: 1 | -1) => (vote === v ? 1 : 0) - (before.rating === v ? 1 : 0);
  // How the chat's helpful and not-helpful counts change with this vote
  const up = delta(1);
  const down = delta(-1);
  // Voting the same way twice changes nothing, so no write is needed
  if (up === 0 && down === 0) return;
  // A pipeline update, so the filter flags are worked out from the new totals in the same write
  await (await getDocsDatabase()).collection<ThreadDoc>(THREADS).updateOne({ _id: chatKeyOf(before) }, [
    { $set: { up: { $add: [{ $ifNull: ["$up", 0] }, up] }, down: { $add: [{ $ifNull: ["$down", 0] }, down] } } },
    { $set: { hasUp: { $gt: ["$up", 0] }, hasDown: { $gt: ["$down", 0] } } },
  ]);
}

// The build scans every stored event once, so it gets more time than a page query, but still gives up instead of hanging
const BUILD_OPTIONS = { maxTimeMS: 60_000 };

// True when chat events exist from before the running totals started, i.e. the oldest event is older than the oldest chat.
// After a build the oldest chat starts with the oldest event, and chats outlive their events (their TTL runs from lastAt),
// so this stays false without storing a "built" flag anywhere.
async function rollupsMissing(db: Db) {
  const [oldestEvent] = await db.collection("chat_events").find({}, { projection: { createdAt: 1 } }).sort({ createdAt: 1 }).limit(1).toArray();
  if (!oldestEvent) return false;
  const [oldestChat] = await db.collection<ThreadDoc>(THREADS).find({}, { projection: { firstAt: 1 } }).sort({ firstAt: 1 }).limit(1).toArray();
  return !oldestChat || oldestEvent.createdAt < oldestChat.firstAt;
}

// Builds the totals from the chat events already stored, the first time the analytics page runs after this code ships.
// Safe to run twice: both steps replace whole documents with values worked out from the events.
// shortcut: a question or rating logged while the build runs (seconds, once per database) can be replaced by the
// count read just before it, so those totals end up one short; rebuild with a merge that adds counts if that ever matters.
export async function buildRollupsOnce() {
  await ensureRollupIndexes();
  const db = await getDocsDatabase();
  if (!(await rollupsMissing(db))) return;
  const events = db.collection("chat_events");
  // Question slots first and chats last, so a build that fails part way still looks missing and runs again
  await events
    .aggregate([
      { $group: { _id: { $dateTrunc: { date: "$createdAt", unit: "minute", binSize: 15 } }, n: { $sum: 1 } } },
      { $set: { at: "$_id" } },
      { $merge: { into: QUESTION_SLOTS, whenMatched: "replace" } },
    ], BUILD_OPTIONS)
    .toArray();
  // $top picks each chat's first question without sorting the whole collection in memory
  await events
    .aggregate([
      {
        $group: {
          _id: { $ifNull: ["$threadId", { $toString: "$_id" }] },
          first: { $top: { sortBy: { createdAt: 1 }, output: { question: "$question", page: "$page", visitorId: "$visitorId" } } },
          firstAt: { $min: "$createdAt" },
          lastAt: { $max: "$createdAt" },
          questions: { $sum: 1 },
          up: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          down: { $sum: { $cond: [{ $eq: ["$rating", -1] }, 1, 0] } },
        },
      },
      {
        $project: {
          firstQuestion: { $substrCP: [{ $ifNull: ["$first.question", ""] }, 0, FIRST_QUESTION_CHARS] },
          page: { $ifNull: ["$first.page", null] },
          visitorId: { $ifNull: ["$first.visitorId", null] },
          firstAt: 1,
          lastAt: 1,
          questions: 1,
          up: 1,
          down: 1,
          hasUp: { $gt: ["$up", 0] },
          hasDown: { $gt: ["$down", 0] },
        },
      },
      { $merge: { into: THREADS, whenMatched: "replace" } },
    ], BUILD_OPTIONS)
    .toArray();
}
