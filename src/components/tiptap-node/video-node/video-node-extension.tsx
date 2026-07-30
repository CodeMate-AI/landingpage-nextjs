import React from "react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node } from "@tiptap/core"

const VideoNodeView = ({ node }: { node: { attrs: { src?: string } } }) => {
  const src = node.attrs.src || ""

  return (
    <NodeViewWrapper as="div" className="tiptap-video-node" data-type="video">
      <video
        controls
        src={src}
        className="tiptap-video-node__video"
        preload="metadata"
        style={{ width: "100%", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", margin: "8px 0", display: "block" }}
      />
    </NodeViewWrapper>
  )
}

export const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: "",
      },
    }
  },

  parseHTML() {
    return [
      {
        // Parses back from the serialized <p>[video: URL]</p> format
        tag: "p",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const text = element.textContent?.trim() ?? ""
          const match = text.match(/^\[video:\s*(.+)\]$/)
          if (!match) return false
          return { src: match[1].trim() }
        },
      },
    ]
  },

  renderHTML({ node }) {
    const src = node.attrs.src || ""
    // Output plain <p>[video: URL]</p> — matches formatVideos() regex on the public blog page
    return ["p", {}, `[video: ${src}]`]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView)
  },
})

export default VideoNode
