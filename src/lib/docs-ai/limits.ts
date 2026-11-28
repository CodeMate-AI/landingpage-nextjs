import { z } from "zod";

// Ask AI rate limits the admin sets in /admin/docs/settings. Server-safe and client-safe: no database code here.

export type LimitKey = "perVisitorMinute" | "perVisitorDay" | "globalMinute" | "ratingsPerVisitorMinute";
export type RateLimits = Record<LimitKey, number>;

// Sized for about 1M visitors a day: if 1 in 10 asks 3 questions, that is ~300k questions a day,
// ~210 a minute on average, so the overall cap leaves room for peaks of about 7x the average

export const DEFAULT_LIMITS: RateLimits = {
  perVisitorMinute: 10,
  perVisitorDay: 100,
  globalMinute: 1500,
  ratingsPerVisitorMinute: 30,
};

// How the settings form shows each limit: grouped by who it applies to, read as "[number] <unit>" beside its stepper, stepped by `step`

export const LIMIT_FIELDS: { key: LimitKey; group: "Each visitor" | "All visitors together"; unit: string; label: string; max: number; step: number }[] = [
  { key: "perVisitorMinute", group: "Each visitor", unit: "Questions a minute", label: "Questions per visitor, per minute", max: 1000, step: 1 },
  { key: "perVisitorDay", group: "Each visitor", unit: "Questions a day", label: "Questions per visitor, per day", max: 100_000, step: 10 },
  { key: "ratingsPerVisitorMinute", group: "Each visitor", unit: "Ratings a minute", label: "Ratings per visitor, per minute", max: 1000, step: 1 },
  { key: "globalMinute", group: "All visitors together", unit: "Questions a minute", label: "Questions overall, per minute", max: 1_000_000, step: 100 },
];

const limitNumber = (max: number) => z.number({ invalid_type_error: "Enter a number." }).int("Use a whole number.").min(1, "Use at least 1.").max(max, `Use at most ${max.toLocaleString("en-GB")}.`);

// The PUT body of /api/admin/docs/settings; a daily limit below the minute limit would make the minute limit pointless
export const RateLimitsInput = z
  .object(Object.fromEntries(LIMIT_FIELDS.map((f) => [f.key, limitNumber(f.max)])) as Record<LimitKey, ReturnType<typeof limitNumber>>)
  .strict()
  .refine((v) => v.perVisitorDay >= v.perVisitorMinute, { message: "The daily limit must be at least the per-minute limit.", path: ["perVisitorDay"] });

// Ask AI traffic over the last 24 hours, so the admin can see how close it runs to each limit
export interface RateUsage {
  questions: number; // questions that passed every limit
  busiest: Record<LimitKey, number>; // the highest count each limit saw, including requests it then turned away (the daily one: today, UTC)
  blocked: Record<LimitKey, number>; // requests each limit turned away
}

export interface RateSettings {
  limits: RateLimits;
  defaults: RateLimits;
  updatedAt: string | null; // null while the defaults are in use
  updatedBy: string | null;
  usage: RateUsage;
}
