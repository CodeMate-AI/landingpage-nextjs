"use client";

import { useEffect, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { getActiveFontFamily } from "@/lib/tiptap-font-family";
import { AVAILABLE_FONTS, DEFAULT_FONT, getFontOption, FontOption } from "@/lib/fonts-config";

export interface UseFontDropdownMenuConfig {
  editor?: Editor | null;
  baseFont?: string | null;
}

export function useFontDropdownMenu(config?: UseFontDropdownMenuConfig) {
  const { editor: providedEditor, baseFont } = config || {};
  const { editor } = useTiptapEditor(providedEditor);

  const [activeFontKey, setActiveFontKey] = useState<string | null>(null);

  const updateActiveFont = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setActiveFontKey(null);
      return;
    }
    const font = getActiveFontFamily(editor);
    setActiveFontKey(font);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    updateActiveFont();
    editor.on("selectionUpdate", updateActiveFont);
    editor.on("transaction", updateActiveFont);

    return () => {
      editor.off("selectionUpdate", updateActiveFont);
      editor.off("transaction", updateActiveFont);
    };
  }, [editor, updateActiveFont]);

  // Resolves the currently active FontOption or defaults to baseFont/default font
  const activeFontOption: FontOption = activeFontKey
    ? getFontOption(activeFontKey)
    : baseFont
    ? getFontOption(baseFont)
    : DEFAULT_FONT;

  const applyFontToSelection = useCallback(
    (font: FontOption) => {
      if (!editor || editor.isDestroyed) return;
      if (font.isDefault) {
        editor.chain().focus().unsetFontFamily().run();
      } else {
        editor.chain().focus().setFontFamily(font.fontKey).run();
      }
      updateActiveFont();
    },
    [editor, updateActiveFont]
  );

  const clearFontFromSelection = useCallback(() => {
    if (!editor || editor.isDestroyed) return;
    editor.chain().focus().unsetFontFamily().run();
    updateActiveFont();
  }, [editor, updateActiveFont]);

  return {
    editor,
    activeFontKey,
    activeFontOption,
    fonts: AVAILABLE_FONTS,
    canToggle: Boolean(editor && editor.isEditable),
    applyFontToSelection,
    clearFontFromSelection,
  };
}

