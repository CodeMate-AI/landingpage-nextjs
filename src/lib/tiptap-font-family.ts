import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import type { Editor } from "@tiptap/core";
import { getFontCssValue, getFontOption } from "./fonts-config";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontFamily: {
      /** Set the font family for the current selection or next typed text */
      setFontFamily: (fontFamily: string) => ReturnType;
      /** Unset/clear the font family mark for the current selection */
      unsetFontFamily: () => ReturnType;
    };
  }
}

/**
 * Custom TextStyle Mark that serializes inline typography into semantic span style tags.
 */
export const TextStyleMark = Mark.create({
  name: "textStyle",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: (element) => {
          const raw = element.style.fontFamily;
          if (!raw) return null;
          return getFontOption(raw).fontKey;
        },
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {};
          }
          return {
            style: `font-family: ${getFontCssValue(attributes.fontFamily)};`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return element.style.fontFamily ? {} : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
});

/**
 * Custom TipTap extension exposing commands to apply or clear font family marks.
 */
export const FontFamilyExtension = Extension.create({
  name: "fontFamily",

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontFamily }).run();
        },
      unsetFontFamily:
        () =>
        ({ chain }) => {
          return chain().unsetMark("textStyle").run();
        },
    };
  },
});

/**
 * Returns the currently active font family string at the editor's cursor / selection.
 */
export function getActiveFontFamily(editor: Editor | null | undefined): string | null {
  if (!editor || editor.isDestroyed) return null;
  const attrs = editor.getAttributes("textStyle");
  return (attrs?.fontFamily as string) || null;
}

