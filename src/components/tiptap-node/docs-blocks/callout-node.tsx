"use client"

import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { CALLOUT_KINDS, CalloutNode, type CalloutKind } from "@/lib/docs-blocks"
import "./docs-blocks.css"

const LABELS: Record<CalloutKind, string> = { note: "Note", tip: "Tip", warning: "Warning" }

function CalloutView({ node, updateAttributes }: NodeViewProps) {
  const kind = node.attrs.kind as CalloutKind
  return (
    <NodeViewWrapper className="docs-callout" data-type="callout" data-kind={kind}>
      <div className="docs-callout-kind" contentEditable={false} role="group" aria-label="Callout type">
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
      </div>
      <NodeViewContent className="docs-callout-body" />
    </NodeViewWrapper>
  )
}

export const CalloutNodeClient = CalloutNode.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})
