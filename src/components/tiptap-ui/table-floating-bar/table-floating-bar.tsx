"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import "./table-floating-bar.scss";

interface TableFloatingBarProps {
  editor: Editor | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function TableFloatingBar({ editor, containerRef }: TableFloatingBarProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [isActive, setIsActive] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor || editor.isDestroyed || !containerRef.current) {
      setIsActive(false);
      setCoords(null);
      return;
    }

    if (!editor.isActive("table")) {
      setIsActive(false);
      setCoords(null);
      return;
    }

    try {
      const { selection } = editor.state;
      const domAtPos = editor.view.domAtPos(selection.$from.pos);
      const targetNode = domAtPos.node;
      const tableEl =
        targetNode instanceof HTMLElement
          ? targetNode.closest("table")
          : targetNode.parentElement?.closest("table");

      if (!tableEl) {
        setIsActive(false);
        setCoords(null);
        return;
      }

      const tableRect = tableEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Position bar 8px above the top border of the table
      const barHeight = barRef.current?.offsetHeight || 32;
      const gap = 8;
      const top = tableRect.top - containerRect.top - barHeight - gap;
      const left = tableRect.left - containerRect.left;

      setCoords({
        top: Math.max(4, top),
        left: Math.max(8, left),
      });
      setIsActive(true);
    } catch {
      setIsActive(false);
      setCoords(null);
    }
  }, [editor, containerRef]);

  useEffect(() => {
    if (!editor) return;

    updatePosition();

    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);
    editor.on("focus", updatePosition);
    editor.on("blur", updatePosition);

    const container = containerRef.current;
    window.addEventListener("resize", updatePosition);
    container?.addEventListener("scroll", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
      editor.off("focus", updatePosition);
      editor.off("blur", updatePosition);
      window.removeEventListener("resize", updatePosition);
      container?.removeEventListener("scroll", updatePosition);
    };
  }, [editor, updatePosition, containerRef]);

  if (!isActive || !coords || !editor) return null;

  return (
    <div
      ref={barRef}
      className="table-floating-bar"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      role="toolbar"
      aria-label="Table management"
    >
      <button
        type="button"
        className="table-bar-btn"
        onClick={() => editor.chain().focus().addRowAfter().run()}
        onMouseDown={(e) => e.preventDefault()}
        title="Add Row Below"
      >
        + Row
      </button>
      <button
        type="button"
        className="table-bar-btn is-danger"
        onClick={() => editor.chain().focus().deleteRow().run()}
        onMouseDown={(e) => e.preventDefault()}
        title="Delete Current Row"
      >
        - Row
      </button>

      <span className="table-bar-separator" aria-hidden="true" />

      <button
        type="button"
        className="table-bar-btn"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        onMouseDown={(e) => e.preventDefault()}
        title="Add Column Right"
      >
        + Col
      </button>
      <button
        type="button"
        className="table-bar-btn is-danger"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        onMouseDown={(e) => e.preventDefault()}
        title="Delete Current Column"
      >
        - Col
      </button>

      <span className="table-bar-separator" aria-hidden="true" />

      <button
        type="button"
        className="table-bar-btn is-danger is-delete-table"
        onClick={() => editor.chain().focus().deleteTable().run()}
        onMouseDown={(e) => e.preventDefault()}
        title="Delete Entire Table"
      >
        Del Table
      </button>
    </div>
  );
}
