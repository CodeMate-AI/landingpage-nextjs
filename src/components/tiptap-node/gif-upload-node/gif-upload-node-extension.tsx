"use client"

import React, { useRef, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node } from "@tiptap/core"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { CloseIcon } from "@/components/tiptap-icons/close-icon"
import { GifUploadIcon } from "@/components/tiptap-icons/gif-upload-icon"
import { handleImageUpload, MAX_GIF_SIZE } from "@/lib/tiptap-utils"
import "@/components/tiptap-node/image-upload-node/image-upload-node.scss"

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

const GifUploadNodeView: React.FC<NodeViewProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filename, setFilename] = useState("")
  const [filesize, setFilesize] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [urlMode, setUrlMode] = useState(false)
  const [gifUrl, setGifUrl] = useState("")

  const insertGifNode = (url: string, name?: string) => {
    const pos = props.getPos()
    if (typeof pos === "number") {
      props.editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + props.node.nodeSize })
        .insertContentAt(pos, {
          type: "image",
          attrs: {
            src: url,
            alt: name || "GIF animation",
            title: name || "GIF animation",
            caption: "",
          },
        })
        .run()
    }
  }

  const uploadFile = async (file: File) => {
    if (file.type !== "image/gif" && !file.name.toLowerCase().endsWith(".gif")) {
      setError("Please select a valid GIF file (.gif)")
      return
    }
    if (file.size > MAX_GIF_SIZE) {
      setError("GIF exceeds 15MB size limit")
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
      const url = await handleImageUpload(file, (e) => setProgress(e.progress), abort.signal)
      insertGifNode(url, file.name.replace(/\.[^/.]+$/, ""))
    } catch (err: any) {
      if (!abort.signal.aborted) {
        console.error("GIF upload failed:", err)
        setError(err.message || "GIF upload failed")
        setUploading(false)
      }
    }
  }

  const handleFiles = (files: File[]) => {
    if (files.length > 1) {
      setError("Please drop or select only one GIF file at a time")
      return
    }
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

  const handleRemove = () => {
    handleCancel()
    const pos = props.getPos()
    if (typeof pos === "number") {
      props.editor.chain().focus().deleteRange({ from: pos, to: pos + props.node.nodeSize }).run()
    }
  }

  const handleUrlSubmit = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const trimmed = gifUrl.trim()
    if (!trimmed) {
      setError("Please enter a valid URL")
      return
    }
    if (!/^https?:\/\/\S+/i.test(trimmed)) {
      setError("Please enter a valid HTTP or HTTPS URL")
      return
    }
    insertGifNode(trimmed, "GIF animation")
  }

  return (
    <NodeViewWrapper as="div" className="tiptap-image-upload my-4">
      <div
        className={`tiptap-image-upload-drag-area ${isDragActive ? "drag-active" : ""}`}
        onDragEnter={(e) => {
          e.preventDefault()
          setIsDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragActive(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragActive(true)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragActive(false)
          const files = Array.from(e.dataTransfer.files)
          if (files.length > 0) handleFiles(files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/gif,.gif"
          style={{ display: "none" }}
          onChange={handleChange}
        />

        {uploading ? (
          <div className="tiptap-image-upload-preview w-full">
            <div className="tiptap-image-upload-progress" style={{ width: `${progress}%` }} />
            <div className="tiptap-image-upload-preview-content">
              <div className="tiptap-image-upload-file-info">
                <div className="tiptap-image-upload-details">
                  <span className="tiptap-image-upload-text">{filename}</span>
                  <span className="tiptap-image-upload-subtext">{formatFileSize(filesize)}</span>
                </div>
              </div>
              <div className="tiptap-image-upload-actions">
                <span className="tiptap-image-upload-progress-text">{progress}%</span>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  <CloseIcon className="tiptap-button-icon" />
                </Button>
              </div>
            </div>
          </div>
        ) : urlMode ? (
          <div className="flex flex-col items-center justify-center p-6 gap-3 w-full" style={{ minHeight: "140px" }}>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
              <input
                type="url"
                value={gifUrl}
                onChange={(e) => setGifUrl(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleUrlSubmit(e)
                  }
                }}
                placeholder="https://media.giphy.com/... or direct .gif URL"
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Insert GIF
                </button>
                <button
                  type="button"
                  onClick={() => setUrlMode(false)}
                  className="px-3 py-2 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="flex flex-col items-center justify-center p-6 cursor-pointer gap-2 select-none w-full"
            style={{ minHeight: "140px" }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800/80 border border-neutral-700/60 mb-1">
              <GifUploadIcon width="28" height="28" className="tiptap-image-upload-icon text-indigo-400" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-neutral-200">
                <em className="text-indigo-400 font-semibold not-italic">Click to upload GIF</em> or drag and drop
              </span>
              <p className="text-xs text-neutral-400 mt-1">Animated GIF (.gif) up to 15MB</p>
            </div>
            <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setUrlMode(true)}
                className="text-xs text-neutral-400 hover:text-indigo-400 underline underline-offset-2 transition-colors"
              >
                Or paste GIF URL
              </button>
            </div>
          </div>
        )}

        {/* Remove / close button */}
        <button
          type="button"
          onClick={handleRemove}
          title="Remove GIF upload block"
          className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800/60 transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mt-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 rounded px-3 py-1.5 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-2 hover:text-white">
            ✕
          </button>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const GifUploadNode = Node.create({
  name: "gifUpload",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="gif-upload"]' }]
  },

  renderHTML() {
    return ["div", { "data-type": "gif-upload" }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GifUploadNodeView)
  },
})

export default GifUploadNode

