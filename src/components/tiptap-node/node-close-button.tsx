"use client"

import { useEffect, useState } from "react"
import { CloseIcon } from "@/components/tiptap-icons/close-icon"
import "./node-close-button.css"

// The one remove control for editor blocks. By default it sits in the top-right corner (the wrapper must carry
// the `tiptap-node-closable` class); `inline` puts the same button in a toolbar row, for items inside a block.
// When onClick returns true it needs a second click: the button turns into "Remove block?" (no native dialog,
// which the desktop app's browser blocks) and asks again, with `confirmed` set, on the next click.
export function NodeCloseButton({
  onClick,
  label,
  inline = false,
}: {
  onClick: (confirmed: boolean) => boolean | void
  label: string
  inline?: boolean
}) {
  const [armed, setArmed] = useState(false)
  // An armed button falls back to a plain × after a few seconds
  useEffect(() => {
    if (!armed) return
    const t = window.setTimeout(() => setArmed(false), 4000)
    return () => window.clearTimeout(t)
  }, [armed])

  const base = inline ? "tiptap-node-close tiptap-node-close--inline" : "tiptap-node-close"
  return (
    <button
      type="button"
      className={armed ? `${base} tiptap-node-close--armed` : base}
      aria-label={armed ? "Click again to remove the whole block" : label}
      title={armed ? "Click again to remove the whole block" : label}
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick(armed) === true) setArmed(true)
        else setArmed(false)
      }}
    >
      {armed ? <span className="tiptap-node-close-text">Remove block?</span> : <CloseIcon className="tiptap-node-close-icon" />}
    </button>
  )
}
