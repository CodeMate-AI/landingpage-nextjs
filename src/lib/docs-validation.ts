import { z } from "zod";
import { TiptapNodeSchema } from "@/lib/validation";
import { extractSectionsFromTiptapJson } from "@/lib/blog-compiler";

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
});

// The fields that get frozen when a page is published
export function buildSnapshot(d: DocPageInput) {
  return {
    slug: d.slug,
    title: d.title,
    description: d.description,
    content: d.content,
    sections: extractSectionsFromTiptapJson(d.content),
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

// Removes a page slug from a nav tree, dropping nothing else
export function removeSlug(tree: NavItem[], slug: string): NavItem[] {
  return tree
    .filter((n) => !(n.type === "page" && n.slug === slug))
    .map((n) => (n.type === "group" ? { ...n, children: removeSlug(n.children, slug) } : n));
}
