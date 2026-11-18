import type * as PageTree from "fumadocs-core/page-tree";
import type { TableOfContents } from "fumadocs-core/toc";

// The docs editor and its preview (modal iframe or new tab) talk over this channel:
// Every message carries `editor`, the id of the editor tab the preview was opened from (the `editor` URL
// param), so several open editors never answer each other's previews.
//   preview -> editor: { type: "hello" } when it opens, { type: "bye" } when it closes
//   editor -> preview: { type: "render", data: DocsPreviewData } or { type: "error", status: number }
export const DOCS_PREVIEW_CHANNEL = "admin-docs-preview";
// localStorage key where the editor keeps its latest render ({ editor, data }): a preview whose editor tab is
// gone (closed, reloaded, or replaced by the preview itself) starts from it instead of showing nothing
export const DOCS_PREVIEW_LAST = "admin-docs-preview-last";

type Entry = { slug: string; title: string } | null;

// What POST /api/admin/docs/preview returns
export interface DocsPreviewData {
  slug: string;
  title: string;
  description: string;
  html: string;
  toc: TableOfContents;
  tree: PageTree.Root;
  label?: string;
  prev: Entry;
  next: Entry;
}
