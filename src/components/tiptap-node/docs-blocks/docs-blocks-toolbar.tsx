"use client"

import { ChevronsUpDown, CircleCheck, Info, Lightbulb, LayoutGrid, ListOrdered, OctagonAlert, PanelTop, StickyNote, TriangleAlert, type LucideIcon } from "lucide-react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { ToolbarGroup } from "@/components/tiptap-ui-primitive/toolbar"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { CALLOUT_KINDS, DOCS_CONTAINERS, type CalloutKind } from "@/lib/docs-blocks"

const KIND_ICONS: Record<string, LucideIcon> = { note: StickyNote, info: Info, tip: Lightbulb, warning: TriangleAlert, check: CircleCheck, danger: OctagonAlert }
const INSERT_ICONS: Record<string, LucideIcon> = { Tabs: PanelTop, Steps: ListOrdered, Cards: LayoutGrid, Accordion: ChevronsUpDown }

const group = (type: string, item: string, label: string, extra = {}) => ({
  type,
  content: [1, 2].map((n) => ({ type: item, attrs: { title: `${label} ${n}`, ...extra }, content: [{ type: "paragraph" }] })),
})

const INSERTS: [string, object][] = [
  ["Tabs", group("tabs", "tab", "Tab")],
  ["Steps", group("steps", "step", "Step")],
  ["Cards", group("cards", "card", "Card", { href: null })],
  ["Accordion", { type: "accordion", attrs: { title: "Question" }, content: [{ type: "paragraph" }] }],
]

// Docs-only toolbar row. Rendered by SimpleEditor only when `docsBlocks` is set.
export function DocsBlocksToolbar() {
  const { editor } = useTiptapEditor()

  // One docs block at a time: while the cursor is inside a block, no other block can be added.
  // Callouts stay switchable (their kind buttons) while the cursor is in a callout and nothing else.
  const $from = editor?.state.selection.$from
  const path = $from ? Array.from({ length: $from.depth }, (_, i) => $from.node(i + 1).type.name) : []
  const inOther = path.some((n) => n !== "callout" && DOCS_CONTAINERS.includes(n))
  const inCallout = path.includes("callout")

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
      {CALLOUT_KINDS.map((kind) => {
        const Icon = KIND_ICONS[kind]
        return (
        <Button
          key={kind}
          type="button"
          variant="ghost"
          disabled={inOther}
          data-active-state={editor?.isActive("callout", { kind }) ? "on" : "off"}
          onClick={() => toggleCallout(kind)}
          onMouseDown={(e) => e.preventDefault()}
          title={`Callout: ${kind}`}
          tooltip={`Callout: ${kind}`}
        >
          <Icon className="tiptap-button-icon" size={16} />
          <span className="tiptap-button-text">{kind[0].toUpperCase() + kind.slice(1)}</span>
        </Button>
        )
      })}
      {INSERTS.map(([label, content]) => {
        const Icon = INSERT_ICONS[label]
        return (
        <Button
          key={label}
          type="button"
          variant="ghost"
          disabled={inOther || inCallout}
          onClick={() => editor?.chain().focus().insertContent(content).run()}
          onMouseDown={(e) => e.preventDefault()}
          title={`Insert ${label.toLowerCase()}`}
          tooltip={`Insert ${label.toLowerCase()}`}
        >
          <Icon className="tiptap-button-icon" size={16} />
          <span className="tiptap-button-text">{label}</span>
        </Button>
        )
      })}
    </ToolbarGroup>
  )
}
