"use client"

import { CloseIcon } from "@/components/tiptap-icons/close-icon"
import "./node-close-button.css"

// The one remove control for editor blocks. By default it sits in the top-right corner (the wrapper must carry
// the `tiptap-node-closable` class); `inline` puts the same button in a toolbar row, for items inside a block.
export function NodeCloseButton({ onClick, label, inline = false }: { onClick: () => void; label: string; inline?: boolean }) {
  return (
    <button
      type="button"
      className={inline ? "tiptap-node-close tiptap-node-close--inline" : "tiptap-node-close"}
      aria-label={label}
      title={label}
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <CloseIcon className="tiptap-node-close-icon" />
    </button>
  )
}
