import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Node } from "@tiptap/core";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { MarkdownRulesExtension } from "./tiptap-markdown-rules";

/**
 * Server-safe video node — no ReactNodeViewRenderer.
 * renderHTML outputs <p>[video: URL | caption: TEXT]</p> or <p>[video: URL]</p>
 * which formatVideos() converts to an embed or <figure> on the reader page.
 */
const VideoNodeServer = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const text = element.textContent?.trim() ?? "";
          const match = text.match(/^\[video:\s*([\s\S]+?)\]$/i);
          if (!match) return false;
          const fullPayload = match[1].trim();
          const capMatch = fullPayload.match(/^([\s\S]*?)\s*\|\s*caption:[ ]?([\s\S]*)$/i);
          if (capMatch) {
            return {
              src: capMatch[1].trim(),
              caption: capMatch[2],
            };
          }
          return { src: fullPayload, caption: "" };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const src = (node.attrs.src as string) || "";
    const caption = (node.attrs.caption as string) || "";
    if (caption && caption.trim().length > 0) {
      return ["p", {}, `[video: ${src} | caption: ${caption}]`];
    }
    return ["p", {}, `[video: ${src}]`];
  },
});

/**
 * Server-safe videoUpload stub — renders as an empty paragraph so
 * generateHTML doesn't throw "Unknown node type: videoUpload".
 */
const VideoUploadNodeServer = Node.create({
  name: "videoUpload",
  group: "block",
  atom: true,

  parseHTML() {
    return [{ tag: "div[data-type='videoUpload']" }];
  },

  renderHTML() {
    return ["p", {}];
  },
});

/**
 * Server-safe gifUpload stub — renders as an empty paragraph.
 */
const GifUploadNodeServer = Node.create({
  name: "gifUpload",
  group: "block",
  atom: true,

  parseHTML() {
    return [{ tag: "div[data-type='gif-upload']" }];
  },

  renderHTML() {
    return ["p", {}];
  },
});

/**
 * Server-safe image node for headless generateHTML compilation.
 * Renders semantic <figure class="blog-media-figure"> with <figcaption class="blog-media-caption">
 * when caption is present, or clean figure without caption.
 */
const ImageNodeServer = Node.create({
  name: "image",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      caption: {
        default: "",
        parseHTML: (element) => {
          if (element.getAttribute("data-caption")) {
            return element.getAttribute("data-caption");
          }
          const figcaption = element.closest("figure")?.querySelector("figcaption");
          return figcaption?.textContent || "";
        },
        renderHTML: (attributes) => {
          return attributes.caption ? { "data-caption": attributes.caption } : {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure:has(img)",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const img = element.querySelector("img");
          if (!img) return false;
          const figcaption = element.querySelector("figcaption");
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            caption: figcaption ? (figcaption.textContent || "") : (img.getAttribute("data-caption") || ""),
          };
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
            caption: element.getAttribute("data-caption") || "",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const caption = (node.attrs.caption as string) || "";
    if (caption && caption.trim().length > 0) {
      return [
        "figure",
        { class: "blog-media-figure" },
        ["img", { ...HTMLAttributes, src: node.attrs.src, alt: node.attrs.alt || "", loading: "lazy", class: "blog-image" }],
        ["figcaption", { class: "blog-media-caption" }, caption],
      ];
    }
    return [
      "figure",
      { class: "blog-media-figure" },
      ["img", { ...HTMLAttributes, src: node.attrs.src, alt: node.attrs.alt || "", loading: "lazy", class: "blog-image" }],
    ];
  },
});

/**
 * Server-safe referenceBlogs node for headless generateHTML compilation.
 * Outputs a div container with data attributes, which formatReferenceBlogs() in
 * blog-compiler.ts post-processes into clean semantic HTML.
 */
const ReferenceBlogsNodeServer = Node.create({
  name: "referenceBlogs",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      heading: { default: "Writing" },
      showBottomLink: { default: true },
      bottomLinkText: { default: "Read the blog" },
      bottomLinkUrl: { default: "/blog" },
      blogs: { default: [] },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='reference-blogs']",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          let blogs: any[] = [];
          const rawBlogs = element.getAttribute("data-blogs");
          if (rawBlogs) {
            try {
              blogs = JSON.parse(rawBlogs);
            } catch {
              blogs = [];
            }
          }
          return {
            heading: element.getAttribute("data-heading") || "Writing",
            showBottomLink: element.getAttribute("data-show-bottom") !== "false",
            bottomLinkText: element.getAttribute("data-bottom-text") || "Read the blog",
            bottomLinkUrl: element.getAttribute("data-bottom-url") || "/blog",
            blogs,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const heading = (node.attrs.heading as string) || "Writing";
    const showBottomLink = String(node.attrs.showBottomLink ?? true);
    const bottomLinkText = (node.attrs.bottomLinkText as string) || "Read the blog";
    const bottomLinkUrl = (node.attrs.bottomLinkUrl as string) || "/blog";
    const blogs = Array.isArray(node.attrs.blogs) ? node.attrs.blogs : [];

    return [
      "div",
      {
        "data-type": "reference-blogs",
        "data-heading": heading,
        "data-show-bottom": showBottomLink,
        "data-bottom-text": bottomLinkText,
        "data-bottom-url": bottomLinkUrl,
        "data-blogs": JSON.stringify(blogs),
      },
    ];
  },
});

const CustomTaskList = TaskList.extend({
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51,
      },
      {
        tag: "ul.contains-task-list",
        priority: 51,
      },
      {
        tag: "ul.task-list",
        priority: 51,
      },
    ];
  },
});

const CustomTaskItem = TaskItem.extend({
  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51,
      },
      {
        tag: "li.task-list-item",
        priority: 51,
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const checkbox = element.querySelector<HTMLInputElement>('input[type="checkbox"]');
          const dataChecked = element.getAttribute("data-checked");
          return {
            checked: checkbox?.checked || dataChecked === "" || dataChecked === "true",
          };
        },
      },
      {
        tag: "li",
        priority: 51,
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const checkbox = element.querySelector<HTMLInputElement>('input[type="checkbox"]');
          if (checkbox) {
            return { checked: checkbox.checked };
          }
          return false;
        },
      },
    ];
  },
}).configure({
  nested: true,
});

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
    },
    link: false,
  }),
  Link.configure({
    protocols: ["http", "https", "mailto"],
    HTMLAttributes: {
      class: "blog-link",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  ImageNodeServer,
  Placeholder.configure({
    placeholder: "Write something amazing...",
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  CustomTaskList,
  CustomTaskItem,
  Highlight.configure({
    multicolor: true,
  }),
  Subscript,
  Superscript,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Typography,
  MarkdownRulesExtension,
  VideoNodeServer,
  VideoUploadNodeServer,
  GifUploadNodeServer,
  ReferenceBlogsNodeServer,
];
