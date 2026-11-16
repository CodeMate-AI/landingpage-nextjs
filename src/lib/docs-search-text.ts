// Builds the search index data for one docs page (Tiptap JSON to plain text per section).
// Computed once when a page is published and stored in publishedVersion.search, so a search
// request never has to walk page content.
type N = { type?: string; text?: string; attrs?: Record<string, unknown>; content?: N[] };

export interface SearchData {
  headings: { id: string; content: string }[];
  contents: { heading: string | undefined; content: string }[];
}

// Blocks that carry their own title in attrs (tabs, steps, cards, accordions, callouts)
const text = (n: N): string => {
  const own = typeof n.attrs?.title === "string" ? n.attrs.title : "";
  const body = n.text ?? (n.content ?? []).map(text).join(" ");
  return `${own} ${body}`.replace(/\s+/g, " ").trim();
};

export function buildSearchData(doc: unknown, sections: { id: string; title: string }[]): SearchData {
  const headings = sections.map((s) => ({ id: s.id, content: s.title }));
  const contents: SearchData["contents"] = [];
  let next = 0;
  let current: string | undefined;

  for (const node of (doc as N)?.content ?? []) {
    const t = text(node);
    if (!t) continue;
    // a heading that matches the next section title starts that section
    if (node.type === "heading" && sections[next]?.title === t) {
      current = sections[next++].id;
      continue;
    }
    contents.push({ heading: current, content: t });
  }
  return { headings, contents };
}
