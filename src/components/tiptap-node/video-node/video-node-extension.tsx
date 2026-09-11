import React from "react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node, nodeInputRule, nodePasteRule } from "@tiptap/core"

export const videoInputRegex = /^\[video:\s*(https?:\/\/[^\s\]]+)\]$/
export const videoPasteRegex = /\[video:\s*(https?:\/\/[^\s\]]+)\]/g

const VideoNodeView = ({ node }: { node: { attrs: { src?: string } } }) => {
  const src = node.attrs.src || ""

  // Check if YouTube
  const ytMatch = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
  if (ytMatch && ytMatch[1]) {
    return (
      <NodeViewWrapper as="div" className="tiptap-video-node my-4" data-type="video">
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px" }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </NodeViewWrapper>
    )
  }

  // Check if Vimeo
  const vimeoMatch = src.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i)
  if (vimeoMatch && vimeoMatch[3]) {
    return (
      <NodeViewWrapper as="div" className="tiptap-video-node my-4" data-type="video">
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px" }}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[3]}`}
            title="Vimeo video player"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      </NodeViewWrapper>
    )
  }

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

  addInputRules() {
    return [
      nodeInputRule({
        find: videoInputRegex,
        type: this.type,
        getAttributes: (match) => ({
          src: match[1]?.trim() || "",
        }),
      }),
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: videoPasteRegex,
        type: this.type,
        getAttributes: (match) => ({
          src: match[1]?.trim() || "",
        }),
      }),
    ]
  },
})

export default VideoNode
