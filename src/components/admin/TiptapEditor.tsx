"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/lib/tiptap-extensions";

interface Props {
  content: any;
  onChange: (json: any) => void;
}

export default function TiptapEditor({ content, onChange }: Props) {
  const videoInputRef = React.useRef<HTMLInputElement>(null);
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

  const uploadAndInsertVideo = async (file: File) => {
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
        editor.chain().focus().insertContent(`<p>[video: ${data.url}]</p>`).run();
      } else {
        alert(data.error || "Video upload failed");
      }
    } catch {
      alert("Error occurred during video upload.");
    } finally {
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
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

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = prompt("Enter Link URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleVideoButtonClick = () => {
    videoInputRef.current?.click();
  };

  const handleVideoInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadAndInsertVideo(file);
  };

  if (!editor) return null;

  return (
    <div className="tiptap-editor-container overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900">
      <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoInputChange} />
      <div className="editor-toolbar flex flex-wrap gap-2 border-b border-neutral-700 bg-neutral-950 p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`rounded p-1.5 text-sm ${editor.isActive("bold") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`rounded p-1.5 text-sm ${editor.isActive("italic") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`rounded p-1.5 text-sm ${editor.isActive("heading", { level: 2 }) ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`rounded p-1.5 text-sm ${editor.isActive("bulletList") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Bullet List
        </button>
        <button type="button" onClick={setLink} className={`rounded p-1.5 text-sm ${editor.isActive("link") ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-800"}`}>
          Link
        </button>
        <button type="button" onClick={addImageByUrl} className="rounded p-1.5 text-sm text-neutral-300 hover:bg-neutral-800">
          Add Image
        </button>
        <button type="button" onClick={handleVideoButtonClick} className="rounded p-1.5 text-sm text-neutral-300 hover:bg-neutral-800">
          Add Video
        </button>
        <div className="flex gap-1 border-l border-neutral-700 pl-2">
          <button
            type="button"
            onClick={insertTable}
            className="rounded p-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
            title="Insert 3x3 Table"
          >
            Insert Table
          </button>

          {editor.isActive("table") && (
            <>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="rounded p-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
                title="Add Row Below"
              >
                + Row
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="rounded p-1.5 text-sm text-red-400 hover:bg-neutral-800"
                title="Delete Row"
              >
                - Row
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="rounded p-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
                title="Add Column Right"
              >
                + Col
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="rounded p-1.5 text-sm text-red-400 hover:bg-neutral-800"
                title="Delete Column"
              >
                - Col
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="rounded p-1.5 text-sm font-bold text-red-500 hover:bg-neutral-800"
                title="Delete Table"
              >
                Delete Table
              </button>
            </>
          )}
        </div>
      </div>
      <EditorContent editor={editor} className="min-h-[300px] p-4 text-neutral-100 outline-none prose prose-invert max-w-none" />
    </div>
  );
}
