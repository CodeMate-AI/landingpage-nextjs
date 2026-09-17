"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import {
  findNodePosition,
  getSelectedBlockNodes,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes,
} from "@/lib/tiptap-utils"

// --- Icons ---
import { CodeBlockIcon } from "@/components/tiptap-icons/code-block-icon"

export const CODE_BLOCK_SHORTCUT_KEY = "mod+alt+c"

/**
 * Configuration for the code block functionality
 */
export interface UseCodeBlockConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when code block is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful code block toggle.
   */
  onToggled?: () => void
}

/**
 * Checks if code block can be toggled in the current editor state
 */
export function canToggle(
  editor: Editor | null,
  turnInto: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isNodeInSchema("codeBlock", editor) ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  if (!turnInto) {
    return editor.can().toggleNode("codeBlock", "paragraph")
  }

  // Ensure selection is in nodes we're allowed to convert
  if (
    !selectionWithinConvertibleTypes(editor, [
      "paragraph",
      "heading",
      "bulletList",
      "orderedList",
      "taskList",
      "blockquote",
      "codeBlock",
    ])
  )
    return false

  // Either we can toggle code block directly on the selection,
  // or we can clear formatting/nodes to arrive at a code block.
  return (
    editor.can().toggleNode("codeBlock", "paragraph") ||
    editor.can().clearNodes()
  )
}

/**
 * Toggles code block in the editor
 */
export function toggleCodeBlock(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggle(editor)) return false

  try {
    const view = editor.view
    const state = view.state
    let tr = state.tr

    // Case 1: Code block is currently active -> Convert back to paragraphs
    if (editor.isActive("codeBlock")) {
      const { doc, selection } = state
      const { from, to } = selection
      const codeBlocksToConvert: { pos: number; node: any }[] = []

      doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === "codeBlock") {
          codeBlocksToConvert.push({ pos, node })
          return false
        }
      })

      if (codeBlocksToConvert.length === 0) {
        // Find ancestor code block if selection is inside
        const $anchor = selection.$anchor
        for (let d = $anchor.depth; d > 0; d--) {
          const ancestor = $anchor.node(d)
          if (ancestor.type.name === "codeBlock") {
            codeBlocksToConvert.push({ pos: $anchor.before(d), node: ancestor })
            break
          }
        }
      }

      if (codeBlocksToConvert.length > 0) {
        // Iterate backwards to maintain position validity
        for (let i = codeBlocksToConvert.length - 1; i >= 0; i--) {
          const { pos, node } = codeBlocksToConvert[i]
          const text = node.textContent || ""
          const lines = text.split("\n")
          const paragraphNodes = lines.map((line: string) =>
            line
              ? state.schema.nodes.paragraph.create(null, state.schema.text(line))
              : state.schema.nodes.paragraph.create()
          )
          tr = tr.replaceWith(pos, pos + node.nodeSize, paragraphNodes)
        }
        view.dispatch(tr)
        editor.chain().focus().run()
        return true
      }

      return editor.chain().focus().setNode("paragraph").run()
    }

    // Case 2: Code block is not active -> Merge selected blocks into ONE unified codeBlock
    const { doc, selection } = state
    const { from, to } = selection

    const $from = doc.resolve(from)
    const $to = doc.resolve(to)

    // Determine the top-level block boundaries for the selected range
    let commonDepth = $from.depth
    while (commonDepth > 0 && $from.node(commonDepth) !== $to.node(commonDepth)) {
      commonDepth--
    }

    const blockDepth = commonDepth === 0 ? 1 : commonDepth
    const startPos = $from.before(blockDepth)
    const endPos = $to.after(blockDepth)

    const lines: string[] = []
    doc.nodesBetween(startPos, endPos, (node) => {
      if (node.isTextblock) {
        lines.push(node.textContent || "")
        return false
      }
      return true
    })

    const combinedText = lines.join("\n")
    const codeBlockNode = state.schema.nodes.codeBlock.create(
      null,
      combinedText ? state.schema.text(combinedText) : null
    )

    tr = tr.replaceWith(startPos, endPos, codeBlockNode)
    const targetPos = Math.min(startPos + 1 + combinedText.length, tr.doc.content.size)
    const $resolved = tr.doc.resolve(targetPos)
    tr = tr.setSelection(TextSelection.near($resolved))
    view.dispatch(tr)
    editor.chain().focus().run()

    return true
  } catch {
    return false
  }
}

/**
 * Determines if the code block button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor) return false

  if (!hideWhenUnavailable) {
    return true
  }

  if (!editor.isEditable) return false

  if (!isNodeInSchema("codeBlock", editor)) return false

  if (!editor.isActive("code")) {
    return canToggle(editor)
  }

  return true
}

/**
 * Custom hook that provides code block functionality for Tiptap editor
 *
 * @example
 * ```tsx
 * // Simple usage - no params needed
 * function MySimpleCodeBlockButton() {
 *   const { isVisible, isActive, handleToggle } = useCodeBlock()
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <button
 *       onClick={handleToggle}
 *       aria-pressed={isActive}
 *     >
 *       Code Block
 *     </button>
 *   )
 * }
 *
 * // Advanced usage with configuration
 * function MyAdvancedCodeBlockButton() {
 *   const { isVisible, isActive, handleToggle, label } = useCodeBlock({
 *     editor: myEditor,
 *     hideWhenUnavailable: true,
 *     onToggled: (isActive) => console.log('Code block toggled:', isActive)
 *   })
 *
 *   if (!isVisible) return null
 *
 *   return (
 *     <MyButton
 *       onClick={handleToggle}
 *       aria-label={label}
 *       aria-pressed={isActive}
 *     >
 *       Toggle Code Block
 *     </MyButton>
 *   )
 * }
 * ```
 */
export function useCodeBlock(config?: UseCodeBlockConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canToggleState = canToggle(editor)
  const isActive = editor?.isActive("codeBlock") || false

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleToggle = useCallback(() => {
    if (!editor) return false

    const success = toggleCodeBlock(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle: canToggleState,
    label: "Code Block",
    shortcutKeys: CODE_BLOCK_SHORTCUT_KEY,
    Icon: CodeBlockIcon,
  }
}
