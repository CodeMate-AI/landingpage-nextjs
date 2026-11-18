"use client"

import { CloseIcon } from "@/components/tiptap-icons/close-icon"
import "./node-close-button.css"

// Top-right cross for editor blocks. The wrapper must carry the `tiptap-node-closable` class.
export function NodeCloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className="tiptap-node-close"
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
