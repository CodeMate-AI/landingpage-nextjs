import { z } from "zod";
import { TiptapNodeSchema } from "@/lib/validation";
import { extractSectionsFromTiptapJson } from "@/lib/blog-compiler";
import { buildSearchData } from "@/lib/docs-search-text";
// Docs analytics query validation: id format, allowed page sizes and range presets
import { ID } from "@/lib/docs-ai/messages";
import { PAGE_SIZES } from "@/components/admin/page-sizes";
import { MAX_CHAT_PAGE, RANGE_PRESETS, type RangePreset } from "@/lib/docs-analytics-core";

export const DocPageSchema = z.object({
  slug: z
    .string()
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and single hyphens"),
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  content: z.object({
    type: z.literal("doc"),
    content: z.array(TiptapNodeSchema).optional().default([]),
  }),
  saveMode: z.enum(["draft", "publish"]).default("draft"),
  // Edit conflict guard: the version the client loaded, and an explicit "keep mine" override
  version: z.number().int().nonnegative().optional(),
  forceOverwrite: z.boolean().optional(),
});

export type DocPageInput = z.infer<typeof DocPageSchema>;

export type NavItem =
  | { type: "page"; slug: string }
  | { type: "group"; title: string; children: NavItem[] };

// Depth is capped at 3 levels by nesting explicit schemas instead of z.lazy
const page = z.object({ type: z.literal("page"), slug: z.string().min(1) });
const group = <T extends z.ZodTypeAny>(child: T) =>
  z.object({ type: z.literal("group"), title: z.string().min(1), children: z.array(child) });
const level3 = page;
const level2 = z.union([page, group(level3)]);
const level1 = z.union([page, group(level2)]);

export const NavSchema = z.object({
  tree: z.array(z.union([page, group(level1)])),
  saveMode: z.enum(["draft", "publish"]).default("draft"),
  // Edit conflict guard, same meaning as on DocPageSchema
  version: z.number().int().nonnegative().optional(),
  forceOverwrite: z.boolean().optional(),
});

// Mongo filter matching a record at the version the client loaded (records saved before versioning have none)
export function versionFilter(version: number) {
  return version === 0 ? { version: { $exists: false } } : { version };
}

// The fields that get frozen when a page is published
export function buildSnapshot(d: DocPageInput) {
  const sections = extractSectionsFromTiptapJson(d.content);
  return {
    slug: d.slug,
    title: d.title,
    description: d.description,
    content: d.content,
    sections,
    search: buildSearchData(d.content, sections),
  };
}

export function draftDiffers(draft: DocPageInput, published: any): boolean {
  if (!published) return false;
  return (
    draft.slug !== published.slug ||
    draft.title !== published.title ||
    draft.description !== published.description ||
    JSON.stringify(draft.content) !== JSON.stringify(published.content)
  );
}

// Docs analytics range from the URL: a preset, or custom ISO dates, plus the admin's IANA time zone
export const AnalyticsRangeQuery = z.object({
  range: z.enum(Object.keys(RANGE_PRESETS) as [RangePreset, ...RangePreset[]]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  tz: z.string().max(64).optional(),
});

// Page number and page size shared by every paged analytics list
const Paging = {
  // Capped so a hand-edited page number cannot overflow the database skip; real lists never get near it
  page: z.coerce.number().int().min(1).max(MAX_CHAT_PAGE).default(1),
  limit: z.coerce
    .number()
    .int()
    .refine((n) => PAGE_SIZES.includes(n), "Unsupported page size")
    .default(PAGE_SIZES[0]),
};

// Docs analytics chat list: the range plus feedback filter, paging, and an optional "chats of the visitor behind this chat"
export const ChatListQuery = AnalyticsRangeQuery.extend({
  feedback: z.enum(["any", "down", "up"]).default("any"),
  ...Paging,
  visitorOf: ID.optional(),
});

// The answers rated not helpful in a range, one page at a time
export const DownvotedQuery = AnalyticsRangeQuery.extend(Paging);

// One page of the questions inside a single chat
export const ChatPageQuery = z.object(Paging);

// A chat id in the analytics URLs: a client thread id, or the event id of a chat saved without one (both match ID)
export const ChatIdParam = ID;

// Removes a page slug from a nav tree, dropping nothing else
export function removeSlug(tree: NavItem[], slug: string): NavItem[] {
  return tree
    .filter((n) => !(n.type === "page" && n.slug === slug))
    .map((n) => (n.type === "group" ? { ...n, children: removeSlug(n.children, slug) } : n));
}
