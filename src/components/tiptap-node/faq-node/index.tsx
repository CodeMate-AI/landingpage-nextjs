"use client"

import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { FaqItemNode, FaqNode } from "@/lib/faq-blocks"
import { NodeCloseButton } from "@/components/tiptap-node/node-close-button"
import "./faq-node.css"
// Labelled body area and the remove-or-remove-block helper shared with the docs blocks
import { BodyField, removeItem } from "@/components/tiptap-node/docs-blocks/body-field"
import "@/components/tiptap-node/docs-blocks/docs-blocks.css"

const keepFocus = (e: React.MouseEvent) => e.preventDefault()

// Whole FAQ block: optional section title, the questions, "+ Add question" and a remove control for the block
function FaqView({ node, getPos, editor, updateAttributes, deleteNode }: NodeViewProps) {
  const add = () => {
    const pos = getPos()
    if (pos == null) return
    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize - 1, { type: "faqItem", attrs: { title: "" }, content: [{ type: "paragraph" }] })
      .run()
  }
  return (
    <NodeViewWrapper className="faq-edit tiptap-node-closable" data-type="faq">
      <NodeCloseButton label="Remove FAQ" onClick={deleteNode} />
      <div contentEditable={false}>
        <input
          className="faq-edit-title"
          value={node.attrs.title ?? ""}
          placeholder="Section title (optional)"
          aria-label="FAQ section title"
          onChange={(e) => updateAttributes({ title: e.target.value })}
        />
      </div>
      <NodeViewContent className="faq-edit-body" />
      <button type="button" className="faq-edit-add" contentEditable={false} onMouseDown={keepFocus} onClick={add}>
        + Add question
      </button>
    </NodeViewWrapper>
  )
}

// One question: badge, question input, remove, labelled answer
function FaqItemView({ node, getPos, editor, updateAttributes }: NodeViewProps) {
  // The last question asks before removing the whole FAQ block
  const remove = (confirmed: boolean) => removeItem({ editor, getPos, node }, confirmed)
  return (
    <NodeViewWrapper className="faq-edit-item" data-type="faq-item">
      <div className="faq-edit-head" contentEditable={false}>
        <span className="faq-edit-badge" aria-hidden="true">+</span>
        <input
          className="faq-edit-question"
          value={node.attrs.title ?? ""}
          placeholder="Question"
          aria-label="Question"
          onChange={(e) => updateAttributes({ title: e.target.value })}
        />
        <NodeCloseButton inline label="Remove question" onClick={remove} />
      </div>
      <BodyField label="Answer" placeholder="Write the answer readers will see..." className="faq-edit-answer" />
    </NodeViewWrapper>
  )
}

export const FaqNodeClient = FaqNode.extend({ addNodeView: () => ReactNodeViewRenderer(FaqView) })
export const FaqItemNodeClient = FaqItemNode.extend({ addNodeView: () => ReactNodeViewRenderer(FaqItemView) })
