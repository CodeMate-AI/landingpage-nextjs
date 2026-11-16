import React from "react";
import type * as PageTree from "fumadocs-core/page-tree";
import { getDocsDatabase } from "@/lib/mongodb";
import type { NavItem } from "@/lib/docs-validation";

export interface PublishedDoc {
  slug: string;
  title: string;
  description: string;
  content: any;
  sections: { id: string; title: string }[];
}

export type PublishedIndexItem = Pick<PublishedDoc, "slug" | "title">;

// Lightweight list (slug + title only) for the sidebar, redirect and sitemap. Never loads page content.
export const getPublishedIndex = React.cache(async (): Promise<PublishedIndexItem[]> => {
  try {
    const db = await getDocsDatabase();
    const rows = await db
      .collection("pages")
      .find({ published: true, publishedVersion: { $ne: null } })
      .project({ _id: 0, "publishedVersion.slug": 1, "publishedVersion.title": 1 })
      .toArray();
    return rows.map((r: any) => r.publishedVersion as PublishedIndexItem);
  } catch (error) {
    console.error("Failed to load published docs index:", error);
    return [];
  }
});

// One full page by slug (uses the publishedVersion.slug index). Cached per request so
// generateMetadata and the page share one query.
export const getPublishedPage = React.cache(async (slug: string): Promise<PublishedDoc | null> => {
  try {
    const db = await getDocsDatabase();
    const row = await db
      .collection("pages")
      .findOne({ published: true, "publishedVersion.slug": slug }, { projection: { _id: 0, publishedVersion: 1 } });
    return (row?.publishedVersion as PublishedDoc) ?? null;
  } catch (error) {
    console.error("Failed to load published docs page:", error);
    return null;
  }
});

export const getPublishedNav = React.cache(async (): Promise<NavItem[]> => {
  try {
    const db = await getDocsDatabase();
    const nav = await db.collection("nav").findOne({ _id: "main" as any });
    return (nav?.published as NavItem[]) ?? [];
  } catch (error) {
    console.error("Failed to load docs nav:", error);
    return [];
  }
});

// Converts the published nav into a Fumadocs page tree, skipping unpublished slugs and empty groups
export function buildPageTree(nav: NavItem[], pages: PublishedIndexItem[]): PageTree.Root {
  const titles = new Map(pages.map((p) => [p.slug, p.title]));

  const convert = (items: NavItem[]): PageTree.Node[] =>
    items.flatMap((n): PageTree.Node[] => {
      if (n.type === "page") {
        const name = titles.get(n.slug);
        return name === undefined ? [] : [{ type: "page", name, url: `/docs/${n.slug}` }];
      }
      const children = convert(n.children);
      return children.length ? [{ type: "folder", name: n.title, children }] : [];
    });

  return { name: "docs", children: convert(nav) };
}

// First page in sidebar order, used by the /docs redirect
export function firstSlug(nav: NavItem[], pages: PublishedIndexItem[]): string | null {
  const published = new Set(pages.map((p) => p.slug));
  for (const n of nav) {
    if (n.type === "page" && published.has(n.slug)) return n.slug;
    if (n.type === "group") {
      const inner = firstSlug(n.children, pages);
      if (inner) return inner;
    }
  }
  return null;
}
