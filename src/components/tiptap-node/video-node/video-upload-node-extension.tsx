"use client"

import React, { useRef, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node } from "@tiptap/core"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { CloseIcon } from "@/components/tiptap-icons/close-icon"
import { handleVideoUpload, MAX_VIDEO_SIZE } from "@/lib/tiptap-utils"
// Reuse existing image-upload-node styles for identical appearance
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss"

// ── Icons ────────────────────────────────────────────────────────────────────

const FileIcon: React.FC = () => (
  <svg width="43" height="57" viewBox="0 0 43 57" fill="currentColor"
    className="tiptap-image-upload-dropzone-rect-primary"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M0.75 10.75C0.75 5.64137 4.89137 1.5 10 1.5H32.3431C33.2051 1.5 34.0317 1.84241 34.6412 2.4519L40.2981 8.10876C40.9076 8.71825 41.25 9.5449 41.25 10.4069V46.75C41.25 51.8586 37.1086 56 32 56H10C4.89137 56 0.75 51.8586 0.75 46.75V10.75Z"
      fill="currentColor" fillOpacity="0.11" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const FileCornerIcon: React.FC = () => (
  <svg width="10" height="10" className="tiptap-image-upload-dropzone-rect-secondary"
    viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0.75H0.343146C1.40401 0.75 2.42143 1.17143 3.17157 1.92157L8.82843 7.57843C9.57857 8.32857 10 9.34599 10 10.4069V10.75H4C1.79086 10.75 0 8.95914 0 6.75V0.75Z"
      fill="currentColor"/>
  </svg>
)

const VideoUploadIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="tiptap-image-upload-icon"
    fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
  </svg>
)

const VideoFileIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="tiptap-image-upload-icon"
    fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.89543 4.89543 4 6 4H14L20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
      fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 4L20 10H14V4Z" fillOpacity="0.3" fill="currentColor"/>
    <polygon points="10,9 10,15 15,12" fill="currentColor"/>
  </svg>
)

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// ── NodeView ──────────────────────────────────────────────────────────────────

const VideoUploadNodeView: React.FC<NodeViewProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filename, setFilename] = useState("")
  const [filesize, setFilesize] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (MP4, WEBM, MOV)")
      return
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError("Video exceeds 50MB size limit")
      return
    }

    setFilename(file.name)
    setFilesize(file.size)
    setUploading(true)
    setProgress(0)
    setError(null)

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const url = await handleVideoUpload(file, (e) => setProgress(e.progress), abort.signal)

      // Replace this placeholder node with the actual VideoNode (player)
      const pos = props.getPos()
      if (typeof pos === "number") {
        props.editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + props.node.nodeSize })
          .insertContentAt(pos, { type: "video", attrs: { src: url } })
          .run()
      }
    } catch (err: any) {
      if (!abort.signal.aborted) {
        setError(err.message || "Upload failed")
        setUploading(false)
      }
    }
  }

  const handleFiles = (files: File[]) => {
    const file = files[0]
    if (file) uploadFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) handleFiles(files)
  }

  const handleClick = () => {
    if (!uploading && inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.click()
    }
  }

  const handleCancel = () => {
    abortRef.current?.abort()
    setUploading(false)
    setProgress(0)
  }

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true) }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (!e.currentTarget.contains(e.relatedTarget as globalThis.Node)) setIsDragActive(false)
  }
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation() }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <NodeViewWrapper className="tiptap-image-upload" tabIndex={0} onClick={!uploading ? handleClick : undefined}>

      {/* ── Dropzone (idle) ── */}
      {!uploading && (
        <div
          className={`tiptap-image-upload-drag-area${isDragActive ? " drag-active" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="tiptap-image-upload-dropzone">
            <FileIcon />
            <FileCornerIcon />
            <div className="tiptap-image-upload-icon-container">
              <VideoUploadIcon />
            </div>
          </div>
          <div className="tiptap-image-upload-content">
            <span className="tiptap-image-upload-text">
              <em>Click to upload</em> or drag and drop
            </span>
            <span className="tiptap-image-upload-subtext">
              Maximum 1 file, 50MB. MP4, WEBM, MOV.
            </span>
            {error && (
              <span className="tiptap-image-upload-subtext" style={{ color: "#f87171", marginTop: "4px" }}>
                {error}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Progress (uploading) ── */}
      {uploading && (
        <div className="tiptap-image-upload-previews">
          <div className="tiptap-image-upload-preview">
            <div className="tiptap-image-upload-progress" style={{ width: `${progress}%` }} />
            <div className="tiptap-image-upload-preview-content">
              <div className="tiptap-image-upload-file-info">
                <div className="tiptap-image-upload-file-icon">
                  <VideoFileIcon />
                </div>
                <div className="tiptap-image-upload-details">
                  <span className="tiptap-image-upload-text">{filename}</span>
                  <span className="tiptap-image-upload-subtext">{formatFileSize(filesize)}</span>
                </div>
              </div>
              <div className="tiptap-image-upload-actions">
                <span className="tiptap-image-upload-progress-text">{progress}%</span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); handleCancel() }}
                >
                  <CloseIcon className="tiptap-button-icon" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        style={{ display: "none" }}
        onChange={handleChange}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
      />
    </NodeViewWrapper>
  )
}

// ── Tiptap Node ───────────────────────────────────────────────────────────────

export const VideoUploadNode = Node.create({
  name: "videoUpload",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() { return {} },

  parseHTML() {
    return [{ tag: 'div[data-type="videoUpload"]' }]
  },

  renderHTML() {
    return ["div", { "data-type": "videoUpload" }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoUploadNodeView)
  },
})

export default VideoUploadNode
