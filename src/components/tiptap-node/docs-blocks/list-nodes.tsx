"use client"

import { useEffect, useRef, useState } from "react"
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { AccordionNode, CardNode, CardsNode, StepNode, StepsNode } from "@/lib/docs-blocks"
import { DOCS_ICONS } from "./docs-icons"
import "./docs-blocks.css"
import "./docs-icons.css"

const keepFocus = (e: React.MouseEvent) => e.preventDefault()

// Searchable popover with the curated Lucide set. The icon is stored by name and drawn by CSS (data-icon).
function IconPicker({ value, onChange }: { value: string | null; onChange: (name: string | null) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener("mousedown", away)
    return () => document.removeEventListener("mousedown", away)
  }, [open])

  const names = DOCS_ICONS.filter((n) => n.includes(q.trim().toLowerCase()))
  const pick = (name: string | null) => {
    onChange(name)
    setOpen(false)
  }

  return (
    <div className="docs-icon-picker" ref={ref} contentEditable={false} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <button type="button" className="docs-tab-remove docs-icon-btn" aria-expanded={open} onMouseDown={keepFocus} onClick={() => setOpen((o) => !o)}>
        {value && <span className="docs-card-icon" data-icon={value} aria-hidden />}
        {value ?? "Icon (optional)"}
      </button>
      {open && (
        <div className="docs-icon-pop">
          <input className="docs-tab-title-input" style={{ width: "100%", fontWeight: 400 }} autoFocus value={q} placeholder="Search icons" aria-label="Search icons" onChange={(e) => setQ(e.target.value)} />
          <div className="docs-icon-grid">
            {names.map((n) => (
              <button key={n} type="button" title={n} aria-label={n} aria-selected={n === value} onClick={() => pick(n)}>
                <span className="docs-card-icon" data-icon={n} aria-hidden />
              </button>
            ))}
          </div>
          {!names.length && <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", opacity: 0.7 }}>No icon matches.</p>}
          {value && (
            <button type="button" className="docs-tab-remove" style={{ marginTop: "0.5rem" }} onClick={() => pick(null)}>
              Remove icon
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Container view: the items plus an "Add" button that appends one more item. Reuses the tabs editor styles.
// Cards also get a column-count switch (Auto, 2, 3, 4).
function containerView(cls: string, itemType: string, label: string, attrs: (n: number) => Record<string, unknown>) {
  return function ContainerView({ node, getPos, editor, updateAttributes }: NodeViewProps) {
    const add = () => {
      const pos = getPos()
      if (pos == null) return
      editor
        .chain()
        .focus()
        .insertContentAt(pos + node.nodeSize - 1, { type: itemType, attrs: attrs(node.childCount + 1), content: [{ type: "paragraph" }] })
        .run()
    }
    return (
      <NodeViewWrapper className={`${cls}-wrap`} data-type={cls.replace("docs-", "")}>
        {itemType === "card" && (
          <div className="docs-opt-row" contentEditable={false}>
            Columns
            <span className="docs-opt-seg" role="group" aria-label="Columns">
              {[null, 2, 3, 4].map((c) => (
                <button key={String(c)} type="button" aria-pressed={(node.attrs.cols ?? null) === c} onMouseDown={keepFocus} onClick={() => updateAttributes({ cols: c })}>
                  {c ?? "Auto"}
                </button>
              ))}
            </span>
          </div>
        )}
        <NodeViewContent className={`${cls}-body`} data-columns={node.attrs.cols ?? undefined} />
        <button type="button" className="docs-tabs-add" contentEditable={false} onMouseDown={keepFocus} onClick={add}>
          + Add {label}
        </button>
      </NodeViewWrapper>
    )
  }
}

// Item view: inline title input, Remove button, per-type options, editable body.
// `min` = how many siblings must remain (steps and cards need one; an accordion can go).
function itemView(cls: string, opts: { min: number; kind: "step" | "card" | "accordion" }) {
  return function ItemView({ node, getPos, editor, updateAttributes }: NodeViewProps) {
    const a = node.attrs
    const remove = () => {
      const pos = getPos()
      if (pos == null) return
      if (opts.min && editor.state.doc.resolve(pos).parent.childCount <= opts.min) return
      editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
    }
    const text = (key: string, placeholder: string, label: string) => (
      <input
        className="docs-tab-title-input"
        style={{ fontWeight: 400 }}
        value={a[key] ?? ""}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => updateAttributes({ [key]: e.target.value || null })}
      />
    )
    return (
      <NodeViewWrapper className={`${cls} docs-item-edit`} data-type={cls.replace("docs-", "")}>
        <div className="docs-tab-head" contentEditable={false}>
          <input className="docs-tab-title-input" value={a.title ?? ""} placeholder="Title" aria-label="Title" onChange={(e) => updateAttributes({ title: e.target.value })} />
          <button type="button" className="docs-tab-remove" onMouseDown={keepFocus} onClick={remove}>
            Remove
          </button>
        </div>
        {opts.kind === "card" && (
          <>
            <div className="docs-tab-head" contentEditable={false}>
              <IconPicker value={a.icon} onChange={(icon) => updateAttributes({ icon })} />
              {text("href", "Link (optional)", "Card link")}
            </div>
            <div className="docs-opt-row" contentEditable={false}>
              {text("cta", "Link label", "Card link label")}
              {text("img", "Image URL", "Card image URL")}
              <label>
                <input type="checkbox" checked={!!a.horizontal} onChange={(e) => updateAttributes({ horizontal: e.target.checked })} />
                Horizontal
              </label>
            </div>
          </>
        )}
        {opts.kind === "accordion" && (
          <div className="docs-opt-row" contentEditable={false}>
            <span className="docs-opt-seg" role="group" aria-label="Style">
              {(["accordion", "expandable"] as const).map((v) => (
                <button key={v} type="button" aria-pressed={a.variant === v} onMouseDown={keepFocus} onClick={() => updateAttributes({ variant: v })}>
                  {v === "accordion" ? "Accordion" : "Show / Hide"}
                </button>
              ))}
            </span>
            <label>
              <input type="checkbox" checked={!!a.open} onChange={(e) => updateAttributes({ open: e.target.checked })} />
              Open by default
            </label>
          </div>
        )}
        <NodeViewContent className={`${cls}-body`} />
      </NodeViewWrapper>
    )
  }
}

export const StepsNodeClient = StepsNode.extend({
  addNodeView: () => ReactNodeViewRenderer(containerView("docs-steps", "step", "step", (n) => ({ title: `Step ${n}` }))),
})
export const StepNodeClient = StepNode.extend({
  addNodeView: () => ReactNodeViewRenderer(itemView("docs-step", { min: 1, kind: "step" })),
})
export const CardsNodeClient = CardsNode.extend({
  addNodeView: () => ReactNodeViewRenderer(containerView("docs-cards", "card", "card", (n) => ({ title: `Card ${n}` }))),
})
export const CardNodeClient = CardNode.extend({
  addNodeView: () => ReactNodeViewRenderer(itemView("docs-card", { min: 1, kind: "card" })),
})
export const AccordionNodeClient = AccordionNode.extend({
  addNodeView: () => ReactNodeViewRenderer(itemView("docs-accordion", { min: 0, kind: "accordion" })),
})
