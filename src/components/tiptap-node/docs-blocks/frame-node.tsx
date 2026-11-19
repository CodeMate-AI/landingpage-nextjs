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
      {/* Replace and remove float on the media's top-right corner, where people look for them */}
      <div className="docs-frame-tools" contentEditable={false}>
        {src && (
          <button type="button" className="docs-frame-tool" disabled={busy} onMouseDown={(e) => e.preventDefault()} onClick={() => file.current?.click()}>
            {busy ? "Uploading..." : "Replace"}
          </button>
        )}
        <NodeCloseButton inline label="Remove media" onClick={deleteNode} />
      </div>
      {/* Labelled caption and alt text, each saying where it shows up */}
      <div className="docs-frame-fields" contentEditable={false}>
        <label className="docs-frame-field">
          <span className="docs-field-label">Caption</span>
          <input className="docs-tab-title-input" value={hint ?? ""} placeholder="Shown under the media (optional)" onChange={(e) => updateAttributes({ hint: e.target.value || null })} />
        </label>
        {src && kind !== "video" && (
          <label className="docs-frame-field">
            <span className="docs-field-label">
              Alt text {!alt && <em className="docs-frame-rec">Recommended</em>}
            </span>
            <input className="docs-tab-title-input" value={alt ?? ""} placeholder="Describe the image for screen readers and search" onChange={(e) => updateAttributes({ alt: e.target.value })} />
          </label>
        )}
      </div>
      {error && <p className="docs-frame-error" role="alert" contentEditable={false}>{error}</p>}
    </NodeViewWrapper>
  )
}

export const FrameNodeClient = FrameNode.extend({
  addNodeView: () => ReactNodeViewRenderer(FrameView),
})
