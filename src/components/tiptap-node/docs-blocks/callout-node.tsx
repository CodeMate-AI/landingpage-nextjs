"use client"

import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { CALLOUT_KINDS, CalloutNode, type CalloutKind } from "@/lib/docs-blocks"
import { NodeCloseButton } from "@/components/tiptap-node/node-close-button"
// Labelled body area shared by all blocks
import { BodyField } from "./body-field"
import "./docs-blocks.css"

const LABELS: Record<CalloutKind, string> = { note: "Note", info: "Info", tip: "Tip", warning: "Warning", check: "Check", danger: "Danger" }
// Body hint per type, so the writer sees what each callout is for
const HINTS: Record<CalloutKind, string> = {
  note: "Add a side note for readers...",
  info: "Share useful background information...",
  tip: "Suggest a shortcut or better way...",
  warning: "Describe what could go wrong...",
  check: "Confirm what the reader should see when it worked...",
  danger: "Explain the risk, such as data loss...",
}

function CalloutView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const kind = node.attrs.kind as CalloutKind
  return (
    <NodeViewWrapper className="docs-callout" data-type="callout" data-kind={kind} data-title={node.attrs.title ?? ""}>
      <div className="docs-callout-kind" contentEditable={false} role="group" aria-label="Callout type">
        <input
          className="docs-callout-title-input"
          value={node.attrs.title ?? ""}
          placeholder="Title (optional)"
          aria-label="Callout title"
          onChange={(e) => updateAttributes({ title: e.target.value || null })}
        />
        {CALLOUT_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={k === kind}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => updateAttributes({ kind: k })}
          >
            {LABELS[k]}
          </button>
        ))}
        <NodeCloseButton inline label="Remove callout" onClick={deleteNode} />
      </div>
      <BodyField label="Message" placeholder={HINTS[kind] ?? HINTS.note} className="docs-callout-body" />
    </NodeViewWrapper>
  )
}

export const CalloutNodeClient = CalloutNode.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})
