"use client"

import React, { useEffect, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node, mergeAttributes } from "@tiptap/core"
import "@/components/tiptap-node/image-node/image-node.scss"

export interface ImageNodeOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: {
        src: string
        alt?: string
        title?: string
        caption?: string
      }) => ReturnType
    }
  }
}

const ImageNodeView: React.FC<NodeViewProps> = (props) => {
  const { src, alt, caption } = props.node.attrs
  const [localCaption, setLocalCaption] = useState(caption || "")

  useEffect(() => {
    setLocalCaption(props.node.attrs.caption || "")
  }, [props.node.attrs.caption])

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocalCaption(val)
    props.updateAttributes({ caption: val })
  }

  const stopKeyPropagation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation?.()
  }

  return (
    <NodeViewWrapper as="figure" className="tiptap-media-figure my-4" data-type="image">
      {src && (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          className="blog-image"
          style={{ maxWidth: "100%", height: "auto", borderRadius: "8px", display: "block" }}
        />
      )}
      <div className="tiptap-caption-wrapper" contentEditable={false}>
        <input
          type="text"
          className="tiptap-media-caption-input"
          placeholder="Write a caption... (optional)"
          value={localCaption}
          onChange={handleCaptionChange}
          onKeyDown={stopKeyPropagation}
          onKeyUp={stopKeyPropagation}
        />
      </div>
    </NodeViewWrapper>
  )
}

export const CustomImageNode = Node.create<ImageNodeOptions>({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      caption: {
        default: "",
        parseHTML: (element) => {
          if (element.getAttribute("data-caption")) {
            return element.getAttribute("data-caption")
          }
          const figcaption = element.closest("figure")?.querySelector("figcaption")
          return figcaption?.textContent || ""
        },
        renderHTML: (attributes) => {
          return attributes.caption ? { "data-caption": attributes.caption } : {}
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "figure:has(img)",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const img = element.querySelector("img")
          if (!img) return false
          const figcaption = element.querySelector("figcaption")
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            caption: figcaption ? (figcaption.textContent || "") : (img.getAttribute("data-caption") || ""),
          }
        },
      },
      {
        tag: "img[src]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          return {
            src: element.getAttribute("src"),
            alt: element.getAttribute("alt"),
            title: element.getAttribute("title"),
            caption: element.getAttribute("data-caption") || "",
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const caption = (node.attrs.caption as string) || ""
    if (caption && caption.trim().length > 0) {
      return [
        "figure",
        { class: "blog-media-figure" },
        ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: "blog-image" })],
        ["figcaption", { class: "blog-media-caption" }, caption],
      ]
    }
    return [
      "figure",
      { class: "blog-media-figure" },
      ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: "blog-image" })],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

export default CustomImageNode
