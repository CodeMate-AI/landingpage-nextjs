import React from "react";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import type { AdvancedIndex } from "fumadocs-core/search/server";
import { buildSearchData } from "@/lib/docs-search-text";
import type * as PageTree from "fumadocs-core/page-tree";
import { getDocsDatabase } from "@/lib/mongodb";
import type { NavItem } from "@/lib/docs-validation";

type PageRow = { publishedVersion: null | PublishedDoc & { search?: AdvancedIndex["structuredData"] } };

export interface PublishedDoc {
  slug: string;
  title: string;
  description: string;
  content: unknown;
  sections: { id: string; title: string }[];
}

export type PublishedIndexItem = Pick<PublishedDoc, "slug" | "title">;

// Lightweight list (slug + title only) for the sidebar, redirect and sitemap. Never loads page content.
export const getPublishedIndex = React.cache(async (): Promise<PublishedIndexItem[]> => {
  try {
    const db = await getDocsDatabase();
    const rows = await db
      .collection<PageRow>("pages")
      .find({ published: true, publishedVersion: { $ne: null } })
      .project<PageRow>({ _id: 0, "publishedVersion.slug": 1, "publishedVersion.title": 1 })
      .toArray();
    return rows.map((r) => r.publishedVersion as PublishedIndexItem);
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

// Search index for all published pages. Reads only slug, title, description and the search data
// stored at publish time (never page content), except for pages published before that field
// existed: those are built from content.
export async function loadSearchIndexes(): Promise<AdvancedIndex[]> {
  const db = await getDocsDatabase();
  const col = db.collection<PageRow>("pages");
  const rows = await col
    .find({ published: true, publishedVersion: { $ne: null } })
    .project<PageRow>({ _id: 0, "publishedVersion.slug": 1, "publishedVersion.title": 1, "publishedVersion.description": 1, "publishedVersion.sections": 1, "publishedVersion.search": 1 })
    .toArray();

  return Promise.all(
    rows.map(async (r) => {
      const p = r.publishedVersion!; // query excludes null
      let search = p.search;
      if (!search) {
        const full = await col.findOne({ "publishedVersion.slug": p.slug }, { projection: { _id: 0, "publishedVersion.content": 1 } });
        search = buildSearchData(full?.publishedVersion?.content, p.sections ?? []);
      }
      return { id: p.slug, title: p.title, description: p.description || undefined, url: `/docs/${p.slug}`, structuredData: search };
    })
  );
}

// Tiny cached token. Publish, rename and delete call revalidateTag(SEARCH_TAG), which changes the
// token; the search route then rebuilds its in-memory index. The hourly fallback is a safety net.
export const SEARCH_TAG = "docs-search";
// Call after any publish, rename or delete so pages, sidebar and search all refresh
export function invalidateDocs() {
  revalidatePath("/docs", "layout");
  revalidateTag(SEARCH_TAG, { expire: 0 });
}

export const getSearchVersion = unstable_cache(async () => Date.now(), ["docs-search-version"], { tags: [SEARCH_TAG], revalidate: 3600 });

export const getPublishedNav =React.cache(async (): Promise<NavItem[]> => {
  try {
    const db = await getDocsDatabase();
    const nav = await db.collection<{ _id: string; published?: NavItem[] }>("nav").findOne({ _id: "main" });
    return nav?.published ?? [];
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

// Published pages in sidebar order with the title of their nearest group, for previous/next links and the page label
export function flattenNav(nav: NavItem[], pages: PublishedIndexItem[], group?: string): { slug: string; title: string; group?: string }[] {
  const titles = new Map(pages.map((p) => [p.slug, p.title]));
  return nav.flatMap((n) => {
    if (n.type === "group") return flattenNav(n.children, pages, n.title);
    const title = titles.get(n.slug);
    return title === undefined ? [] : [{ slug: n.slug, title, group }];
  });
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
