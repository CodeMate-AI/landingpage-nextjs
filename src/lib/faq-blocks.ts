import { Node, mergeAttributes } from "@tiptap/core";

// Server-safe FAQ block definitions (no React). Used by generateHTML on blog and docs pages and,
// extended with node views, by the shared editor. The markup reuses the blog's .faq-pill-* classes;
// formatFaqBlocks in blog-compiler.ts turns each summary div into a real <button> after sanitizing.

// Section title of the whole block. It renders as a heading inserted by the compiler, so here it is only kept for parsing.
export const FaqNode = Node.create({
  name: "faq",
  group: "block",
  content: "faqItem+",
  defining: true,
  addAttributes: () => ({
    title: {
      default: "",
      parseHTML: (el: HTMLElement) => el.getAttribute("data-title") || "",
      renderHTML: (attrs: Record<string, unknown>) => (attrs.title ? { "data-title": attrs.title } : {}),
    },
  }),
  parseHTML: () => [{ tag: 'div[data-type="faq"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "faq", class: "faq-pill-container" }), 0],
});

// One question and its answer. The question lives in the `title` attribute and renders inside the summary row.
export const FaqItemNode = Node.create({
  name: "faqItem",
  content: "(paragraph | bulletList | orderedList | blockquote | codeBlock)+",
  defining: true,
  addAttributes: () => ({
    title: {
      default: "",
      parseHTML: (el: HTMLElement) => el.querySelector(".faq-question-title")?.textContent ?? "",
      renderHTML: () => ({}),
    },
  }),
  parseHTML: () => [{ tag: 'div[data-type="faq-item"]', contentElement: ".faq-answer-body" }],
  renderHTML: ({ node, HTMLAttributes }) => [
    "div",
    mergeAttributes(HTMLAttributes, { "data-type": "faq-item", class: "faq-pill-card" }),
    [
      "div",
      { class: "faq-pill-summary", role: "button" },
      ["span", { class: "faq-circle-badge" }, "+"],
      ["span", { class: "faq-question-title" }, String(node.attrs.title || "")],
    ],
    ["div", { class: "faq-answer-body" }, 0],
  ],
});
