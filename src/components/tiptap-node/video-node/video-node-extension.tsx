import React, { useEffect, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node, nodeInputRule, nodePasteRule } from "@tiptap/core"

export const videoInputRegex = /^\[video:\s*(https?:\/\/[^\s\]]+)\]$/
export const videoPasteRegex = /\[video:\s*(https?:\/\/[^\s\]]+)\]/g

const VideoNodeView = (props: NodeViewProps) => {
  const { src, caption } = props.node.attrs
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

  const renderVideoPlayer = () => {
    const videoSrc = src || ""

    // Check if YouTube
    const ytMatch = videoSrc.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    if (ytMatch && ytMatch[1]) {
      return (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px" }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      )
    }

    // Check if Vimeo
    const vimeoMatch = videoSrc.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i)
    if (vimeoMatch && vimeoMatch[3]) {
      return (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "8px" }}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[3]}`}
            title="Vimeo video player"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      )
    }

    return (
      <video
        controls
        src={videoSrc}
        className="tiptap-video-node__video"
        preload="metadata"
        style={{ width: "100%", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", margin: "0", display: "block" }}
      />
    )
  }

  return (
    <NodeViewWrapper as="figure" className="tiptap-media-figure tiptap-video-node my-4" data-type="video">
      <div style={{ width: "100%" }}>
        {renderVideoPlayer()}
      </div>
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
      caption: {
        default: "",
      },
    }
  },

  parseHTML() {
    return [
      {
        // Parses back from serialized <p>[video: URL | caption: TEXT]</p> or <p>[video: URL]</p>
        tag: "p",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const text = element.textContent?.trim() ?? ""
          const match = text.match(/^\[video:\s*([\s\S]+?)\]$/i)
          if (!match) return false

          const fullPayload = match[1].trim()
          const capMatch = fullPayload.match(/^([\s\S]*?)\s*\|\s*caption:[ ]?([\s\S]*)$/i)
          if (capMatch) {
            return {
              src: capMatch[1].trim(),
              caption: capMatch[2],
            }
          }

          return { src: fullPayload, caption: "" }
        },
      },
    ]
  },

  renderHTML({ node }) {
    const src = node.attrs.src || ""
    const caption = (node.attrs.caption as string) || ""
    if (caption && caption.trim().length > 0) {
      return ["p", {}, `[video: ${src} | caption: ${caption}]`]
    }
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
