"use client"

import type { CSSProperties } from "react"
import { NodeViewContent, type NodeViewProps } from "@tiptap/react"

// Labelled writing area for a block's body text, with grey hint text while it is empty (shared by every docs block and the FAQ)
export function BodyField({ label, placeholder, className }: { label: string; placeholder: string; className: string }) {
  // The hint is passed as a CSS string so the empty paragraph can show it with ::before
  const style = { "--docs-ph": JSON.stringify(placeholder) } as CSSProperties
  return (
    <div className="docs-field" style={style}>
      <span className="docs-field-label" contentEditable={false}>
        {label}
      </span>
      <NodeViewContent className={className} />
    </div>
  )
}

// Removes one item of a block (card, step, tab, question). The last one returns true until `confirmed`,
// so NodeCloseButton shows its inline "Remove block?" step; then the whole block goes.
export function removeItem({ editor, getPos, node }: Pick<NodeViewProps, "editor" | "getPos" | "node">, confirmed: boolean): boolean {
  const pos = getPos()
  if (pos == null) return false
  const $pos = editor.state.doc.resolve(pos)
  if ($pos.parent.childCount > 1) {
    editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
    return false
  }
  if (!confirmed) return true
  const start = $pos.before()
  editor.chain().focus().deleteRange({ from: start, to: start + $pos.parent.nodeSize }).run()
  return false
}
