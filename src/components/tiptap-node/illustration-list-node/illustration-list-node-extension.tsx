"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { adminFetch } from "@/lib/admin-api-client";
import { isSafeUrl } from "@/lib/blog-compiler";
import { encodeJsonAttr } from "@/lib/tiptap-json-attr";
import { ILLUSTRATION_CARD_MIME, isPrivateCardDrag } from "../card-drag-guard";
import "./illustration-list-node.scss";

export interface IllustrationItem {
  id: string;
  mediaUrl: string;
  title: string;
  description: string;
}

export function createIllustrationItem(): IllustrationItem {
  return {
    id: "illustration-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    mediaUrl: "",
    title: "",
    description: "",
  };
}

function isIllustrationCardDrag(event: Event): boolean {
  return isPrivateCardDrag(event, ILLUSTRATION_CARD_MIME);
}

function fitTextareaHeight(textarea: HTMLTextAreaElement) {
  // scrollHeight excludes the border, which counts towards height under border-box sizing
  const borderHeight = textarea.offsetHeight - textarea.clientHeight;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight + borderHeight}px`;
}

interface CardTextFieldProps {
  value: string;
  onCommit: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  className: string;
  multiline?: boolean;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Node view props update asynchronously, so a field bound directly to them can lose its caret while
// typing mid-sentence. The local value leads while focused, and every change still commits to the node.
const CardTextField: React.FC<CardTextFieldProps> = ({
  value,
  onCommit,
  placeholder,
  ariaLabel,
  className,
  multiline = false,
  onEnter,
}) => {
  const [draft, setDraft] = useState(value);
  const isFocusedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isFocusedRef.current) setDraft(value);
  }, [value]);

  useLayoutEffect(() => {
    if (textareaRef.current) fitTextareaHeight(textareaRef.current);
  }, [draft]);

  // Text rewraps when the editor narrows, so a textarea sized only on input would clip it
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    let lastWidth = textarea.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.offsetWidth === lastWidth) return;
      lastWidth = textarea.offsetWidth;
      fitTextareaHeight(textarea);
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, []);

  const sharedProps = {
    value: draft,
    placeholder,
    "aria-label": ariaLabel,
    className,
    onFocus: () => {
      isFocusedRef.current = true;
    },
    onBlur: () => {
      isFocusedRef.current = false;
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft(e.target.value);
      onCommit(e.target.value);
    },
  };

  return multiline ? (
    <textarea ref={textareaRef} rows={2} {...sharedProps} />
  ) : (
    <input type="text" onKeyDown={onEnter} {...sharedProps} />
  );
};

export const IllustrationListNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const items: IllustrationItem[] = Array.isArray(node.attrs.items) ? node.attrs.items : [];

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [uploadingIds, setUploadingIds] = useState<ReadonlySet<string>>(new Set());
  const [mediaErrors, setMediaErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUploadIdRef = useRef<string | null>(null);
  // Always the latest items, so an upload finishing late cannot overwrite edits made while it ran
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const commitItems = useCallback(
    (nextItems: IllustrationItem[]) => {
      itemsRef.current = nextItems;
      updateAttributes({ items: nextItems });
    },
    [updateAttributes]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<IllustrationItem>) => {
      commitItems(itemsRef.current.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    },
    [commitItems]
  );

  const addItem = () => {
    commitItems([...itemsRef.current, createIllustrationItem()]);
  };

  const removeItem = (id: string) => {
    commitItems(itemsRef.current.filter((item) => item.id !== id));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= itemsRef.current.length) return;
    const nextItems = [...itemsRef.current];
    const [moved] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, moved);
    commitItems(nextItems);
  };

  const setMediaError = (id: string, message: string | null) => {
    setMediaErrors((current) => {
      const next = { ...current };
      if (message) next[id] = message;
      else delete next[id];
      return next;
    });
  };

  const setUploading = (id: string, isUploading: boolean) => {
    setUploadingIds((current) => {
      const next = new Set(current);
      if (isUploading) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleFileUpload = async (file: File, id: string) => {
    setUploading(id, true);
    setMediaError(id, null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!isMountedRef.current) return;
      if (res.ok && data.url) {
        updateItem(id, { mediaUrl: data.url });
        setEditingMediaId((current) => (current === id ? null : current));
      } else {
        setMediaError(id, data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Illustration media upload error:", err);
      if (isMountedRef.current) {
        setMediaError(id, "Upload failed. Please check your connection and try again.");
      }
    } finally {
      if (isMountedRef.current) setUploading(id, false);
    }
  };

  const commitMediaUrl = (id: string, rawUrl: string): boolean => {
    const url = rawUrl.trim();
    if (!url) return false;
    if (!isSafeUrl(url)) {
      setMediaError(id, "Use a URL starting with http://, https:// or /.");
      return false;
    }
    setMediaError(id, null);
    updateItem(id, { mediaUrl: url });
    return true;
  };

  const openFilePicker = (id: string) => {
    currentUploadIdRef.current = id;
    fileInputRef.current?.click();
  };

  // Drag and drop handlers for reordering rows, started only from a row's drag handle
  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Keep Tiptap's NodeViewWrapper drag logic from treating this as a whole-node drag
    e.stopPropagation();
    e.dataTransfer.setData(ILLUSTRATION_CARD_MIME, String(index));
    e.dataTransfer.effectAllowed = "move";
    const rowEl = (e.currentTarget as HTMLElement).closest(".illustration-list-row");
    if (rowEl instanceof HTMLElement) {
      e.dataTransfer.setDragImage(rowEl, 24, 16);
    }
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    // Ignore files and rows from other lists so their default handling is untouched
    if (draggedIdx === null || !isIllustrationCardDrag(e.nativeEvent)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTargetIdx !== index) setDropTargetIdx(index);
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    // dragleave also fires when moving onto a child element; only clear when truly leaving the row
    if (e.currentTarget.contains(e.relatedTarget as globalThis.Node | null)) return;
    setDropTargetIdx((current) => (current === index ? null : current));
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (draggedIdx === null || !isIllustrationCardDrag(e.nativeEvent)) return;
    e.preventDefault();
    moveItem(draggedIdx, targetIndex);
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };

  return (
    <NodeViewWrapper as="div" className="illustration-list-node-wrapper" data-type="illustration-list">
      <div className="illustration-list-editor-container">
        <div className="illustration-list-admin-bar">
          <div className="illustration-list-badge">
            Illustration List ({items.length} {items.length === 1 ? "Card" : "Cards"})
          </div>
          <div className="illustration-list-admin-actions">
            <button type="button" className="illustration-list-btn-add" onClick={addItem}>
              + Add Card
            </button>
            <button type="button" className="illustration-list-btn-delete" onClick={deleteNode}>
              Remove List
            </button>
          </div>
        </div>

        <div className="illustration-list-section-title">
          <CardTextField
            value={typeof node.attrs.sectionTitle === "string" ? node.attrs.sectionTitle : ""}
            onCommit={(sectionTitle) => updateAttributes({ sectionTitle })}
            placeholder="Section Heading"
            ariaLabel="Section Heading"
            className="illustration-list-section-title-input"
            onEnter={(e) => {
              // The editor sits inside the article form, where Enter would save and leave the page
              if (e.key !== "Enter") return;
              e.preventDefault();
              e.currentTarget
                .closest(".illustration-list-editor-container")
                ?.querySelector<HTMLInputElement>(".illustration-list-title-input")
                ?.focus();
            }}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && currentUploadIdRef.current) {
              void handleFileUpload(file, currentUploadIdRef.current);
            }
            e.target.value = "";
          }}
        />

        {items.length === 0 ? (
          <div className="illustration-list-empty-notice">
            <p>This list has no cards.</p>
            <button type="button" onClick={addItem}>
              Add Your First Card
            </button>
          </div>
        ) : (
          <div className="illustration-list-rows">
            {items.map((item, idx) => {
              const isEditingMedia = editingMediaId === item.id || !item.mediaUrl;
              const isUploading = uploadingIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={(e) => handleDragLeave(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`illustration-list-row ${draggedIdx === idx ? "is-dragging" : ""} ${
                    dropTargetIdx === idx ? "is-drop-target" : ""
                  }`}
                >
                  <div className="illustration-list-row-controls">
                    <span
                      className="illustration-list-drag-handle"
                      title="Drag to reorder card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <circle cx="9" cy="6" r="1.5" />
                        <circle cx="15" cy="6" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="18" r="1.5" />
                        <circle cx="15" cy="18" r="1.5" />
                      </svg>
                      Card {idx + 1}
                    </span>
                    <div className="illustration-list-row-buttons">
                      <button
                        type="button"
                        onClick={() => moveItem(idx, idx - 1)}
                        disabled={idx === 0}
                        title="Move card up"
                        aria-label="Move card up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(idx, idx + 1)}
                        disabled={idx === items.length - 1}
                        title="Move card down"
                        aria-label="Move card down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeItem(item.id)}
                        title="Remove card"
                        aria-label="Remove card"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="illustration-list-row-body">
                    {item.mediaUrl && !isEditingMedia ? (
                      <div className="illustration-list-media-box">
                        <img src={item.mediaUrl} alt="" />
                        <button
                          type="button"
                          className="illustration-list-media-change"
                          onClick={() => setEditingMediaId(item.id)}
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="illustration-list-media-box is-upload"
                        disabled={isUploading}
                        onClick={() => openFilePicker(item.id)}
                        title="Upload image or GIF"
                      >
                        {item.mediaUrl && <img src={item.mediaUrl} alt="" />}
                        <span>{isUploading ? "Uploading..." : "Upload"}</span>
                      </button>
                    )}

                    <div className="illustration-list-fields">
                      <CardTextField
                        value={item.title}
                        onCommit={(title) => updateItem(item.id, { title })}
                        placeholder="Heading"
                        ariaLabel="Card heading"
                        className="illustration-list-title-input"
                        onEnter={(e) => {
                          // The editor sits inside the article form, where Enter would save and leave the page
                          if (e.key !== "Enter") return;
                          e.preventDefault();
                          e.currentTarget
                            .closest(".illustration-list-row")
                            ?.querySelector("textarea")
                            ?.focus();
                        }}
                      />
                      <CardTextField
                        multiline
                        value={item.description}
                        onCommit={(description) => updateItem(item.id, { description })}
                        placeholder="Description"
                        ariaLabel="Card description"
                        className="illustration-list-description-input"
                      />

                      {isEditingMedia && (
                        <div className="illustration-list-url-row">
                          <input
                            key={item.mediaUrl}
                            type="url"
                            placeholder="Or paste an image / GIF URL"
                            aria-label="Image or GIF URL"
                            defaultValue={item.mediaUrl}
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;
                              e.preventDefault();
                              if (commitMediaUrl(item.id, e.currentTarget.value)) {
                                setEditingMediaId(null);
                              }
                            }}
                            onBlur={(e) => {
                              commitMediaUrl(item.id, e.target.value);
                            }}
                          />
                          {item.mediaUrl && (
                            <>
                              <button type="button" onClick={() => setEditingMediaId(null)}>
                                Done
                              </button>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() => {
                                  updateItem(item.id, { mediaUrl: "" });
                                  setMediaError(item.id, null);
                                }}
                              >
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      {mediaErrors[item.id] && (
                        <p className="illustration-list-error" role="alert">
                          {mediaErrors[item.id]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// TipTap Node Extension for Client Editor
export const IllustrationListNode = Node.create({
  name: "illustrationList",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      sectionTitle: {
        default: "",
      },
      items: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='illustration-list']",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          let items: IllustrationItem[] = [];
          const rawItems = element.getAttribute("data-items");
          if (rawItems) {
            try {
              items = JSON.parse(rawItems);
            } catch (err) {
              console.error("Failed to parse data-items in IllustrationListNode:", err);
              items = [];
            }
          }
          let settings: { sectionTitle?: string } = {};
          const rawSettings = element.getAttribute("data-settings");
          if (rawSettings) {
            try {
              settings = JSON.parse(rawSettings) || {};
            } catch (err) {
              console.error("Failed to parse data-settings in IllustrationListNode:", err);
              settings = {};
            }
          }
          return { sectionTitle: settings.sectionTitle || "", items };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const items = Array.isArray(node.attrs.items) ? node.attrs.items : [];

    return [
      "div",
      {
        "data-type": "illustration-list",
        "data-settings": encodeJsonAttr({ sectionTitle: node.attrs.sectionTitle || "" }),
        "data-items": encodeJsonAttr(items),
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IllustrationListNodeView);
  },
});
