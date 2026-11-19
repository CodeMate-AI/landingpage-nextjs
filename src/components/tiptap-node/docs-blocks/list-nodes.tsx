"use client"

import { useEffect, useRef, useState } from "react"
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { AccordionNode, CardNode, CardsNode, StepNode, StepsNode } from "@/lib/docs-blocks"
import { DOCS_ICONS } from "./docs-icons"
import { NodeCloseButton } from "@/components/tiptap-node/node-close-button"
// Labelled body area and the remove-or-remove-block helper shared by all blocks
import { BodyField, removeItem } from "./body-field"
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
// Steps and cards live in a container (removing the last one removes the block); an accordion stands alone.
// Per kind: title hint, body label and body hint, so writers know what goes where.
const COPY = {
  step: { title: "Step title", body: "Description", hint: "Explain what to do in this step..." },
  card: { title: "Card title", body: "Description", hint: "Short text shown on the card..." },
  accordion: { title: "Accordion title", body: "Content", hint: "Text shown when it opens..." },
}
function itemView(cls: string, opts: { kind: "step" | "card" | "accordion" }) {
  return function ItemView({ node, getPos, editor, updateAttributes, deleteNode }: NodeViewProps) {
    const a = node.attrs
    const copy = COPY[opts.kind]
    // The last card or step asks (inline, on the button) before removing the whole block
    const remove = (confirmed: boolean) => (opts.kind === "accordion" ? deleteNode() : removeItem({ editor, getPos, node }, confirmed))
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
          {/* Accordion: a chevron like the published one, turned when "Open by default" is on */}
          {opts.kind === "accordion" && <span className="docs-acc-chevron" data-open={!!a.open} aria-hidden="true" />}
          <input className="docs-tab-title-input" value={a.title ?? ""} placeholder={copy.title} aria-label={copy.title} onChange={(e) => updateAttributes({ title: e.target.value })} />
          <NodeCloseButton inline label={`Remove ${cls.replace("docs-", "")}`} onClick={remove} />
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
          // Settings strip: a labelled style choice and a real switch instead of a bare checkbox
          <div className="docs-acc-opts" contentEditable={false}>
            <span className="docs-acc-opt-label">Style</span>
            <span className="docs-opt-seg" role="group" aria-label="Style">
              {(["accordion", "expandable"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={a.variant === v}
                  title={v === "accordion" ? "Bordered box with a chevron" : "Quiet Show / Hide link"}
                  onMouseDown={keepFocus}
                  onClick={() => updateAttributes({ variant: v })}
                >
                  {v === "accordion" ? "Accordion" : "Show / Hide"}
                </button>
              ))}
            </span>
            <button type="button" role="switch" aria-checked={!!a.open} className="docs-acc-switch" onMouseDown={keepFocus} onClick={() => updateAttributes({ open: !a.open })}>
              <span className="docs-acc-track" aria-hidden="true">
                <span className="docs-acc-knob" />
              </span>
              Open by default
            </button>
          </div>
        )}
        <BodyField label={copy.body} placeholder={copy.hint} className={`${cls}-body`} />
      </NodeViewWrapper>
    )
  }
}

export const StepsNodeClient = StepsNode.extend({
  addNodeView: () => ReactNodeViewRenderer(containerView("docs-steps", "step", "step", (n) => ({ title: `Step ${n}` }))),
})
export const StepNodeClient = StepNode.extend({
  addNodeView: () => ReactNodeViewRenderer(itemView("docs-step", { kind: "step" })),
})
export const CardsNodeClient = CardsNode.extend({
  addNodeView: () => ReactNodeViewRenderer(containerView("docs-cards", "card", "card", (n) => ({ title: `Card ${n}` }))),
})
export const CardNodeClient = CardNode.extend({
  addNodeView: () => ReactNodeViewRenderer(itemView("docs-card", { kind: "card" })),
})
export const AccordionNodeClient = AccordionNode.extend({
  addNodeView: () => ReactNodeViewRenderer(itemView("docs-accordion", { kind: "accordion" })),
})
