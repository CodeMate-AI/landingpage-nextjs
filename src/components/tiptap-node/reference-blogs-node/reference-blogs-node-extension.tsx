"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { Node } from "@tiptap/core"
import { adminFetch } from "@/lib/admin-api-client"
import { CurrentPostContext } from "@/components/tiptap-templates/simple/simple-editor"
import "./reference-blogs-node.scss"

export interface ReferenceBlogItem {
  id: string
  slug: string
  title: string
  category?: string
}

interface PostApiResponseItem {
  _id: string
  title: string
  slug: string
  category?: string
  published?: boolean
  publishedAt?: string
  createdAt?: string
}

interface ReferenceBlogsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    heading: string
    showBottomLink: boolean
    bottomLinkText: string
    bottomLinkUrl: string
    blogs: ReferenceBlogItem[]
  }) => void
  initialHeading: string
  initialShowBottomLink: boolean
  initialBottomLinkText: string
  initialBottomLinkUrl: string
  initialBlogs: ReferenceBlogItem[]
  currentPostId?: string | null
  currentSlug?: string | null
  currentTitle?: string | null
}

export const ReferenceBlogsModal: React.FC<ReferenceBlogsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHeading,
  initialShowBottomLink,
  initialBottomLinkText,
  initialBottomLinkUrl,
  initialBlogs,
  currentPostId,
  currentSlug,
  currentTitle,
}) => {
  const [heading, setHeading] = useState(initialHeading || "Writing")
  const [showBottomLink, setShowBottomLink] = useState(initialShowBottomLink ?? true)
  const [bottomLinkText, setBottomLinkText] = useState(initialBottomLinkText || "Read the blog")
  const [bottomLinkUrl, setBottomLinkUrl] = useState(initialBottomLinkUrl || "/blog")
  const [selectedBlogs, setSelectedBlogs] = useState<ReferenceBlogItem[]>(initialBlogs || [])
  const [searchQuery, setSearchQuery] = useState("")

  const [availablePosts, setAvailablePosts] = useState<PostApiResponseItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Sync state on modal open
  useEffect(() => {
    if (isOpen) {
      setHeading(initialHeading || "Writing")
      setShowBottomLink(initialShowBottomLink ?? true)
      setBottomLinkText(initialBottomLinkText || "Read the blog")
      setBottomLinkUrl(initialBottomLinkUrl || "/blog")
      setSelectedBlogs(initialBlogs ? [...initialBlogs] : [])
      setSearchQuery("")
    }
  }, [isOpen, initialHeading, initialShowBottomLink, initialBottomLinkText, initialBottomLinkUrl, initialBlogs])

  // Fetch live published posts from admin API
  const fetchLivePosts = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const res = await adminFetch("/api/admin/posts?limit=100")
      if (!res.ok) {
        throw new Error(`Failed to fetch articles (${res.status})`)
      }
      const data = await res.json()
      const rawPosts: PostApiResponseItem[] = Array.isArray(data.posts) ? data.posts : []

      const activeId = currentPostId || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null)
      const activeSlug = (currentSlug || "").trim().toLowerCase()
      const activeTitle = (currentTitle || "").trim().toLowerCase()

      // Only keep published posts and strictly exclude the currently opened article
      const publishedPosts = rawPosts.filter((p) => {
        if (!p.published) return false
        if (activeId && (p._id === activeId || (p as any).id === activeId)) return false
        if (activeSlug && p.slug && p.slug.trim().toLowerCase() === activeSlug) return false
        if (activeTitle && p.title && p.title.trim().toLowerCase() === activeTitle) return false
        return true
      })

      setAvailablePosts(publishedPosts)
    } catch (err: any) {
      console.error("ReferenceBlogsModal fetch error:", err)
      setFetchError(err.message || "Failed to load live articles.")
    } finally {
      setIsLoading(false)
    }
  }, [currentPostId, currentSlug, currentTitle])

  useEffect(() => {
    if (isOpen) {
      fetchLivePosts()
    }
  }, [isOpen, fetchLivePosts])

  // Filter posts based on search input
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return availablePosts
    const q = searchQuery.toLowerCase().trim()
    return availablePosts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q))
    )
  }, [availablePosts, searchQuery])

  // Toggle selection
  const handleTogglePost = (post: PostApiResponseItem) => {
    const isSelected = selectedBlogs.some((b) => b.id === post._id || b.slug === post.slug)
    if (isSelected) {
      setSelectedBlogs((prev) => prev.filter((b) => b.id !== post._id && b.slug !== post.slug))
    } else {
      setSelectedBlogs((prev) => [
        ...prev,
        {
          id: post._id,
          slug: post.slug,
          title: post.title,
          category: post.category,
        },
      ])
    }
  }

  // Move item up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return
    setSelectedBlogs((prev) => {
      const next = [...prev]
      const temp = next[index - 1]
      next[index - 1] = next[index]
      next[index] = temp
      return next
    })
  }

  // Move item down
  const handleMoveDown = (index: number) => {
    if (index >= selectedBlogs.length - 1) return
    setSelectedBlogs((prev) => {
      const next = [...prev]
      const temp = next[index + 1]
      next[index + 1] = next[index]
      next[index] = temp
      return next
    })
  }

  // Remove single item
  const handleRemoveItem = (idOrSlug: string) => {
    setSelectedBlogs((prev) => prev.filter((b) => b.id !== idOrSlug && b.slug !== idOrSlug))
  }

  const handleSave = () => {
    onSave({
      heading: heading.trim() || "Writing",
      showBottomLink,
      bottomLinkText: bottomLinkText.trim() || "Read the blog",
      bottomLinkUrl: bottomLinkUrl.trim() || "/blog",
      blogs: selectedBlogs,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="ref-modal-backdrop" onClick={onClose}>
      <div className="ref-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="ref-modal-header">
          <h3>Configure Reference Blogs</h3>
          <button type="button" className="ref-modal-close" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <div className="ref-modal-body">
          {/* Section heading */}
          <div className="ref-field-group">
            <label htmlFor="ref-heading-input">Section Title</label>
            <input
              id="ref-heading-input"
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. Writing, Related Reading, Featured"
            />
          </div>

          {/* Bottom link toggle and inputs */}
          <div className="ref-field-group">
            <label className="ref-checkbox-label">
              <input
                type="checkbox"
                checked={showBottomLink}
                onChange={(e) => setShowBottomLink(e.target.checked)}
              />
              Include redirect link at bottom
            </label>
          </div>

          {showBottomLink && (
            <div className="ref-two-col">
              <div className="ref-field-group">
                <label htmlFor="ref-link-text">Bottom Link Label</label>
                <input
                  id="ref-link-text"
                  type="text"
                  value={bottomLinkText}
                  onChange={(e) => setBottomLinkText(e.target.value)}
                  placeholder="Read the blog"
                />
              </div>
              <div className="ref-field-group">
                <label htmlFor="ref-link-url">Redirect URL</label>
                <input
                  id="ref-link-url"
                  type="text"
                  value={bottomLinkUrl}
                  onChange={(e) => setBottomLinkUrl(e.target.value)}
                  placeholder="/blog"
                />
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="ref-field-group">
            <label>Select Live Blogs from Portal</label>
            <div className="ref-search-bar">
              <span className="ref-search-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by article title or category..."
              />
            </div>
          </div>

          {/* Checklist list */}
          <div className="ref-checklist-box">
            {isLoading && (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "#a1a1aa", fontSize: "0.875rem" }}>
                Loading live articles...
              </div>
            )}

            {fetchError && (
              <div style={{ padding: "1.25rem", textAlign: "center", color: "#f87171", fontSize: "0.875rem" }}>
                <p>{fetchError}</p>
                <button
                  type="button"
                  onClick={fetchLivePosts}
                  style={{
                    marginTop: "0.5rem",
                    color: "#3b82f6",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Retry loading
                </button>
              </div>
            )}

            {!isLoading && !fetchError && filteredPosts.length === 0 && (
              <div style={{ padding: "1.5rem", textAlign: "center", color: "#71717a", fontSize: "0.875rem" }}>
                {availablePosts.length === 0 ? "No published articles found in the portal." : "No matching articles found."}
              </div>
            )}

            {!isLoading &&
              !fetchError &&
              filteredPosts.map((post) => {
                const selectedIndex = selectedBlogs.findIndex((b) => b.id === post._id || b.slug === post.slug)
                const isSelected = selectedIndex !== -1

                return (
                  <div
                    key={post._id}
                    className={`ref-checklist-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleTogglePost(post)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by row onClick
                      style={{ cursor: "pointer" }}
                    />
                    {isSelected && (
                      <span className="ref-item-badge">
                        {String(selectedIndex + 1).padStart(2, "0")}
                      </span>
                    )}
                    <div className="ref-item-info">
                      <div className="ref-item-title">{post.title}</div>
                      <div className="ref-item-meta">
                        {post.category ? `${post.category} • ` : ""}
                        {post.slug ? `/blog/${post.slug}` : ""}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Selected items order management */}
          {selectedBlogs.length > 0 && (
            <div className="ref-selected-section">
              <div className="ref-selected-header">
                Selected Order ({selectedBlogs.length}) - Automatically Numbered
              </div>
              <div className="ref-selected-list">
                {selectedBlogs.map((item, idx) => (
                  <div key={item.id || item.slug} className="ref-selected-row">
                    <span className="ref-selected-num">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="ref-selected-title">{item.title}</span>
                    <div className="ref-order-actions">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="Move Up"
                        aria-label="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === selectedBlogs.length - 1}
                        title="Move Down"
                        aria-label="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id || item.slug)}
                        title="Remove"
                        aria-label="Remove"
                        style={{ color: "#ef4444" }}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ref-modal-footer">
          <button type="button" className="ref-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ref-btn-submit" onClick={handleSave}>
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// NodeView Component rendered inside TipTap editor
const ReferenceBlogsNodeView = ({
  node,
  updateAttributes,
  deleteNode,
}: {
  node: {
    attrs: {
      heading?: string
      showBottomLink?: boolean
      bottomLinkText?: string
      bottomLinkUrl?: string
      blogs?: ReferenceBlogItem[]
    }
  }
  updateAttributes: (attrs: Record<string, any>) => void
  deleteNode: () => void
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentPost = React.useContext(CurrentPostContext)

  const heading = node.attrs.heading || "Writing"
  const showBottomLink = node.attrs.showBottomLink ?? true
  const bottomLinkText = node.attrs.bottomLinkText || "Read the blog"
  const bottomLinkUrl = node.attrs.bottomLinkUrl || "/blog"
  const blogs: ReferenceBlogItem[] = Array.isArray(node.attrs.blogs) ? node.attrs.blogs : []

  // Auto-open modal if the block was just inserted and has no blogs
  useEffect(() => {
    if (blogs.length === 0) {
      setIsModalOpen(true)
    }
  }, []) // run once on mount

  const handleModalSave = (data: {
    heading: string
    showBottomLink: boolean
    bottomLinkText: string
    bottomLinkUrl: string
    blogs: ReferenceBlogItem[]
  }) => {
    updateAttributes({
      heading: data.heading,
      showBottomLink: data.showBottomLink,
      bottomLinkText: data.bottomLinkText,
      bottomLinkUrl: data.bottomLinkUrl,
      blogs: data.blogs,
    })
  }

  return (
    <NodeViewWrapper as="div" className="ref-blogs-node-wrapper" data-type="reference-blogs">
      <div className="ref-blogs-editor-container">
        {/* Editor controls bar */}
        <div className="ref-blogs-admin-bar">
          <span className="ref-blogs-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
            Reference Blogs Section
          </span>
          <div className="ref-blogs-actions">
            <button
              type="button"
              className="ref-blogs-btn-edit"
              onClick={() => setIsModalOpen(true)}
            >
              Configure Checklist
            </button>
            <button
              type="button"
              className="ref-blogs-btn-delete"
              onClick={deleteNode}
            >
              Remove
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <h4 className="ref-blogs-preview-heading">{heading}</h4>

        {/* Blog rows or empty notice */}
        {blogs.length === 0 ? (
          <div className="ref-blogs-empty-notice">
            No reference blogs selected yet.
            <br />
            <button type="button" onClick={() => setIsModalOpen(true)}>
              Choose from live portal articles
            </button>
          </div>
        ) : (
          <div className="ref-blogs-preview-list">
            {blogs.map((item, idx) => (
              <div key={item.id || item.slug || idx} className="ref-blogs-preview-item">
                <span className="ref-preview-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
                <span className="ref-preview-num">{String(idx + 1).padStart(2, "0")}</span>
                <span className="ref-preview-title">{item.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom redirect link preview */}
        {showBottomLink && (
          <div className="ref-blogs-preview-bottom">
            <span>{bottomLinkText}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
            <span style={{ color: "#52525b", marginLeft: "0.25rem" }}>({bottomLinkUrl})</span>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      <ReferenceBlogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        initialHeading={heading}
        initialShowBottomLink={showBottomLink}
        initialBottomLinkText={bottomLinkText}
        initialBottomLinkUrl={bottomLinkUrl}
        initialBlogs={blogs}
        currentPostId={currentPost?.postId || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null)}
        currentSlug={currentPost?.slug}
        currentTitle={currentPost?.title}
      />
    </NodeViewWrapper>
  )
}

// TipTap Node Extension
export const ReferenceBlogsNode = Node.create({
  name: "referenceBlogs",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      heading: {
        default: "Writing",
      },
      showBottomLink: {
        default: true,
      },
      bottomLinkText: {
        default: "Read the blog",
      },
      bottomLinkUrl: {
        default: "/blog",
      },
      blogs: {
        default: [],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='reference-blogs']",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          const heading = element.getAttribute("data-heading") || "Writing"
          const showBottomLink = element.getAttribute("data-show-bottom") !== "false"
          const bottomLinkText = element.getAttribute("data-bottom-text") || "Read the blog"
          const bottomLinkUrl = element.getAttribute("data-bottom-url") || "/blog"

          let blogs: ReferenceBlogItem[] = []
          const rawBlogs = element.getAttribute("data-blogs")
          if (rawBlogs) {
            try {
              blogs = JSON.parse(rawBlogs)
            } catch (err) {
              console.error("Failed to parse data-blogs in ReferenceBlogsNode:", err)
              blogs = []
            }
          }

          return {
            heading,
            showBottomLink,
            bottomLinkText,
            bottomLinkUrl,
            blogs,
          }
        },
      },
    ]
  },

  renderHTML({ node }) {
    const heading = node.attrs.heading || "Writing"
    const showBottomLink = String(node.attrs.showBottomLink ?? true)
    const bottomLinkText = node.attrs.bottomLinkText || "Read the blog"
    const bottomLinkUrl = node.attrs.bottomLinkUrl || "/blog"
    const blogs = Array.isArray(node.attrs.blogs) ? node.attrs.blogs : []

    return [
      "div",
      {
        "data-type": "reference-blogs",
        "data-heading": heading,
        "data-show-bottom": showBottomLink,
        "data-bottom-text": bottomLinkText,
        "data-bottom-url": bottomLinkUrl,
        "data-blogs": JSON.stringify(blogs),
      },
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReferenceBlogsNodeView)
  },
})
