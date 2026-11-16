import { Node, mergeAttributes } from "@tiptap/core";

// Server-safe docs block definitions (no React). Used by generateHTML on the public page and,
// extended with node views, by the docs editor. Blog documents never contain these nodes.

export const CALLOUT_KINDS = ["note", "tip", "warning"] as const;
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
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "callout", class: "docs-callout" }), 0];
  },
});
