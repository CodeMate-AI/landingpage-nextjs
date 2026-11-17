import { tool } from "ai";
import { z } from "zod";
import { getPublishedPage } from "@/lib/docs-data";
import { getSearchApi } from "@/lib/docs-search-api";
import { tiptapToMarkdown } from "@/lib/docs-markdown";

const MAX_PAGE_CHARS = 60_000;

// Accepts "/docs/foo", "https://codemate.ai/docs/foo.md", "foo" and returns "foo"
function toSlug(input: string) {
  return input.trim().replace(/^https?:\/\/[^/]+/, "").replace(/^\/?docs\//, "").replace(/^\//, "").replace(/\.mdx?$/, "").replace(/[?#].*$/, "");
}

// One set of tools per request. The tool results are streamed to the browser (it shows each step),
// so a page's full Markdown stays on the server: the browser gets {url, title} and the model gets
// the text through toModelOutput.
export function createDocsTools() {
  const pageText = new Map<string, string>();

  return {
    search_docs: tool({
      description: "Search the CodeMate docs. Returns matching pages with a short excerpt. Use it before answering.",
      inputSchema: z.object({
        query: z.string().min(1).max(200).describe("What to search for"),
        limit: z.number().int().min(1).max(10).default(6).describe("Maximum pages to return"),
      }),
      execute: async ({ query, limit }) => {
        const api = await getSearchApi();
        const hits = await api.search(query, { limit: limit * 3 });
        // Group heading and text hits under their page, keep up to 3 excerpts per page
        const pages = new Map<string, { url: string; title: string; excerpts: string[] }>();
        for (const h of hits) {
          const url = h.url.split("#")[0];
          let p = pages.get(url);
          if (!p) {
            if (pages.size >= limit) continue;
            p = { url, title: "", excerpts: [] };
            pages.set(url, p);
          }
          const text = String(h.content ?? "").replace(/<[^>]*>/g, "");
          if (h.type === "page") p.title = text;
          else if (p.excerpts.length < 3) p.excerpts.push(text.slice(0, 240));
        }
        return { results: [...pages.values()] };
      },
    }),

    read_page: tool({
      description: "Read the full Markdown of one docs page. Pass the url from search_docs, for example /docs/overview.",
      inputSchema: z.object({ path: z.string().min(1).max(200).describe("Docs page url or slug") }),
      execute: async ({ path }, options) => {
        const page = await getPublishedPage(toSlug(path));
        if (!page) return { error: "Page not found. Use search_docs to find the right url." };
        let markdown = tiptapToMarkdown(page.content, page.title, page.description);
        if (markdown.length > MAX_PAGE_CHARS) markdown = markdown.slice(0, MAX_PAGE_CHARS) + "\n\n[page truncated]";
        pageText.set(options.toolCallId, markdown);
        return { url: `/docs/${page.slug}`, title: page.title, chars: markdown.length };
      },
      toModelOutput: ({ toolCallId, output }) => {
        const text = pageText.get(toolCallId);
        return { type: "text" as const, value: text ?? JSON.stringify(output) };
      },
    }),
  };
}
