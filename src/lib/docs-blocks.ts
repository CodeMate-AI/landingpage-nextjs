import { Extension, Node, mergeAttributes } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { Plugin } from "@tiptap/pm/state";

// Optional title (file name) on code blocks. Null by default and only rendered when set, so
// existing blog code blocks serialize exactly as before.
export const CodeTitle = Extension.create({
  name: "codeTitle",
  addGlobalAttributes() {
    return [
      {
        types: ["codeBlock"],
        attributes: {
          title: {
            default: null,
            parseHTML: (el) => el.getAttribute("data-title"),
            renderHTML: (attrs) => (attrs.title ? { "data-title": attrs.title } : {}),
          },
        },
      },
    ];
  },
});

// Docs features that must not be placed inside one another (a callout in a card, tabs in a step, ...)
// "faq" is listed so the FAQ block cannot be nested inside other docs blocks either
export const DOCS_CONTAINERS = ["tabs", "steps", "cards", "accordion", "frame", "callout", "referenceBlogs", "faq"];

// How many docs blocks sit inside another docs block
function nestedCount(doc: PMNode) {
  let n = 0;
  const walk = (node: PMNode, inside: boolean) =>
    node.forEach((child) => {
      const isBlock = DOCS_CONTAINERS.includes(child.type.name);
      if (isBlock && inside) n++;
      walk(child, inside || isBlock);
    });
  walk(doc, false);
  return n;
}

// Rejects any change that adds a docs block inside another one. It compares with the old document, so
// pages that already nest blocks (such as imported ones) stay editable.
export const NoNestedDocsBlocks = Extension.create({
  name: "noNestedDocsBlocks",
  addProseMirrorPlugins: () => [
    new Plugin({ filterTransaction: (tr) => !tr.docChanged || nestedCount(tr.doc) <= nestedCount(tr.before) }),
  ],
});

// Server-safe docs block definitions (no React). Used by generateHTML on the public page and,
// extended with node views, by the docs editor. Blog documents never contain these nodes
// (the FAQ block, shared with the blog, lives in faq-blocks.ts).

// Tabs: a `tabs` container of `tab` panels. The tab title is an attribute; DocsEnhance builds the
// tab bar from `data-title` on the public page (without JS the panels simply stack).
export const TabsNode = Node.create({
  name: "tabs",
  group: "block",
  content: "tab+",
  defining: true,
  parseHTML() {
    return [{ tag: 'div[data-type="tabs"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "tabs", class: "docs-tabs" }), 0];
  },
});

export const TabNode = Node.create({
  name: "tab",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      title: {
        default: "Tab",
        parseHTML: (el) => el.getAttribute("data-title") || "Tab",
        renderHTML: (attrs) => ({ "data-title": attrs.title || "Tab" }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="tab"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "tab", class: "docs-tab" }), 0];
  },
});

export const CALLOUT_KINDS = ["note", "info", "tip", "warning", "check", "danger"] as const;
export type CalloutKind = (typeof CALLOUT_KINDS)[number];

export const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      kind: {
        default: "note",
        parseHTML: (el) => {
          const k = el.getAttribute("data-kind");
          return CALLOUT_KINDS.includes(k as CalloutKind) ? k : "note";
        },
        renderHTML: (attrs) => ({ "data-kind": attrs.kind }),
      },
      // Optional bold title line, drawn by CSS from data-title
      title: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-title"),
        renderHTML: (attrs) => (attrs.title ? { "data-title": attrs.title } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "callout", class: "docs-callout" }), 0];
  },
});

// Steps, cards and accordion follow the tabs pattern: titles live in a `title` attribute (edited by
// an inline input in the editor) and render as data-title. CSS draws the title on the public page.
const titleAttr = (fallback: string) => ({
  default: fallback,
  parseHTML: (el: HTMLElement) => el.getAttribute("data-title") || fallback,
  renderHTML: (attrs: Record<string, unknown>) => ({ "data-title": attrs.title || fallback }),
});

export const StepsNode = Node.create({
  name: "steps",
  group: "block",
  content: "step+",
  defining: true,
  parseHTML: () => [{ tag: 'div[data-type="steps"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "steps", class: "docs-steps" }), 0],
});

export const StepNode = Node.create({
  name: "step",
  content: "block+",
  defining: true,
  addAttributes: () => ({ title: titleAttr("Step") }),
  parseHTML: () => [{ tag: 'div[data-type="step"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "step", class: "docs-step" }), 0],
});

// Card group. `cols` (2 to 4) sets a fixed column count; without it the grid fills by width.
export const CardsNode = Node.create({
  name: "cards",
  group: "block",
  content: "card+",
  defining: true,
  addAttributes: () => ({
    cols: {
      default: null,
      parseHTML: (el: HTMLElement) => Number(el.getAttribute("data-columns")) || null,
      renderHTML: (attrs: Record<string, unknown>) => (attrs.cols ? { "data-columns": String(attrs.cols) } : {}),
    },
  }),
  parseHTML: () => [{ tag: 'div[data-type="cards"]' }],
  renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-type": "cards", class: "docs-cards" }), 0],
});

// Lucide icon names only (see docs-icons.ts); anything else, such as old emoji values, renders no icon.
const iconName = (v: unknown) => (typeof v === "string" && /^[a-z0-9-]+$/.test(v) ? v : null);
const quiet = { renderHTML: () => ({}) };

// The title is the link (stretched over the whole card by CSS), so links inside the body never nest in another <a>.
export const CardNode = Node.create({
  name: "card",
  content: "block+",
  defining: true,
  addAttributes: () => ({
    title: titleAttr("Card"),
    href: { default: null, parseHTML: (el: HTMLElement) => el.querySelector("a.docs-card-link")?.getAttribute("href") ?? null, ...quiet },
    icon: { default: null, parseHTML: (el: HTMLElement) => el.querySelector(".docs-card-icon")?.getAttribute("data-icon") ?? null, ...quiet },
    img: { default: null, parseHTML: (el: HTMLElement) => el.querySelector("img.docs-card-img")?.getAttribute("src") ?? null, ...quiet },
    cta: { default: null, parseHTML: (el: HTMLElement) => el.querySelector(".docs-card-cta")?.textContent ?? null, ...quiet },
    horizontal: { default: false, parseHTML: (el: HTMLElement) => el.classList.contains("docs-card-horizontal"), ...quiet },
  }),
  parseHTML: () => [{ tag: 'div[data-type="card"]', contentElement: ".docs-card-body" }],
  renderHTML: ({ node, HTMLAttributes }) => {
    const { title, href, icon, img, cta, horizontal } = node.attrs;
    const name = iconName(icon);
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    const label = title || "Card";
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "card", class: horizontal ? "docs-card docs-card-horizontal" : "docs-card" }),
      ...(img ? [["img", { class: "docs-card-img", src: img, alt: "", loading: "lazy" }]] : []),
      [
        "div",
        { class: "docs-card-inner" },
        ...(name ? [["span", { class: "docs-card-icon", "data-icon": name, "aria-hidden": "true" }]] : []),
        [
          "div",
          { class: "docs-card-main" },
          href
            ? ["a", { class: "docs-card-link", href }, label, ...(external ? [["span", { class: "docs-card-arrow", "aria-hidden": "true" }, "↗"]] : [])]
            : ["span", { class: "docs-card-title" }, label],
          ["div", { class: "docs-card-body" }, 0],
          ...(cta ? [["p", { class: "docs-card-cta" }, cta]] : []),
        ],
      ],
    ];
  },
});

// Published as <details>. `open` makes it start expanded; `variant: "expandable"` is the quiet
// "Show X / Hide X" style. Title is the <summary>.
export const AccordionNode = Node.create({
  name: "accordion",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes: () => ({
    title: titleAttr("Question"),
    open: { default: false, parseHTML: (el: HTMLElement) => el.hasAttribute("open"), ...quiet },
    variant: { default: "accordion", parseHTML: (el: HTMLElement) => (el.classList.contains("docs-expandable") ? "expandable" : "accordion"), ...quiet },
  }),
  parseHTML: () => [{ tag: 'details[data-type="accordion"]', contentElement: ".docs-accordion-body" }],
  renderHTML: ({ node, HTMLAttributes }) => [
    "details",
    mergeAttributes(HTMLAttributes, {
      "data-type": "accordion",
      class: node.attrs.variant === "expandable" ? "docs-expandable" : "docs-accordion",
      ...(node.attrs.open ? { open: "" } : {}),
    }),
    ["summary", {}, node.attrs.title || "Question"],
    ["div", { class: "docs-accordion-body" }, 0],
  ],
});

// Image or video in a soft frame with an optional caption (Pangolin's <Frame>). Only http(s) and
// site-relative URLs are rendered.
const safeSrc = (v: unknown) => (typeof v === "string" && /^(https?:\/\/|\/)/.test(v) ? v : null);

export const FrameNode = Node.create({
  name: "frame",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes: () => ({
    src: { default: null, parseHTML: (el: HTMLElement) => el.querySelector("img, video")?.getAttribute("src") ?? null, ...quiet },
    kind: { default: "image", parseHTML: (el: HTMLElement) => (el.querySelector("video") ? "video" : "image"), ...quiet },
    alt: { default: "", parseHTML: (el: HTMLElement) => el.querySelector("img")?.getAttribute("alt") ?? "", ...quiet },
    hint: { default: null, parseHTML: (el: HTMLElement) => el.querySelector("figcaption")?.textContent ?? null, ...quiet },
  }),
  parseHTML: () => [{ tag: 'figure[data-type="frame"]' }],
  renderHTML: ({ node, HTMLAttributes }) => {
    const { kind, alt, hint } = node.attrs;
    const src = safeSrc(node.attrs.src);
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-type": "frame", class: "docs-frame" }),
      [
        "div",
        { class: "docs-frame-inner" },
        ...(src
          ? [kind === "video" ? ["video", { src, controls: "", playsinline: "" }] : ["img", { src, alt: alt || "", loading: "lazy" }]]
          : []),
      ],
      ...(hint ? [["figcaption", {}, hint]] : []),
    ];
  },
});
