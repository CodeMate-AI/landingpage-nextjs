"use client"

import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { TabNode, TabsNode } from "@/lib/docs-blocks"
import { NodeCloseButton } from "@/components/tiptap-node/node-close-button"
import "./docs-blocks.css"

function TabsView({ node, getPos, editor }: NodeViewProps) {
  const addTab = () => {
    const pos = getPos()
    if (pos == null) return
    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize - 1, {
        type: "tab",
        attrs: { title: `Tab ${node.childCount + 1}` },
        content: [{ type: "paragraph" }],
      })
      .run()
  }

  return (
    <NodeViewWrapper className="docs-tabs" data-type="tabs">
      <NodeViewContent className="docs-tabs-body" />
      <button type="button" className="docs-tabs-add" contentEditable={false} onMouseDown={(e) => e.preventDefault()} onClick={addTab}>
        + Add tab
      </button>
    </NodeViewWrapper>
  )
}

function TabView({ node, getPos, editor, updateAttributes }: NodeViewProps) {
  const removeTab = () => {
    const pos = getPos()
    if (pos == null) return
    // A tabs block needs at least one tab
    if (editor.state.doc.resolve(pos).parent.childCount < 2) return
    editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
  }

  return (
    <NodeViewWrapper className="docs-tab docs-tab-edit" data-type="tab">
      <div className="docs-tab-head" contentEditable={false}>
        <input
          className="docs-tab-title-input"
          value={node.attrs.title ?? ""}
          placeholder="Tab title"
          aria-label="Tab title"
          onChange={(e) => updateAttributes({ title: e.target.value })}
        />
        <NodeCloseButton inline label="Remove tab" onClick={removeTab} />
      </div>
      <NodeViewContent className="docs-tab-body" />
    </NodeViewWrapper>
  )
}

export const TabsNodeClient = TabsNode.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TabsView)
  },
})

export const TabNodeClient = TabNode.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TabView)
  },
})
