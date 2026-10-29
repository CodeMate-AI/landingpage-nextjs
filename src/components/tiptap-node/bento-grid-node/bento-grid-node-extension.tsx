"use client";

import React, { useState, useRef, useCallback } from "react";
import { NodeViewWrapper, ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import { Extension, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { adminFetch } from "@/lib/admin-api-client";
import "./bento-grid-node.scss";

// Private drag payload type: ProseMirror only pastes text/plain or text/html, so a card dropped
// anywhere outside its grid inserts nothing into the document
const BENTO_CARD_MIME = "application/x-bento-card";

function isBentoCardDrag(event: Event): boolean {
  const types = (event as DragEvent).dataTransfer?.types;
  return Boolean(types && Array.from(types).includes(BENTO_CARD_MIME));
}

export interface BentoCardItem {
  id: string;
  mediaType: "image" | "gif" | "video";
  mediaUrl: string;
  altText?: string;
  // Legacy cards may still carry title/linkUrl in saved JSON; they are no longer edited or rendered
  caption?: string;
  spanCols: 1 | 2 | 3;
  spanRows: 1 | 2 | 3;
  aspectRatio?: "auto" | "square" | "video" | "wide";
}

export const BentoGridNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const columns = (node.attrs.columns as number) || 2;
  const gap = (node.attrs.gap as "sm" | "md" | "lg") || "md";
  const cards: BentoCardItem[] = Array.isArray(node.attrs.cards) ? node.attrs.cards : [];

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dropTargetIdx, setDropTargetIdx] = useState<number | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<{ cardId: string; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUploadCardIdRef = useRef<string | null>(null);

  // Updates a single card attribute by ID
  const updateCard = useCallback(
    (id: string, updates: Partial<BentoCardItem>) => {
      const nextCards = cards.map((c) => (c.id === id ? { ...c, ...updates } : c));
      updateAttributes({ cards: nextCards });
    },
    [cards, updateAttributes]
  );

  // Removes a card by ID
  const removeCard = useCallback(
    (id: string) => {
      const nextCards = cards.filter((c) => c.id !== id);
      updateAttributes({ cards: nextCards });
    },
    [cards, updateAttributes]
  );

  // Adds a new blank card
  const addCard = useCallback(() => {
    const newCard: BentoCardItem = {
      id: "bento-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      mediaType: "image",
      mediaUrl: "",
      caption: "",
      spanCols: 1,
      spanRows: 1,
      aspectRatio: "auto",
    };
    updateAttributes({ cards: [...cards, newCard] });
    setEditingCardId(newCard.id);
  }, [cards, updateAttributes]);

  // Moves a card left (-1) or right (+1)
  const shiftCard = useCallback(
    (index: number, direction: -1 | 1) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= cards.length) return;
      const nextCards = [...cards];
      const [moved] = nextCards.splice(index, 1);
      nextCards.splice(targetIndex, 0, moved);
      updateAttributes({ cards: nextCards });
    },
    [cards, updateAttributes]
  );

  // Drag and drop handlers for Kanban-style tile rearranging, started only from a card's drag handle
  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Keep Tiptap's NodeViewWrapper drag logic from treating this as a whole-node drag
    e.stopPropagation();
    e.dataTransfer.setData(BENTO_CARD_MIME, String(index));
    e.dataTransfer.effectAllowed = "move";
    const cardEl = (e.currentTarget as HTMLElement).closest(".bento-card-item");
    if (cardEl instanceof HTMLElement) {
      e.dataTransfer.setDragImage(cardEl, 24, 16);
    }
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    // Ignore files and cards from other grids so their default handling is untouched
    if (draggedIdx === null || !isBentoCardDrag(e.nativeEvent)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropTargetIdx !== index) {
      setDropTargetIdx(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    // dragleave also fires when moving onto a child element; only clear when truly leaving the card
    if (e.currentTarget.contains(e.relatedTarget as globalThis.Node | null)) return;
    setDropTargetIdx((current) => (current === index ? null : current));
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (draggedIdx === null || !isBentoCardDrag(e.nativeEvent)) return;
    e.preventDefault();
    if (draggedIdx === targetIndex) {
      setDraggedIdx(null);
      setDropTargetIdx(null);
      return;
    }
    const nextCards = [...cards];
    const [draggedCard] = nextCards.splice(draggedIdx, 1);
    nextCards.splice(targetIndex, 0, draggedCard);
    updateAttributes({ cards: nextCards });
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDropTargetIdx(null);
  };

  // Upload file handler
  const handleFileUpload = async (file: File, cardId: string) => {
    setUploadingCardId(cardId);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        const mediaType: BentoCardItem["mediaType"] = file.type.startsWith("video/")
          ? "video"
          : file.type === "image/gif"
          ? "gif"
          : "image";
        updateCard(cardId, { mediaUrl: data.url, mediaType });
        setEditingCardId(null);
      } else {
        setUploadError({ cardId, message: data.error || "Media upload failed. Please try again." });
      }
    } catch (err) {
      console.error("Bento media upload error:", err);
      setUploadError({ cardId, message: "Media upload failed. Please check your connection and try again." });
    } finally {
      setUploadingCardId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <NodeViewWrapper as="div" className="bento-grid-node-wrapper" data-type="bento-grid">
      <div className="bento-grid-editor-container">
        {/* Top Control Bar */}
        <div className="bento-grid-admin-bar">
          <div className="bento-grid-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="8" height="8" rx="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" />
              <rect x="13" y="3" width="8" height="18" rx="1.5" />
            </svg>
            Bento Grid ({cards.length} {cards.length === 1 ? "Card" : "Cards"})
          </div>

          <div className="bento-grid-toolbar-controls">
            <div className="bento-grid-select-group">
              <label>Cols:</label>
              <select
                value={columns}
                onChange={(e) => {
                  const nextColumns = Number(e.target.value) === 3 ? 3 : 2;
                  // Shrink any card wider than the new column count so the grid never overflows
                  updateAttributes({
                    columns: nextColumns,
                    cards: cards.map((c) =>
                      c.spanCols > nextColumns ? { ...c, spanCols: nextColumns as 1 | 2 | 3 } : c
                    ),
                  });
                }}
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
              </select>
            </div>

            <div className="bento-grid-select-group">
              <label>Gap:</label>
              <select
                value={gap}
                onChange={(e) => updateAttributes({ gap: e.target.value as "sm" | "md" | "lg" })}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>

            <button type="button" className="bento-btn-add" onClick={addCard}>
              + Add Card
            </button>

            <button type="button" className="bento-btn-delete" onClick={deleteNode} title="Delete Entire Grid">
              Remove Grid
            </button>
          </div>
        </div>

        {/* Hidden File Input for Card Uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.gif"
          className="hidden"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && currentUploadCardIdRef.current) {
              void handleFileUpload(file, currentUploadCardIdRef.current);
            }
          }}
        />

        {/* Bento Grid Canvas */}
        <div
          className={`bento-grid-layout bento-cols-${columns} bento-gap-${gap}`}
          style={{
            ["--bento-cols" as any]: columns,
          }}
        >
          {cards.length === 0 ? (
            <div className="bento-empty-grid-notice">
              <p>Your Bento Grid is empty.</p>
              <button type="button" onClick={addCard}>
                Add Your First Card
              </button>
            </div>
          ) : (
            cards.map((card, idx) => {
              const effectiveSpanCols = Math.min(card.spanCols || 1, columns);
              const isColSpan2 = effectiveSpanCols === 2;
              const isColSpan3 = effectiveSpanCols === 3;
              const spanRows = card.spanRows === 3 ? 3 : card.spanRows === 2 ? 2 : 1;
              const isDragging = draggedIdx === idx;
              const isDropTarget = dropTargetIdx === idx;
              const isEditingMedia = editingCardId === card.id || !card.mediaUrl;

              return (
                <div
                  key={card.id}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={(e) => handleDragLeave(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`bento-card-item ${
                    isColSpan3 ? "col-span-3" : isColSpan2 ? "col-span-2" : "col-span-1"
                  } row-span-${spanRows} ${
                    isDragging ? "is-dragging" : ""
                  } ${isDropTarget ? "is-drop-target" : ""}`}
                >
                  {/* Card Header / Toolbar */}
                  <div className="bento-card-top-bar">
                    <span
                      className="bento-card-drag-handle"
                      title="Drag to reorder card position"
                      draggable
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragEnd={handleDragEnd}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="9" cy="6" r="1.5" />
                        <circle cx="15" cy="6" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="18" r="1.5" />
                        <circle cx="15" cy="18" r="1.5" />
                      </svg>
                      Card {idx + 1}
                    </span>

                    <div className="bento-card-controls">
                      {/* Quick Shift buttons */}
                      <button
                        type="button"
                        className="bento-control-btn"
                        onClick={() => shiftCard(idx, -1)}
                        disabled={idx === 0}
                        title="Move Left / Previous"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="bento-control-btn"
                        onClick={() => shiftCard(idx, 1)}
                        disabled={idx === cards.length - 1}
                        title="Move Right / Next"
                      >
                        →
                      </button>

                      {/* Width and height are independent so resizing one never resets the other */}
                      <span className="bento-control-group" role="group" aria-label="Card width">
                        <span className="bento-control-label">W</span>
                        {([1, 2] as const).map((w) => (
                          <button
                            key={w}
                            type="button"
                            className={`bento-control-btn ${effectiveSpanCols === w ? "active" : ""}`}
                            onClick={() => updateCard(card.id, { spanCols: w })}
                            title={`Width: ${w} column${w > 1 ? "s" : ""}`}
                          >
                            {w}
                          </button>
                        ))}
                        {columns === 3 && (
                          <button
                            type="button"
                            className={`bento-control-btn ${effectiveSpanCols === 3 ? "active" : ""}`}
                            onClick={() => updateCard(card.id, { spanCols: 3 })}
                            title="Width: full (3 columns)"
                          >
                            Full
                          </button>
                        )}
                      </span>
                      <span className="bento-control-group" role="group" aria-label="Card height">
                        <span className="bento-control-label">H</span>
                        {([1, 2, 3] as const).map((h) => (
                          <button
                            key={h}
                            type="button"
                            className={`bento-control-btn ${spanRows === h ? "active" : ""}`}
                            onClick={() => updateCard(card.id, { spanRows: h })}
                            title={`Height: ${h} row${h > 1 ? "s" : ""}`}
                          >
                            {h}
                          </button>
                        ))}
                      </span>

                      {/* Delete button */}
                      <button
                        type="button"
                        className="bento-control-btn delete-btn"
                        onClick={() => removeCard(card.id)}
                        title="Delete Card"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Media Content Display or Setup */}
                  {isEditingMedia ? (
                    <div className="bento-empty-media-form">
                      {/* Media type tabs */}
                      <div className="bento-media-type-tabs">
                        <button
                          type="button"
                          className={card.mediaType === "image" ? "active" : ""}
                          onClick={() => updateCard(card.id, { mediaType: "image" })}
                        >
                          Image
                        </button>
                        <button
                          type="button"
                          className={card.mediaType === "gif" ? "active" : ""}
                          onClick={() => updateCard(card.id, { mediaType: "gif" })}
                        >
                          GIF
                        </button>
                        <button
                          type="button"
                          className={card.mediaType === "video" ? "active" : ""}
                          onClick={() => updateCard(card.id, { mediaType: "video" })}
                        >
                          Video
                        </button>
                      </div>

                      {/* Upload button */}
                      <div
                        className="bento-upload-dropzone"
                        onClick={() => {
                          currentUploadCardIdRef.current = card.id;
                          fileInputRef.current?.click();
                        }}
                      >
                        {uploadingCardId === card.id
                          ? "Uploading media..."
                          : `Click to upload ${card.mediaType === "video" ? "Video" : "Image / GIF"}`}
                      </div>
                      {uploadError?.cardId === card.id && (
                        <p className="bento-upload-error" role="alert">
                          {uploadError.message}
                        </p>
                      )}

                      {/* URL input */}
                      <div className="bento-input-row">
                        <input
                          type="url"
                          placeholder={
                            card.mediaType === "video"
                              ? "Paste video URL (.mp4, YouTube, Vimeo)"
                              : card.mediaType === "gif"
                              ? "Paste GIF URL (Giphy or direct .gif)"
                              : "Paste Image URL"
                          }
                          defaultValue={card.mediaUrl}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.currentTarget as HTMLInputElement;
                              if (input.value.trim()) {
                                updateCard(card.id, { mediaUrl: input.value.trim() });
                                setEditingCardId(null);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              updateCard(card.id, { mediaUrl: e.target.value.trim() });
                            }
                          }}
                        />
                        {card.mediaUrl && (
                          <button
                            type="button"
                            onClick={() => setEditingCardId(null)}
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bento-card-media-box">
                      {card.mediaType === "video" ? (
                        card.mediaUrl.includes("youtube") ||
                        card.mediaUrl.includes("youtu.be") ||
                        card.mediaUrl.includes("vimeo.com") ? (
                          <div style={{ padding: "1.5rem", textAlign: "center", fontSize: "0.75rem", color: "#a1a1aa" }}>
                            ▶ {card.mediaUrl.includes("vimeo.com") ? "Vimeo" : "YouTube"} Embed: {card.mediaUrl}
                          </div>
                        ) : (
                          <video
                            src={card.mediaUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="bento-video"
                          />
                        )
                      ) : (
                        <img
                          src={card.mediaUrl}
                          alt={card.altText || card.caption || "Bento media"}
                          loading="lazy"
                        />
                      )}
                      <button
                        type="button"
                        className="bento-media-overlay-change"
                        onClick={() => setEditingCardId(card.id)}
                      >
                        Change Media
                      </button>
                    </div>
                  )}

                  {/* Optional caption, rendered below the media on the published post */}
                  <div className="bento-card-meta">
                    <input
                      type="text"
                      className="meta-caption-input"
                      placeholder="Caption (optional)"
                      value={card.caption || ""}
                      onChange={(e) => updateCard(card.id, { caption: e.target.value })}
                    />
                  </div>

                  {/* Corner Resize Handle */}
                  <div
                    className="bento-card-resize-handle"
                    title="Click to toggle card span width"
                    onClick={() => {
                      const nextSpan = card.spanCols === 1 ? 2 : (columns === 3 && card.spanCols === 2 ? 3 : 1);
                      updateCard(card.id, { spanCols: nextSpan as 1 | 2 | 3 });
                    }}
                  >
                    ↘
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

/**
 * Keeps ProseMirror out of in-grid card reordering. Tiptap's default NodeView.stopEvent forwards
 * dragover/drop from inside node views to ProseMirror, which would otherwise insert the drag
 * payload as text and draw its drop cursor over the grid.
 */
const BentoCardDragGuard = Extension.create({
  name: "bentoCardDragGuard",
  priority: 1000,

  // prosemirror-dropcursor listens on the editor DOM directly, so it is suppressed per node spec
  extendNodeSchema() {
    return {
      disableDropCursor: (_view: unknown, _pos: unknown, event: DragEvent) => isBentoCardDrag(event),
    };
  },

  addProseMirrorPlugins() {
    const claimCardDrag = (_view: unknown, event: Event) => {
      if (!isBentoCardDrag(event)) return false;
      if (event.type === "drop") event.preventDefault();
      return true;
    };

    return [
      new Plugin({
        key: new PluginKey("bentoCardDragGuard"),
        props: {
          handleDOMEvents: {
            dragenter: claimCardDrag,
            dragover: claimCardDrag,
            drop: claimCardDrag,
          },
        },
      }),
    ];
  },
});

// TipTap Node Extension for Client Editor
export const BentoGridNode = Node.create({
  name: "bentoGrid",
  group: "block",
  atom: true,
  draggable: true,

  addExtensions() {
    return [BentoCardDragGuard];
  },

  addAttributes() {
    return {
      columns: {
        default: 2,
      },
      gap: {
        default: "md",
      },
      cards: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='bento-grid']",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const columns = parseInt(element.getAttribute("data-columns") || "2", 10) || 2;
          const gap = (element.getAttribute("data-gap") as "sm" | "md" | "lg") || "md";

          let cards: BentoCardItem[] = [];
          const rawCards = element.getAttribute("data-cards");
          if (rawCards) {
            try {
              cards = JSON.parse(rawCards);
            } catch (err) {
              console.error("Failed to parse data-cards in BentoGridNode:", err);
              cards = [];
            }
          }

          return {
            columns,
            gap,
            cards,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const columns = node.attrs.columns || 2;
    const gap = node.attrs.gap || "md";
    const cards = Array.isArray(node.attrs.cards) ? node.attrs.cards : [];

    return [
      "div",
      {
        "data-type": "bento-grid",
        "data-columns": String(columns),
        "data-gap": gap,
        "data-cards": JSON.stringify(cards),
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BentoGridNodeView);
  },
});
