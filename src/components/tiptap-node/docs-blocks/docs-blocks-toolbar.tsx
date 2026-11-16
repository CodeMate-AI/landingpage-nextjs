"use client"

import { Button } from "@/components/tiptap-ui-primitive/button"
import { ToolbarGroup } from "@/components/tiptap-ui-primitive/toolbar"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import type { CalloutKind } from "@/lib/docs-blocks"

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
      {(["note", "tip", "warning"] as const).map((kind) => (
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
    </ToolbarGroup>
  )
}
