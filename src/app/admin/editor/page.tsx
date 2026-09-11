"use client";
import React, { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminFetch } from "@/lib/admin-api-client";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { DatePicker } from "@/components/ui/date-picker";
import BlogPreviewModal from "./BlogPreviewModal";
import { compileTiptapToHtml } from "@/lib/blog-compiler";
import slugify from "@/utils/slugify";
import type { BlogDetailPost } from "@/types/blog";

// Default fallback taxonomy lists for categories, products, and use-case tags
const DEFAULT_CATEGORIES = [
  "Product",
  "CORA Updates",
  "Work Updates",
  "Build Updates",
  "Engineering",
  "Engineering & Comparisons",
  "Security & Code Review",
  "Case Studies",
  "Community",
];

const DEFAULT_PRODUCTS = [
  "CORA",
  "Work",
  "Build",
  "AI Terminal",
  "Academy",
  "PR Review Agent",
];

const DEFAULT_USE_CASES = [
  "Code Review",
  "Agents",
  "Security",
  "Enterprise",
  "Onboarding",
  "Testing",
];

// Inner editor workspace handling post drafting, media uploads, taxonomy, and TOC ( table of contents ) generation
function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamId = searchParams.get("id");
  const [postId, setPostId] = useState<string | null>(searchParamId);

  useEffect(() => {
    if (searchParamId) {
      setPostId(searchParamId);
    }
  }, [searchParamId]);

  // Core article state hooks
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subheading, setSubheading] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Dynamic filter lists loaded from MongoDB filter_options collection
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [productFilters, setProductFilters] = useState<string[]>(DEFAULT_PRODUCTS);
  const [useCaseFilters, setUseCaseFilters] = useState<string[]>(DEFAULT_USE_CASES);

  // Controlled input states for inline category and filter addition
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newUseCase, setNewUseCase] = useState("");
  const [filterSaving, setFilterSaving] = useState(false);

  // Accordion toggle states for category, product, and use-case selection panels
  const [openSections, setOpenSections] = useState({
    category: false,
    products: false,
    useCases: false,
  });

  // Toggle states for inline CRUD management mode (add/delete tag buttons)
  const [manageModes, setManageModes] = useState({
    category: false,
    products: false,
    useCases: false,
  });
  
  // Tracks existing publication state to preserve live version when updating drafts
  const [published, setPublished] = useState(false);
  // Tiptap rich-text AST document state
  const [contentJson, setContentJson] = useState<any>({ type: "doc", content: [] });
  // Article author and display metadata overrides
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [readTime, setReadTime] = useState("");
  const [publishedAtCustom, setPublishedAtCustom] = useState("");
  // Table of Contents anchor list
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);
  // Form submission and network status flags
  const [loading, setLoading] = useState(false);
  const [savingMode, setSavingMode] = useState<"draft" | "publish" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [authorUploading, setAuthorUploading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState<boolean>(Boolean(searchParamId));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const authorFileInputRef = useRef<HTMLInputElement | null>(null);
  const saveModeRef = useRef<"draft" | "publish">("draft");

  // Background Auto-Save Tracking
  const isAutosavingRef = useRef(false);
  const pendingSavePayloadRef = useRef<any>(null);
  const lastSavedSnapshotRef = useRef<string>("");
  const initialLoadedRef = useRef(false);
  const currentPostIdRef = useRef<string | null>(postId);

  useEffect(() => {
    currentPostIdRef.current = postId;
  }, [postId]);

  // Fetches existing article data from /api/admin/posts/:id when editing
  const loadPost = useCallback(async () => {
    if (!postId) {
      setIsPostLoading(false);
      initialLoadedRef.current = true;
      return;
    }
    setIsPostLoading(true);
    try {
      const res = await adminFetch(`/api/admin/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        const post = data.post;
        setTitle(post.title || "");
        setSlug(post.slug || "");
        setSubheading(post.subheading || "");
        setCategory(post.category || "General");
        setCoverImage(post.coverImage || "");
        setPublished(Boolean(post.published));
        const resolvedContent =
          post.content && typeof post.content === "object" && post.content.type === "doc"
            ? post.content
            : { type: "doc", content: [] };
        setContentJson(resolvedContent);
        setLoadError(false);
        const seenTags = new Set<string>();
        const uniqueLabels: string[] = [];
        for (const t of post.tags || []) {
          const norm = (t.label || "").trim().toUpperCase();
          if (norm && !seenTags.has(norm)) {
            seenTags.add(norm);
            uniqueLabels.push(t.label.trim());
          }
        }
        setTagsInput(uniqueLabels.join(", "));
        setSelectedFilters(
          post.filterLabels || uniqueLabels.map((l) => l.toUpperCase()) || []
        );
        const resolvedDate = post.publishedAtCustom && post.publishedAtCustom.trim() !== ""
          ? post.publishedAtCustom
          : post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : post.createdAt
          ? new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "";

        const resolvedAuthor = post.author || "Ayush Singhal";
        const resolvedAuthorRole = post.authorRole || "Founder & CEO";
        const resolvedAuthorImage = post.authorImage || "";
        const resolvedReadTime = post.readTime || "";

        setAuthor(resolvedAuthor);
        setAuthorRole(resolvedAuthorRole);
        setAuthorImage(resolvedAuthorImage);
        setReadTime(resolvedReadTime);
        setPublishedAtCustom(resolvedDate);
        setSections(post.sections || []);

        const parsedTags: { label: string; tone: "slate" }[] = uniqueLabels.map((l) => ({
          label: l,
          tone: "slate" as const,
        }));

        const loadedFilterLabels =
          post.filterLabels && post.filterLabels.length > 0
            ? post.filterLabels
            : uniqueLabels.length > 0
            ? uniqueLabels.map((l: string) => l.toUpperCase())
            : undefined;

        // Snapshot initial state using exact format as buildSavePayload to prevent spurious auto-save on load
        lastSavedSnapshotRef.current = JSON.stringify({
          title: (post.title || "").trim() || "Untitled Article",
          subheading: post.subheading || "",
          category: post.category || "General",
          coverImage: post.coverImage || "",
          published: Boolean(post.published),
          saveMode: "draft",
          tags: parsedTags.length > 0 ? parsedTags : [{ label: "Article", tone: "slate" as const }],
          filterLabels: loadedFilterLabels,
          content: resolvedContent,
          author: resolvedAuthor,
          authorRole: resolvedAuthorRole,
          authorImage: resolvedAuthorImage,
          readTime: resolvedReadTime,
          publishedAtCustom: resolvedDate,
          sections: post.sections && post.sections.length > 0 ? post.sections : undefined,
        });
        initialLoadedRef.current = true;
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        alert("Failed to load post for editing.");
        setLoadError(true);
      }
    } catch {
      alert("Failed to load post for editing.");
      setLoadError(true);
    } finally {
      setIsPostLoading(false);
      initialLoadedRef.current = true;
    }
  }, [postId, router]);

  // Trigger post loading when postId query parameter changes or restore local draft
  useEffect(() => {
    if (postId) {
      void loadPost();
    } else {
      // Check for local draft backup for a new post
      try {
        const localDraftStr = localStorage.getItem("codemate_editor_draft_new");
        if (localDraftStr) {
          const draft = JSON.parse(localDraftStr);
          if (draft.title && draft.title !== "Untitled Article") setTitle(draft.title);
          if (draft.subheading) setSubheading(draft.subheading);
          if (draft.category) setCategory(draft.category);
          if (draft.coverImage) setCoverImage(draft.coverImage);
          if (draft.tags && Array.isArray(draft.tags)) {
            setTagsInput(draft.tags.map((t: any) => t.label).join(", "));
          }
          if (draft.content) setContentJson(draft.content);
          if (draft.author) setAuthor(draft.author);
          if (draft.authorRole) setAuthorRole(draft.authorRole);
          if (draft.authorImage) setAuthorImage(draft.authorImage);
          if (draft.readTime) setReadTime(draft.readTime);
          if (draft.publishedAtCustom) setPublishedAtCustom(draft.publishedAtCustom);
          if (draft.sections) setSections(draft.sections);
        }
      } catch {
        // Ignored
      }
      initialLoadedRef.current = true;
    }
  }, [postId, loadPost]);

  // Silent background auto-save executor
  const executeAutoSave = useCallback(async (payload: any) => {
    const serialized = JSON.stringify(payload);
    if (serialized === lastSavedSnapshotRef.current) {
      return;
    }

    if (isAutosavingRef.current) {
      pendingSavePayloadRef.current = payload;
      return;
    }

    isAutosavingRef.current = true;
    const targetId = currentPostIdRef.current;

    // Always keep offline snapshot in localStorage
    try {
      const storageKey = targetId ? `codemate_editor_draft_${targetId}` : "codemate_editor_draft_new";
      localStorage.setItem(storageKey, JSON.stringify({ ...payload, updatedAt: Date.now() }));
    } catch {
      // Storage quota or privacy sandbox safely handled
    }

    try {
      const url = targetId ? `/api/admin/posts/${targetId}` : "/api/admin/posts";
      const method = targetId ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: serialized,
      });

      if (res.ok) {
        lastSavedSnapshotRef.current = serialized;
        if (!targetId) {
          const data = await res.json().catch(() => ({}));
          if (data.id) {
            const newId = data.id.toString();
            currentPostIdRef.current = newId;
            setPostId(newId);
            window.history.replaceState(null, "", `/admin/editor?id=${newId}`);
            try {
              localStorage.removeItem("codemate_editor_draft_new");
              localStorage.setItem(`codemate_editor_draft_${newId}`, JSON.stringify({ ...payload, updatedAt: Date.now() }));
            } catch {}
          }
        }
      }
    } catch {
      // Auto-save failures are non-blocking and preserved in localStorage
    } finally {
      isAutosavingRef.current = false;
      if (pendingSavePayloadRef.current) {
        const nextPayload = pendingSavePayloadRef.current;
        pendingSavePayloadRef.current = null;
        void executeAutoSave(nextPayload);
      }
    }
  }, []);

  // Builds sanitized article payload for saving, deduplicating tags and preserving custom inputs
  const buildSavePayload = (
    mode: "draft" | "publish",
    resolvedPublished: boolean,
    isAutoSave = false
  ) => {
    const seenSaveTags = new Set<string>();
    const tags: { label: string; tone: "slate" }[] = [];
    for (const raw of tagsInput.split(",")) {
      const trimmed = raw.trim();
      const norm = trimmed.toUpperCase();
      if (trimmed.length > 0 && !seenSaveTags.has(norm)) {
        seenSaveTags.add(norm);
        tags.push({ label: trimmed, tone: "slate" as const });
      }
    }

    const resolvedDate =
      publishedAtCustom && publishedAtCustom.trim() !== ""
        ? publishedAtCustom.trim()
        : resolvedPublished
        ? new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";

    return {
      title: isAutoSave ? (title.trim() || "Untitled Article") : title,
      subheading,
      category: isAutoSave ? (category || "General") : category,
      coverImage,
      published: resolvedPublished,
      saveMode: mode,
      tags: isAutoSave && tags.length === 0 ? [{ label: "Article", tone: "slate" as const }] : tags,
      filterLabels: selectedFilters.length > 0 ? selectedFilters : undefined,
      content: contentJson,
      author: isAutoSave ? (author || "Ayush Singhal") : author,
      authorRole: isAutoSave ? (authorRole || "Founder & CEO") : authorRole,
      authorImage: authorImage || "",
      readTime,
      publishedAtCustom: resolvedDate,
      sections: sections.length > 0 ? sections : undefined,
    };
  };

  // Debounced auto-save listener on editor changes
  useEffect(() => {
    if (!initialLoadedRef.current) return;

    const hasContent =
      title.trim() !== "" ||
      subheading.trim() !== "" ||
      coverImage.trim() !== "" ||
      tagsInput.trim() !== "" ||
      (contentJson.content && contentJson.content.length > 0) ||
      author.trim() !== "" ||
      sections.length > 0;

    if (!hasContent) return;

    const payload = buildSavePayload(
      "draft",
      currentPostIdRef.current ? published : false,
      true
    );

    const serialized = JSON.stringify(payload);
    if (serialized === lastSavedSnapshotRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      void executeAutoSave(payload);
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    title,
    subheading,
    category,
    coverImage,
    tagsInput,
    selectedFilters,
    contentJson,
    author,
    authorRole,
    authorImage,
    readTime,
    publishedAtCustom,
    sections,
    published,
    executeAutoSave,
  ]);

  // Keepalive flush on page unload
  useEffect(() => {
    const handleUnloadFlush = () => {
      if (!initialLoadedRef.current) return;

      const hasContent =
        title.trim() !== "" ||
        subheading.trim() !== "" ||
        coverImage.trim() !== "" ||
        tagsInput.trim() !== "" ||
        (contentJson.content && contentJson.content.length > 0) ||
        author.trim() !== "" ||
        sections.length > 0;

      if (!hasContent) return;

      const payload = buildSavePayload(
        "draft",
        currentPostIdRef.current ? published : false,
        true
      );

      const serialized = JSON.stringify(payload);
      if (serialized === lastSavedSnapshotRef.current) return;

      const targetId = currentPostIdRef.current;
      const url = targetId ? `/api/admin/posts/${targetId}` : "/api/admin/posts";
      const method = targetId ? "PUT" : "POST";

      try {
        const storageKey = targetId ? `codemate_editor_draft_${targetId}` : "codemate_editor_draft_new";
        localStorage.setItem(storageKey, JSON.stringify({ ...payload, updatedAt: Date.now() }));
      } catch {}

      try {
        void adminFetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: serialized,
          keepalive: true,
        });
      } catch {}
    };

    window.addEventListener("beforeunload", handleUnloadFlush);
    window.addEventListener("pagehide", handleUnloadFlush);
    return () => {
      window.removeEventListener("beforeunload", handleUnloadFlush);
      window.removeEventListener("pagehide", handleUnloadFlush);
    };
  }, [
    title,
    subheading,
    category,
    coverImage,
    tagsInput,
    selectedFilters,
    contentJson,
    author,
    authorRole,
    authorImage,
    readTime,
    publishedAtCustom,
    sections,
    published,
  ]);

  // Fetches dynamic filter options and categories from the database on component mount
  const loadFilters = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/filters");
      if (res.ok) {
        const data = await res.json();
        if (data.categories?.length) setCategories(data.categories);
        if (data.productFilters?.length) setProductFilters(data.productFilters);
        if (data.useCaseFilters?.length) setUseCaseFilters(data.useCaseFilters);
      }
    } catch {
      // Fallback silently to pre-populated default taxonomies
    }
  }, []);

  useEffect(() => {
    void loadFilters();
  }, [loadFilters]);

  // Handles inline addition and deletion of category and filter taxonomy items
  const handleFilterUpdate = async (
    action: "add" | "delete",
    type: "categories" | "productFilters" | "useCaseFilters",
    value: string
  ) => {
    if (!value.trim()) return;
    setFilterSaving(true);
    try {
      const res = await adminFetch("/api/admin/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, type, value: value.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (type === "categories") setCategories(data.categories);
        if (type === "productFilters") setProductFilters(data.productFilters);
        if (type === "useCaseFilters") setUseCaseFilters(data.useCaseFilters);
        // Automatically deselect item if it was deleted while selected
        if (action === "delete") {
          setSelectedFilters((prev) => prev.filter((f) => f.toUpperCase() !== value.trim().toUpperCase()));
          if (type === "categories" && category.toUpperCase() === value.trim().toUpperCase()) {
            setCategory("");
          }
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update filter options");
      }
    } catch {
      alert("Failed to update filter options");
    } finally {
      setFilterSaving(false);
    }
  };

  // Submits article payload to backend, resolving draft vs publish versioning
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavingMode(saveModeRef.current);

    // If saving as draft for an existing published post, maintain published flag
    const resolvedPublished =
      saveModeRef.current === "publish"
        ? true
        : postId
        ? published
        : false;

    // Construct full article payload via shared builder
    const payload = buildSavePayload(saveModeRef.current, resolvedPublished, false);

    try {
      // Use PUT for updating existing post or POST for creating a new post
      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = postId ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        lastSavedSnapshotRef.current = JSON.stringify(payload);
        try {
          const storageKey = postId ? `codemate_editor_draft_${postId}` : "codemate_editor_draft_new";
          localStorage.removeItem(storageKey);
          localStorage.removeItem("codemate_editor_draft_new");
        } catch {}
        router.push("/admin/dashboard");
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json();
        alert(data.error || "Save error occurred.");
      }
    } catch {
      alert("Save execution failed.");
    } finally {
      setLoading(false);
      setSavingMode(null);
    }
  };

  // Uploads cover image through the /api/admin/upload route and sets coverImage URL
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url || "");
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Image upload failed.");
      }
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Uploads author avatar image through the /api/admin/upload route and sets authorImage URL
  const handleAuthorImageUpload = async (file: File) => {
    setAuthorUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAuthorImage(data.url || "");
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Author image upload failed.");
      }
    } catch {
      alert("Author image upload failed.");
    } finally {
      setAuthorUploading(false);
    }
  };

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogDetailPost | null>(null);

  const buildPreviewPost = useCallback(() => {
    const seenPreviewTags = new Set<string>();
    const mappedTags: { label: string; tone: "blue" }[] = [];
    for (const raw of tagsInput.split(",")) {
      const trimmed = raw.trim();
      const norm = trimmed.toUpperCase();
      if (trimmed.length > 0 && !seenPreviewTags.has(norm)) {
        seenPreviewTags.add(norm);
        mappedTags.push({
          label: trimmed,
          tone: "blue" as const,
        });
      }
    }

    const { html: compiledHtml, sections: compiledSections } = compileTiptapToHtml(
      contentJson,
      sections.length > 0 ? sections : undefined,
      subheading
    );

    const previewSlug = slug || (title ? slugify(title) : "preview-post");

    const postObj: BlogDetailPost = {
      id: postId || "preview-id",
      slug: previewSlug,
      title: title || "Untitled Article",
      category: category || "General",
      date: publishedAtCustom || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      dateValue: new Date().toISOString().split("T")[0],
      tags: mappedTags.length > 0 ? mappedTags : [{ label: "Article", tone: "blue" }],
      sections: compiledSections,
      dek: subheading || "",
      readTime: readTime || "5 min read",
      htmlContent: compiledHtml,
      author: author || "Ayush Singhal",
      authorRole: authorRole || "Founder & CEO",
      authorImage: authorImage || "",
      coverImage: coverImage || "",
    };

    return postObj;
  }, [author, authorRole, authorImage, category, contentJson, coverImage, postId, publishedAtCustom, readTime, sections, slug, subheading, tagsInput, title]);

  const handleOpenPreview = () => {
    const postObj = buildPreviewPost();
    try {
      const serialized = JSON.stringify(postObj);
      sessionStorage.setItem("admin_blog_preview", serialized);
      localStorage.setItem("admin_blog_preview", serialized);
    } catch (err) {
      console.error("Failed to store preview payload:", err);
    }
    setPreviewPost(postObj);
    setIsPreviewOpen(true);
  };

  // Check if first paragraph of contentJson duplicates the subheading
  const isDuplicateSubheadingInContent = React.useMemo(() => {
    if (!subheading.trim() || !contentJson?.content || contentJson.content.length === 0) {
      return false;
    }
    const firstNode = contentJson.content[0];
    if (firstNode && firstNode.type === "paragraph") {
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanSub = normalize(subheading);
      const cleanFirst = normalize(
        (firstNode.content || []).map((c: any) => c.text || "").join("")
      );
      return Boolean(cleanFirst && (cleanFirst === cleanSub || cleanSub.startsWith(cleanFirst) || cleanFirst.startsWith(cleanSub)));
    }
    return false;
  }, [subheading, contentJson]);

  const handleRemoveDuplicateSubheadingFromContent = () => {
    if (contentJson?.content && contentJson.content.length > 0) {
      setContentJson({
        ...contentJson,
        content: contentJson.content.slice(1),
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] p-4 sm:p-6 lg:p-8 font-sans text-neutral-100">
      <div className="mx-auto max-w-4xl">
        {/* Editor page header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#27272a] pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {postId ? "Modify Article" : "Compose Article"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenPreview}
              suppressHydrationWarning
              className="rounded-lg border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-[#27272a] hover:text-white cursor-pointer"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              suppressHydrationWarning
            >
              Cancel
            </button>
          </div>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Subheading</label>
            <textarea
              required
              rows={2}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-neutral-400">
              Appears directly beneath the title and above the author details on the published post. Do not repeat this inside the content editor below.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  suppressHydrationWarning
                  className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  suppressHydrationWarning
                  className="rounded-lg border border-blue-500/20 bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Security, Comparison, CORA"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Unified Blog Folder & Sidebar Filters Panel */}
          <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Blog Classification & Filters</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Configure the category and dynamic filters for this article to organize its placement on the blog directory.
              </p>
            </div>

            <div className="space-y-3">
              {/* Accordion 1: Category */}
              <div className="rounded-lg border border-[#27272a] bg-[#09090b]/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSections((prev) => ({ ...prev, category: !prev.category }))}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-neutral-200 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Category:</span>
                    <span className="text-blue-400 font-semibold">{category || "None selected"}</span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-neutral-400 transform transition-transform ${openSections.category ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSections.category && (
                  <div className="p-4 border-t border-[#27272a]/60 bg-[#18181b]/30 space-y-4">
                    <div className="flex flex-col gap-2">
                      {categories.map((cat) => {
                        const isSelected = category === cat;
                        return (
                          <div key={cat} className="flex items-center justify-between">
                            <label
                              onClick={() => setCategory(category === cat ? "" : cat)}
                              className="flex w-fit items-center gap-2.5 cursor-pointer text-sm text-neutral-400 hover:text-neutral-200 select-none"
                            >
                              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500/20" : "border-[#27272a] bg-[#09090b]"}`}>
                                {isSelected && <div className="h-2 w-2 rounded-full bg-blue-400" />}
                              </div>
                              <span>{cat}</span>
                            </label>
                            {manageModes.category && (
                              <button
                                type="button"
                                disabled={filterSaving}
                                onClick={() => handleFilterUpdate("delete", "categories", cat)}
                                suppressHydrationWarning
                                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-[#27272a]/40 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setManageModes((prev) => ({ ...prev, category: !prev.category }))}
                        suppressHydrationWarning
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                      >
                        {manageModes.category ? "⚙️ Done Managing" : "⚙️ Manage Categories List"}
                      </button>
                    </div>

                    {manageModes.category && (
                      <div className="flex gap-1 pt-1">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Add new category…"
                          suppressHydrationWarning
                          className="flex-1 rounded border border-[#27272a] bg-[#09090b] px-2 py-1.5 text-xs text-white focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void handleFilterUpdate("add", "categories", newCategory);
                              setNewCategory("");
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={filterSaving || !newCategory.trim()}
                          onClick={() => {
                            void handleFilterUpdate("add", "categories", newCategory);
                            setNewCategory("");
                          }}
                          suppressHydrationWarning
                          className="rounded bg-blue-700 px-3 py-1.5 text-xs text-white hover:bg-blue-600 disabled:opacity-40"
                        >
                          + Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Product Filters */}
              <div className="rounded-lg border border-[#27272a] bg-[#09090b]/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSections((prev) => ({ ...prev, products: !prev.products }))}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-neutral-200 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Product Filters:</span>
                    <span className="text-blue-400 font-semibold">
                      {productFilters.filter(f => selectedFilters.includes(f.trim().toUpperCase())).length} selected
                    </span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-neutral-400 transform transition-transform ${openSections.products ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSections.products && (
                  <div className="p-4 border-t border-[#27272a]/60 bg-[#18181b]/30 space-y-4">
                    <div className="flex flex-col gap-2">
                      {productFilters.map((filter) => {
                        const normalized = filter.trim().toUpperCase();
                        const isChecked = selectedFilters.includes(normalized);
                        return (
                          <div key={filter} className="flex items-center justify-between">
                            <label className="flex w-fit items-center gap-2.5 cursor-pointer text-sm text-neutral-400 hover:text-neutral-200 select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFilters([...selectedFilters, normalized]);
                                  } else {
                                    setSelectedFilters(selectedFilters.filter((f) => f !== normalized));
                                  }
                                }}
                                className="rounded border-[#27272a] bg-[#09090b] text-blue-600 focus:ring-0 focus:ring-offset-0"
                              />
                              <span>{filter}</span>
                            </label>
                            {manageModes.products && (
                               <button
                                type="button"
                                disabled={filterSaving}
                                onClick={() => handleFilterUpdate("delete", "productFilters", filter)}
                                suppressHydrationWarning
                                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-[#27272a]/40 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setManageModes((prev) => ({ ...prev, products: !prev.products }))}
                        suppressHydrationWarning
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                      >
                        {manageModes.products ? "⚙️ Done Managing" : "⚙️ Manage Products List"}
                      </button>
                    </div>

                    {manageModes.products && (
                      <div className="flex gap-1 pt-1">
                        <input
                          type="text"
                          value={newProduct}
                          onChange={(e) => setNewProduct(e.target.value)}
                          placeholder="Add new product filter…"
                          suppressHydrationWarning
                          className="flex-1 rounded border border-[#27272a] bg-[#09090b] px-2 py-1.5 text-xs text-white focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void handleFilterUpdate("add", "productFilters", newProduct);
                              setNewProduct("");
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={filterSaving || !newProduct.trim()}
                          onClick={() => {
                            void handleFilterUpdate("add", "productFilters", newProduct);
                            setNewProduct("");
                          }}
                          suppressHydrationWarning
                          className="rounded bg-blue-700 px-3 py-1.5 text-xs text-white hover:bg-blue-600 disabled:opacity-40"
                        >
                          + Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 3: Use Case Filters */}
              <div className="rounded-lg border border-[#27272a] bg-[#09090b]/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenSections((prev) => ({ ...prev, useCases: !prev.useCases }))}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-neutral-200 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Use Case Filters:</span>
                    <span className="text-blue-400 font-semibold">
                      {useCaseFilters.filter(f => selectedFilters.includes(f.trim().toUpperCase())).length} selected
                    </span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-neutral-400 transform transition-transform ${openSections.useCases ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSections.useCases && (
                  <div className="p-4 border-t border-[#27272a]/60 bg-[#18181b]/30 space-y-4">
                    <div className="flex flex-col gap-2">
                      {useCaseFilters.map((filter) => {
                        const normalized = filter.trim().toUpperCase();
                        const isChecked = selectedFilters.includes(normalized);
                        return (
                          <div key={filter} className="flex items-center justify-between">
                            <label className="flex w-fit items-center gap-2.5 cursor-pointer text-sm text-neutral-400 hover:text-neutral-200 select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFilters([...selectedFilters, normalized]);
                                  } else {
                                    setSelectedFilters(selectedFilters.filter((f) => f !== normalized));
                                  }
                                }}
                                className="rounded border-[#27272a] bg-[#09090b] text-blue-600 focus:ring-0 focus:ring-offset-0"
                              />
                              <span>{filter}</span>
                            </label>
                            {manageModes.useCases && (
                               <button
                                type="button"
                                disabled={filterSaving}
                                onClick={() => handleFilterUpdate("delete", "useCaseFilters", filter)}
                                suppressHydrationWarning
                                className="text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-[#27272a]/40 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setManageModes((prev) => ({ ...prev, useCases: !prev.useCases }))}
                        suppressHydrationWarning
                        className="text-xs font-medium text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                      >
                        {manageModes.useCases ? "⚙️ Done Managing" : "⚙️ Manage Use Cases List"}
                      </button>
                    </div>

                    {manageModes.useCases && (
                      <div className="flex gap-1 pt-1">
                        <input
                          type="text"
                          value={newUseCase}
                          onChange={(e) => setNewUseCase(e.target.value)}
                          placeholder="Add new use case filter…"
                          suppressHydrationWarning
                          className="flex-1 rounded border border-[#27272a] bg-[#09090b] px-2 py-1.5 text-xs text-white focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void handleFilterUpdate("add", "useCaseFilters", newUseCase);
                              setNewUseCase("");
                            }
                          }}
                        />
                        <button
                          type="button"
                          disabled={filterSaving || !newUseCase.trim()}
                          onClick={() => {
                            void handleFilterUpdate("add", "useCaseFilters", newUseCase);
                            setNewUseCase("");
                          }}
                          suppressHydrationWarning
                          className="rounded bg-blue-700 px-3 py-1.5 text-xs text-white hover:bg-blue-600 disabled:opacity-40"
                        >
                          + Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Metadata overrides grid */}
          <div className="relative z-30 grid grid-cols-1 gap-6 border-t border-[#27272a] pt-6 md:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-400">Author Name</label>
                <span className="text-xs text-neutral-500">Click avatar to upload photo</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Interactive Click-to-Upload Avatar Circle */}
                <div className="relative group shrink-0">
                  <button
                    type="button"
                    disabled={authorUploading}
                    onClick={() => authorFileInputRef.current?.click()}
                    suppressHydrationWarning
                    title={authorImage ? "Click to change author photo" : "Click to upload author photo"}
                    className={`relative flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-full transition cursor-pointer ${
                      authorImage
                        ? "border border-[#27272a] bg-[#18181b] hover:border-blue-500"
                        : "border-2 border-dashed border-neutral-600 bg-[#18181b]/80 hover:border-blue-500 hover:bg-blue-500/10"
                    }`}
                  >
                    {authorUploading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                    ) : authorImage ? (
                      <>
                        <img
                          src={authorImage}
                          alt={author || "Author avatar"}
                          className="h-full w-full object-cover rounded-full"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-full">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-neutral-400 group-hover:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Upload Plus Badge for Empty State */}
                  {!authorImage && !authorUploading && (
                    <div className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow text-[11px] font-bold">
                      +
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    ref={authorFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        void handleAuthorImageUpload(file);
                        e.target.value = "";
                      }
                    }}
                  />

                  {/* Remove Button Badge if avatar exists */}
                  {authorImage && !authorUploading && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAuthorImage("");
                      }}
                      suppressHydrationWarning
                      title="Remove author avatar"
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500 shadow text-[10px] leading-none transition cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Author Name Text Input */}
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Biswajit Dash"
                  suppressHydrationWarning
                  className="w-full flex-1 rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Author Role</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. MTS"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Date of Publish</label>
              <DatePicker
                value={publishedAtCustom}
                onChange={setPublishedAtCustom}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-400">Expected Reading Time</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 7 min read"
                suppressHydrationWarning
                className="w-full rounded-lg border border-[#27272a] bg-[#18181b] p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Rich text Tiptap content editor area */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-400">Content Editor</label>
              {isDuplicateSubheadingInContent && (
                <button
                  type="button"
                  onClick={handleRemoveDuplicateSubheadingFromContent}
                  className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <span>Duplicate Subheading Detected</span>
                  <span className="underline">Remove from content</span>
                </button>
              )}
            </div>
            {loadError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                Failed to load post content. Please refresh the page or go back to the dashboard.
              </div>
            ) : isPostLoading ? (
              <div className="rounded-lg border border-[#27272a] bg-[#18181b] p-8 text-sm text-neutral-400 flex items-center justify-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-white" />
                <span>Loading post content...</span>
              </div>
            ) : (
              <SimpleEditor content={contentJson} onChange={setContentJson} />
            )}
          </div>

          {/* Table of Contents / Outline custom editor panel */}
          <div className="rounded-xl border border-[#27272a] bg-[#18181b] p-4 sm:p-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#27272a] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Table of Contents</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Define scroll sections to show on the left-side tracker.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {/* Auto-generates TOC anchors by parsing H2-H4 heading nodes from the Tiptap AST */}
                <button
                  type="button"
                  onClick={() => {
                    if (!contentJson || !contentJson.content) return;
                    
                    // Determine highest heading level.
                    // We start tracking from level 2 (h2) because level 2 (h2) is mapped
                    // visually to "Heading 1" in the CMS editor toolbar dropdown UI.
                    let minLevel = 99;
                    for (const node of contentJson.content) {
                      if (node.type === "heading" && node.attrs?.level) {
                        const lvl = node.attrs.level;
                        if (lvl >= 2 && lvl <= 4 && lvl < minLevel) {
                          minLevel = lvl;
                        }
                      }
                    }
                    const targetLevel = minLevel === 99 ? 2 : minLevel;

                    const generated: { id: string; title: string }[] = [];
                    const idCounts: Record<string, number> = {};
                    for (const node of contentJson.content) {
                      if (node.type === "heading" && node.attrs?.level === targetLevel) {
                        let titleText = "";
                        if (node.content) {
                          titleText = node.content.map((c: any) => c.text || "").join("");
                        }
                        if (titleText) {
                          const baseId = titleText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          const finalBaseId = baseId || "section";
                          let id = finalBaseId;
                          if (idCounts[finalBaseId] !== undefined) {
                            idCounts[finalBaseId]++;
                            id = `${finalBaseId}-${idCounts[finalBaseId]}`;
                          } else {
                            idCounts[finalBaseId] = 0;
                          }
                          generated.push({ id, title: titleText });
                        }
                      }
                    }
                    setSections(generated);
                  }}
                  suppressHydrationWarning
                  className="inline-flex items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition"
                >
                  Generate from Headings
                </button>
              </div>
            </div>

            {sections.length === 0 ? (
              <p className="text-sm text-neutral-500 py-2">
                No custom outline sections. Click Generate from Headings to begin.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-[#27272a]/80 bg-[#1d1d22]/40 px-4 py-3 text-neutral-300 transition duration-150 hover:bg-[#1d1d22]/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/10 text-xs font-semibold text-blue-400">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form action buttons for saving as draft vs publishing live */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center mt-4">
            {/* Draft button: Saves edits without immediately modifying public publishedVersion */}
            <button
              type="submit"
              disabled={loading}
              onClick={() => {
                saveModeRef.current = "draft";
              }}
              suppressHydrationWarning
              className="w-full sm:w-auto rounded-lg border border-[#27272a] bg-[#18181b] px-6 py-3 font-semibold text-neutral-300 transition hover:bg-[#232329] disabled:opacity-50 text-center"
            >
              {loading && savingMode === "draft" ? "Saving..." : "Save as Draft"}
            </button>
            {/* Publish button: Commits edits live and updates public publishedVersion snapshot */}
            <button
              type="submit"
              disabled={loading}
              onClick={() => {
                saveModeRef.current = "publish";
              }}
              suppressHydrationWarning
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 text-center"
            >
              {loading && savingMode === "publish" ? "Saving..." : "Save & Publish"}
            </button>
          </div>
        </form>
      </div>

      {previewPost && (
        <BlogPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          post={previewPost}
        />
      )}
    </main>
  );
}

// Root page export wrapped in React Suspense to support useSearchParams during SSR
export default function AdminEditor() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-100">Loading editor workspace...</div>}>
      <EditorContent />
    </Suspense>
  );
}
