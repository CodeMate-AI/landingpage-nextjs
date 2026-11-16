"use client"

import { Button } from "@/components/tiptap-ui-primitive/button"
import { ToolbarGroup } from "@/components/tiptap-ui-primitive/toolbar"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { CALLOUT_KINDS, type CalloutKind } from "@/lib/docs-blocks"

const group = (type: string, item: string, label: string, extra = {}) => ({
  type,
  content: [1, 2].map((n) => ({ type: item, attrs: { title: `${label} ${n}`, ...extra }, content: [{ type: "paragraph" }] })),
})

const INSERTS: [string, object][] = [
  ["Tabs", group("tabs", "tab", "Tab")],
  ["Steps", group("steps", "step", "Step")],
  ["Cards", group("cards", "card", "Card", { href: null })],
  ["Media", { type: "frame" }],
  ["Accordion", { type: "accordion", attrs: { title: "Question" }, content: [{ type: "paragraph" }] }],
]

// Docs-only toolbar row. Rendered by SimpleEditor only when `docsBlocks` is set.
export function DocsBlocksToolbar() {
  const { editor } = useTiptapEditor()

  const toggleCallout = (kind: CalloutKind) => {
    if (!editor) return
    if (editor.isActive("callout")) {
      editor.chain().focus().updateAttributes("callout", { kind }).run()
    } else {
      editor.chain().focus().wrapIn("callout", { kind }).run()
    }
  }

  return (
    <ToolbarGroup>
      {CALLOUT_KINDS.map((kind) => (
        <Button
          key={kind}
          type="button"
          variant="ghost"
          data-active-state={editor?.isActive("callout", { kind }) ? "on" : "off"}
          onClick={() => toggleCallout(kind)}
          onMouseDown={(e) => e.preventDefault()}
          title={`Callout: ${kind}`}
          tooltip={`Callout: ${kind}`}
        >
          <span className="tiptap-button-text">{kind[0].toUpperCase() + kind.slice(1)}</span>
        </Button>
      ))}
      {INSERTS.map(([label, content]) => (
        <Button
          key={label}
          type="button"
          variant="ghost"
          onClick={() => editor?.chain().focus().insertContent(content).run()}
          onMouseDown={(e) => e.preventDefault()}
          title={`Insert ${label.toLowerCase()}`}
          tooltip={`Insert ${label.toLowerCase()}`}
        >
          <span className="tiptap-button-text">{label}</span>
        </Button>
      ))}
    </ToolbarGroup>
  )
}
