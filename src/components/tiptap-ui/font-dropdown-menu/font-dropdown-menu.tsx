"use client";

import { forwardRef, useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon";
import { FontFamilyIcon } from "@/components/tiptap-icons/font-family-icon";
import { CheckIcon } from "@/components/tiptap-icons/check-icon";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { useFontDropdownMenu } from "./use-font-dropdown-menu";

// --- Config ---
import { AVAILABLE_FONTS, DEFAULT_FONT, getFontOption, FontOption } from "@/lib/fonts-config";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/tiptap-ui-primitive/dropdown-menu";

export interface FontDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  baseFont?: string | null;
  onBaseFontChange?: (fontKey: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  modal?: boolean;
}

export const FontDropdownMenu = forwardRef<HTMLButtonElement, FontDropdownMenuProps>(
  (
    {
      editor: providedEditor,
      baseFont = "Montserrat",
      onBaseFontChange,
      onOpenChange,
      modal = false,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);

    const {
      activeFontKey,
      activeFontOption,
      fonts,
      canToggle,
      applyFontToSelection,
      clearFontFromSelection,
    } = useFontDropdownMenu({ editor, baseFont });

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!editor || !canToggle) return;
        setIsOpen(open);
        onOpenChange?.(open);
      },
      [canToggle, editor, onOpenChange]
    );

    const currentBaseOption = getFontOption(baseFont);

    // Determine short display label for the toolbar button trigger
    const triggerLabel = activeFontKey
      ? activeFontOption.fontKey
      : baseFont && baseFont !== DEFAULT_FONT.fontKey
      ? currentBaseOption.fontKey
      : "Font";

    const handleSelectFont = (font: FontOption) => {
      applyFontToSelection(font);
    };

    const handleApplyBaseFont = (font: FontOption, e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (onBaseFontChange) {
        onBaseFontChange(font.fontKey);
      }
    };

    if (!canToggle && !editor) {
      return null;
    }

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="Format font family"
            tooltip="Font Family"
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 px-2 text-xs font-medium text-neutral-300 hover:text-white"
            {...buttonProps}
            ref={ref}
          >
            {children ? (
              children
            ) : (
              <>
                <FontFamilyIcon className="tiptap-button-icon" />
                <span className="tiptap-button-text max-w-[85px] truncate text-left">
                  {triggerLabel}
                </span>
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-64 max-h-[420px] overflow-y-auto p-1.5 bg-[#18181b] border border-[#27272a] shadow-2xl rounded-lg text-neutral-200"
        >
          {/* Header section with current article base font indicator */}
          <DropdownMenuLabel className="px-2 py-1.5 text-xs">
            <div className="font-semibold text-white">Font Family</div>
            <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center justify-between">
              <span>Article Base:</span>
              <span className="font-medium text-blue-400 truncate max-w-[120px]">
                {currentBaseOption.name}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[#27272a] my-1" />

          {/* List of 8 Google Fonts with Montserrat (Default) at the top */}
          <DropdownMenuGroup>
            {fonts.map((font) => {
              const isSelectedTextFont = activeFontOption.id === font.id;
              const isCurrentBase = currentBaseOption.id === font.id;

              return (
                <DropdownMenuItem
                  key={font.id}
                  onSelect={() => handleSelectFont(font)}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between px-2 py-2 rounded text-sm cursor-pointer transition select-none outline-none ${
                    isSelectedTextFont
                      ? "bg-blue-600/20 text-blue-300 font-semibold"
                      : "hover:bg-[#27272a] text-neutral-200 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {isSelectedTextFont ? (
                      <CheckIcon className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <span className="w-4 h-4 shrink-0" />
                    )}
                    <span
                      style={{ fontFamily: font.family }}
                      className="truncate text-[13px]"
                    >
                      {font.name}
                    </span>
                  </div>

                  <div className="flex items-center shrink-0">
                    {isCurrentBase ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-950/70 border border-blue-700/50 px-1.5 py-0.5 rounded">
                        Base
                      </span>
                    ) : onBaseFontChange ? (
                      <button
                        type="button"
                        onClick={(e) => handleApplyBaseFont(font, e)}
                        onMouseDown={(e) => e.preventDefault()}
                        title={`Apply ${font.fontKey} to entire article`}
                        className="text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-800 px-1.5 py-0.5 rounded border border-transparent hover:border-neutral-700 transition"
                      >
                        Set Base
                      </button>
                    ) : null}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-[#27272a] my-1.5" />

          {/* Bottom actions: Apply current active font to whole article or reset to default */}
          <div className="px-1 py-1 space-y-1">
            {onBaseFontChange && activeFontOption.id !== currentBaseOption.id && (
              <button
                type="button"
                onClick={(e) => handleApplyBaseFont(activeFontOption, e)}
                onMouseDown={(e) => e.preventDefault()}
                className="w-full text-left text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 px-2 py-1.5 rounded transition flex items-center justify-between"
              >
                <span>Apply &quot;{activeFontOption.fontKey}&quot; to entire article</span>
                <span className="text-[10px] text-blue-500 font-mono">Whole Post</span>
              </button>
            )}

            {onBaseFontChange && currentBaseOption.id !== DEFAULT_FONT.id && (
              <button
                type="button"
                onClick={(e) => handleApplyBaseFont(DEFAULT_FONT, e)}
                onMouseDown={(e) => e.preventDefault()}
                className="w-full text-left text-xs text-neutral-400 hover:text-neutral-200 hover:bg-[#27272a] px-2 py-1.5 rounded transition"
              >
                Reset article font to Montserrat (Default)
              </button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

FontDropdownMenu.displayName = "FontDropdownMenu";

export default FontDropdownMenu;

