"use client"

import { useRef, useState } from "react"
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react"
import { FrameNode } from "@/lib/docs-blocks"
import { handleImageUpload, handleVideoUpload } from "@/lib/tiptap-utils"
import { NodeCloseButton } from "@/components/tiptap-node/node-close-button"
import "./docs-blocks.css"

const isVideoUrl = (u: string) => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(u)

// Image or video block: upload a file or paste a URL, then add an optional caption.
function FrameView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const { src, kind, alt, hint } = node.attrs
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [url, setUrl] = useState("")
  const file = useRef<HTMLInputElement>(null)

  const upload = async (f: File) => {
    setBusy(true)
    setError("")
    try {
      const video = f.type.startsWith("video/")
      const link = await (video ? handleVideoUpload : handleImageUpload)(f)
      updateAttributes({ src: link, kind: video ? "video" : "image" })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setBusy(false)
    }
  }
  const applyUrl = () => {
    const u = url.trim()
    if (!/^(https?:\/\/|\/)/.test(u)) return setError("Use a link starting with https:// or /")
    setError("")
    updateAttributes({ src: u, kind: isVideoUrl(u) ? "video" : "image" })
    setUrl("")
  }

  return (
    <NodeViewWrapper className="docs-frame docs-frame-edit" data-type="frame">
      <input ref={file} type="file" hidden accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      <div className="docs-frame-inner" contentEditable={false}>
        {src ? (
          kind === "video" ? <video src={src} controls playsInline /> : <img src={src} alt={alt || ""} />
        ) : (
          <div className="docs-frame-empty">
            <button type="button" className="docs-tab-remove" disabled={busy} onClick={() => file.current?.click()}>
              {busy ? "Uploading..." : "Upload image or video"}
            </button>
            <span>or</span>
            <input
              className="docs-tab-title-input"
              style={{ fontWeight: 400 }}
              value={url}
              placeholder="Paste a link and press Enter"
              aria-label="Media link"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyUrl())}
            />
          </div>
        )}
      </div>
      <div className="docs-opt-row" contentEditable={false}>
        <input className="docs-tab-title-input" style={{ fontWeight: 400 }} value={hint ?? ""} placeholder="Caption (optional)" aria-label="Caption" onChange={(e) => updateAttributes({ hint: e.target.value || null })} />
        {src && kind !== "video" && (
          <input className="docs-tab-title-input" style={{ fontWeight: 400 }} value={alt ?? ""} placeholder="Alt text" aria-label="Alt text" onChange={(e) => updateAttributes({ alt: e.target.value })} />
        )}
        {src && (
          <button type="button" className="docs-tab-remove" disabled={busy} onClick={() => file.current?.click()}>
            Replace
          </button>
        )}
        <NodeCloseButton inline label="Remove media" onClick={deleteNode} />
      </div>
      {error && <p className="docs-frame-error" role="alert" contentEditable={false}>{error}</p>}
    </NodeViewWrapper>
  )
}

export const FrameNodeClient = FrameNode.extend({
  addNodeView: () => ReactNodeViewRenderer(FrameView),
})
