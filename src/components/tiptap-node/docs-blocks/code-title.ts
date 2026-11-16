import { Plugin } from "@tiptap/pm/state"
import { CodeTitle } from "@/lib/docs-blocks"
import "./docs-blocks.css"

// Docs editor only: shows a title field above each code block. A plain ProseMirror node view
// (no React, no extra dependency) so the built-in codeBlock node is left untouched.
export const CodeTitleClient = CodeTitle.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          nodeViews: {
            codeBlock: (node, view, getPos) => {
              let current = node
              const dom = document.createElement("div")
              dom.className = "docs-code"

              const input = document.createElement("input")
              input.className = "docs-code-title-input"
              input.placeholder = "Title or file name (optional)"
              input.setAttribute("aria-label", "Code block title")
              input.value = node.attrs.title ?? ""

              const pre = document.createElement("pre")
              const code = document.createElement("code")
              if (node.attrs.language) code.className = `language-${node.attrs.language}`
              pre.append(code)
              dom.append(input, pre)

              input.addEventListener("input", () => {
                const pos = getPos()
                if (pos == null) return
                view.dispatch(
                  view.state.tr.setNodeMarkup(pos, undefined, { ...current.attrs, title: input.value || null })
                )
              })

              return {
                dom,
                contentDOM: code,
                update(next) {
                  if (next.type !== current.type) return false
                  current = next
                  if (document.activeElement !== input) input.value = next.attrs.title ?? ""
                  return true
                },
                stopEvent: (event) => event.target === input,
                ignoreMutation: (mutation) => !code.contains(mutation.target),
              }
            },
          },
        },
      }),
    ]
  },
})
