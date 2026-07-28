"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/lib/tiptap-extensions";

interface Props {
  content: any;
  onChange: (json: any) => void;
}

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          uploadAndInsertImage(file);
          return true;
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          uploadAndInsertImage(file);
          return true;
        }
        return false;
      },
    },
  });

  const uploadAndInsertImage = async (file: File) => {
    if (!editor) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Error occurred during image upload.");
    }
  };

  const addImageByUrl = () => {
    if (!editor) return;
    const url = prompt("Enter Image URL:");
    if (!url) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Invalid Scheme: Only HTTP and HTTPS images are permitted.");
      return;
    }

    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="tiptap-editor-container border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
      <div className="editor-toolbar flex flex-wrap gap-2 p-2 border-b border-neutral-700 bg-neutral-950">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded text-sm ${editor.isActive("bold") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded text-sm ${editor.isActive("italic") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded text-sm ${editor.isActive("heading", { level: 2 }) ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded text-sm ${editor.isActive("bulletList") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Bullet List
        </button>
        <button type="button" onClick={addImageByUrl} className="p-1.5 rounded text-sm text-neutral-300 hover:bg-neutral-800">
          Add Image
        </button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[300px] outline-none text-neutral-100 prose prose-invert max-w-none" />
    </div>
  );
}
