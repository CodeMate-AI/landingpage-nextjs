import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

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
];
