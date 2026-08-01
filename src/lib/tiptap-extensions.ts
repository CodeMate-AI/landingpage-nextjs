import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Node } from "@tiptap/core";
import { TaskList, TaskItem } from "@tiptap/extension-list";

/**
 * Server-safe video node — no ReactNodeViewRenderer.
 * renderHTML outputs <p>[video: URL]</p> which the blog page's
 * formatVideos() post-processor converts to a real <video> element.
 */
const VideoNodeServer = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const text = element.textContent?.trim() ?? "";
          const match = text.match(/^\[video:\s*(.+)\]$/);
          if (!match) return false;
          return { src: match[1].trim() };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const src = (node.attrs.src as string) || "";
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

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Link.configure({
    protocols: ["http", "https", "mailto"],
    HTMLAttributes: {
      class: "blog-link",
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "blog-image",
    },
  }),
  Placeholder.configure({
    placeholder: "Write something amazing...",
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  VideoNodeServer,
  VideoUploadNodeServer,
];
