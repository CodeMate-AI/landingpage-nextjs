"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { Plugin } from "@tiptap/pm/state"

import { Heading } from "@tiptap/extension-heading"
import { textblockTypeInputRule, wrappingInputRule } from "@tiptap/core"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"

const CustomHeading = Heading.extend({
  addInputRules() {
    return [
      textblockTypeInputRule({
        find: /^(#)\s$/,
        type: this.type,
        getAttributes: () => ({ level: 2 }),
      }),
      textblockTypeInputRule({
        find: /^(##)\s$/,
        type: this.type,
        getAttributes: () => ({ level: 3 }),
      }),
      textblockTypeInputRule({
        find: /^(###)\s$/,
        type: this.type,
        getAttributes: () => ({ level: 4 }),
      }),
      textblockTypeInputRule({
        find: /^(####)\s$/,
        type: this.type,
        getAttributes: () => ({ level: 4 }),
      }),
    ]
  },
}).configure({
  levels: [2, 3, 4],
})

const CustomTaskList = TaskList.extend({
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^\s*(\[([ |x])\])\s$/,
        type: this.type,
      }),
    ]
  },
})

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { VideoNode } from "@/components/tiptap-node/video-node/video-node-extension"
import { VideoUploadNode } from "@/components/tiptap-node/video-node/video-upload-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Lib ---
import { handleImageUpload, handleVideoUpload, MAX_FILE_SIZE, MAX_VIDEO_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  onVideoClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  onVideoClick: () => void
  isMobile: boolean
}) => {
  const { editor } = useTiptapEditor()

  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
        <Button
          type="button"
          variant="ghost"
          onClick={onVideoClick}
          tooltip="Add video"
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="tiptap-button-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          <span className="tiptap-button-text">Add</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          onMouseDown={(e) => e.preventDefault()}
          title="Insert Table"
        >
          Table
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        {editor?.isActive("table") && (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={() => editor?.chain().focus().addRowAfter().run()}
              onMouseDown={(e) => e.preventDefault()}
              title="Add Row Below"
            >
              + Row
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => editor?.chain().focus().deleteRow().run()}
              onMouseDown={(e) => e.preventDefault()}
              className="text-red-400 hover:text-red-500"
              title="Delete Row"
            >
              - Row
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => editor?.chain().focus().addColumnAfter().run()}
              onMouseDown={(e) => e.preventDefault()}
              title="Add Column Right"
            >
              + Col
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => editor?.chain().focus().deleteColumn().run()}
              onMouseDown={(e) => e.preventDefault()}
              className="text-red-400 hover:text-red-500"
              title="Delete Column"
            >
              - Col
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => editor?.chain().focus().deleteTable().run()}
              onMouseDown={(e) => e.preventDefault()}
              className="text-red-500 font-bold hover:text-red-600"
              title="Delete Table"
            >
              Del Table
            </Button>
          </>
        )}
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

interface SimpleEditorProps {
  content: any
  onChange: (json: any) => void
}

export function SimpleEditor({ content, onChange }: SimpleEditorProps) {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  let editor: ReturnType<typeof useEditor> | null = null
  editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
      handleDrop: (view, event, slice, moved) => {
        if (moved) return false

        const file = event.dataTransfer?.files?.[0]
        if (!file) return false

        if (file.type.startsWith("image/")) {
          handleImageUpload(file)
            .then((url) => {
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
              const pos = coordinates ? coordinates.pos : view.state.selection.from
              const node = view.state.schema.nodes.image.create({ src: url })
              const transaction = view.state.tr.insert(pos, node)
              view.dispatch(transaction)
            })
            .catch((err) => console.error("Drop upload failed:", err))
          return true // Handled! Prevents default browser drop behavior
        }

        if (file.type.startsWith("video/")) {
          if (file.size > MAX_VIDEO_SIZE) {
            alert("Video exceeds 50MB size limit")
            return true
          }
          handleVideoUpload(file)
            .then((url) => {
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
              const pos = coordinates ? coordinates.pos : view.state.selection.from
              const node = view.state.schema.nodes.video.create({ src: url })
              const transaction = view.state.tr.insert(pos, node)
              view.dispatch(transaction)
            })
            .catch((err) => console.error("Drop video failed:", err))
          return true
        }

        return false
      },
      handlePaste: (view, event, slice) => {
        const file = event.clipboardData?.files?.[0]
        if (file && file.type.startsWith("image/")) {
          if (file.size > MAX_FILE_SIZE) {
            alert(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
            return true
          }
          handleImageUpload(file)
            .then((url) => {
              const node = view.state.schema.nodes.image.create({ src: url })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            })
            .catch((err) => console.error("Paste upload failed:", err))
          return true // Handled! Prevents default browser paste behavior
        }

        if (file && file.type.startsWith("video/")) {
          if (file.size > MAX_VIDEO_SIZE) {
            alert("Video exceeds 50MB size limit")
            return true
          }
          handleVideoUpload(file)
            .then((url) => {
              const node = view.state.schema.nodes.video.create({ src: url })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            })
            .catch((err) => console.error("Paste video failed:", err))
          return true
        }

        return false
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          setTimeout(() => {
            if (view.isDestroyed) return
            view.dispatch(view.state.tr.setStoredMarks([]))
          }, 0)
        }

        return false
      },
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      CustomHeading,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        multicolor: true,
      }),
      Subscript,
      Superscript,
      CustomTaskList,
      TaskItem.configure({ nested: true }),
      Image,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
      }),
      VideoNode,
      VideoUploadNode,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
    ],
    content,
    onUpdate({ editor }) {
      isInitializedRef.current = true
      onChange(editor.getJSON())
    },
  })


  useEffect(() => {
    if (!editor || isInitializedRef.current) return

    if (content && content.content && content.content.length > 0) {
      editor.commands.setContent(content)
      isInitializedRef.current = true
    }
  }, [content, editor])

  useEffect(() => {
    if (!isMobile) {
      setMobileView("main")
    }
  }, [isMobile])

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="simple-editor-wrapper">
        <Toolbar ref={toolbarRef}>
          {mobileView === "main" ? (
            <MainToolbarContent
              isMobile={isMobile}
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              onVideoClick={() => editor?.chain().focus().insertContent({ type: "videoUpload" }).run()}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>
        <div
          className="simple-editor-content"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              editor?.commands.focus()
            }
          }}
          style={{ cursor: "text" }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </EditorContext.Provider>
  )
}

