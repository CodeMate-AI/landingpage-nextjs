"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogDetailPost } from "@/types/blog";

interface FilterOptions {
  categories: string[];
  productFilters: string[];
  useCaseFilters: string[];
}

interface BlogFeedClientProps {
  posts: BlogDetailPost[];
  filterOptions?: FilterOptions;
}

const DEFAULT_CATEGORIES = [
  "Product",
  "CORA Updates",
  "C0 Updates",
  "Build Updates",
  "Engineering",
  "Engineering & Comparisons",
  "Security & Code Review",
  "Case Studies",
  "Community",
];

const DEFAULT_PRODUCTS = [
  "CORA",
  "C0",
  "C0 Web",
  "Build",
  "AI Terminal",
  "Education",
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

const normalizeLabel = (label: string) => label.trim().toUpperCase();

export default function BlogFeedClient({ posts, filterOptions }: BlogFeedClientProps) {
  const categories = filterOptions?.categories ?? DEFAULT_CATEGORIES;
  const productFilters = filterOptions?.productFilters ?? DEFAULT_PRODUCTS;
  const useCaseFilters = filterOptions?.useCaseFilters ?? DEFAULT_USE_CASES;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [openGroups, setOpenGroups] = useState({
    sortBy: false,
    category: false,
    product: false,
    useCase: false,
  });

  const openMobileFilters = () => {
    setShowFilters(true);
    setShowSearch(false);
  };

  const openMobileSearch = () => {
    setShowSearch(true);
    setShowFilters(false);
  };

  useEffect(() => {
    if (showFilters || showSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters, showSearch]);

  const categoryCounts = useMemo(() => {
    return categories
      .map((cat) => ({
        name: cat,
        count: posts.filter((post) => post.category === cat).length,
      }))
      .filter((item) => item.count > 0);
  }, [posts, categories]);

  const productCounts = useMemo(() => {
    return productFilters
      .map((prod) => {
        const normalizedProd = normalizeLabel(prod);
        return {
          name: prod,
          count: posts.filter((post) => {
            const postFilterLabels = (post.filterLabels ?? post.tags.map((tag) => normalizeLabel(tag.label))).map((label) => normalizeLabel(label));
            return postFilterLabels.includes(normalizedProd);
          }).length,
        };
      })
      .filter((item) => item.count > 0);
  }, [posts, productFilters]);

  const useCaseCounts = useMemo(() => {
    return useCaseFilters
      .map((uc) => {
        const normalizedUc = normalizeLabel(uc);
        return {
          name: uc,
          count: posts.filter((post) => {
            const postFilterLabels = (post.filterLabels ?? post.tags.map((tag) => normalizeLabel(tag.label))).map((label) => normalizeLabel(label));
            return postFilterLabels.includes(normalizedUc);
          }).length,
        };
      })
      .filter((item) => item.count > 0);
  }, [posts, useCaseFilters]);

  const tickerItems = useMemo(() => {
    return posts.map((post) => {
      const parts = post.date.split(" ");
      const shortMonth = parts[0] ? parts[0].substring(0, 3) : "";
      const dayAndYear = parts.slice(1).join(" ");
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: shortMonth && dayAndYear ? `${shortMonth} ${dayAndYear}` : post.date,
      };
    });
  }, [posts]);

  // Quick-filter pills: deduplicate by normalized value, preserve original display label
  const uniqueTagLabels = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of posts) {
      for (const t of p.tags) {
        const norm = normalizeLabel(t.label);
        if (!seen.has(norm)) {
          seen.add(norm);
          result.push(t.label.trim()); // keep original casing for display
        }
      }
    }
    return result;
  }, [posts]);


  const filteredAndSortedPosts = useMemo(() => {
    const result = posts.filter((post) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.label.toLowerCase().includes(query));

      const postFilterLabels = (post.filterLabels ?? post.tags.map((tag) => normalizeLabel(tag.label))).map((label) => normalizeLabel(label));
      const matchesTag = selectedTag === null || postFilterLabels.includes(normalizeLabel(selectedTag));

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category);

      const matchesProduct =
        selectedProducts.length === 0 || postFilterLabels.some((label) => selectedProducts.map(p => normalizeLabel(p)).includes(label));

      return matchesSearch && matchesTag && matchesCategory && matchesProduct;
    });

    return result.sort((a, b) => {
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      if (sortBy === "z-a") return b.title.localeCompare(a.title);
      return b.dateValue.localeCompare(a.dateValue);
    });
  }, [posts, searchQuery, selectedTag, selectedCategories, selectedProducts, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((c) => c !== category) : [...current, category]
    );
    setVisibleCount(6);
  };

  const handleProductToggle = (product: string) => {
    setSelectedProducts((current) => {
      const normalizedProd = normalizeLabel(product);
      return current.includes(normalizedProd)
        ? current.filter((p) => p !== normalizedProd)
        : [...current, normalizedProd];
    });
    setVisibleCount(6);
  };

  const toggleGroup = (group: keyof typeof openGroups) => {
    setOpenGroups((current) => ({
      ...current,
      [group]: !current[group],
    }));
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedTag !== null ||
    selectedCategories.length > 0 ||
    selectedProducts.length > 0 ||
    sortBy !== "newest";

  const handleReset = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSelectedCategories([]);
    setSelectedProducts([]);
    setSortBy("newest");
    setShowFilters(false);
    setVisibleCount(6);
  };

  const renderSidebarFilters = () => (
    <>
      <div className="sidebar-title">
        <span>Filter and sort</span>
        {hasActiveFilters ? (
          <button suppressHydrationWarning className="clear-all-btn" onClick={handleReset}>
            Clear all
          </button>
        ) : null}
      </div>

      <div className="filter-group">
        <button
          type="button"
          className="filter-group-header"
          onClick={() => toggleGroup("sortBy")}
          aria-expanded={openGroups.sortBy}
        >
          <span>Sort by</span>
          <svg
            className={`chevron-icon ${openGroups.sortBy ? "expanded" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openGroups.sortBy ? (
          <div className="filter-options-container">
            {(["newest", "a-z", "z-a"] as const).map((opt) => {
              const isChecked = sortBy === opt;
              return (
                <div key={opt} className="filter-option-row">
                  <label className="filter-option" onClick={() => setSortBy(opt)}>
                    <span className={`fake-input fake-radio ${isChecked ? "checked" : ""}`}></span>
                    {opt === "newest" ? "Newest" : opt === "a-z" ? "A–Z" : "Z–A"}
                  </label>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="filter-group">
        <button
          type="button"
          className="filter-group-header"
          onClick={() => toggleGroup("category")}
          aria-expanded={openGroups.category}
        >
          <span>Category</span>
          <svg
            className={`chevron-icon ${openGroups.category ? "expanded" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openGroups.category ? (
          <div className="filter-options-container">
            {categoryCounts.map((cat) => {
              const isChecked = selectedCategories.includes(cat.name);
              return (
                <div key={cat.name} className="filter-option-row">
                  <label className="filter-option" onClick={() => handleCategoryToggle(cat.name)}>
                    <span className={`fake-input fake-checkbox ${isChecked ? "checked" : ""}`}></span>
                    {cat.name} ({cat.count})
                  </label>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="filter-group">
        <button
          type="button"
          className="filter-group-header"
          onClick={() => toggleGroup("product")}
          aria-expanded={openGroups.product}
        >
          <span>Product</span>
          <svg
            className={`chevron-icon ${openGroups.product ? "expanded" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openGroups.product ? (
          <div className="filter-options-container">
            {productCounts.map((prod) => {
              const isChecked = selectedProducts.includes(normalizeLabel(prod.name));
              return (
                <div key={prod.name} className="filter-option-row">
                  <label className="filter-option" onClick={() => handleProductToggle(prod.name)}>
                    <span className={`fake-input fake-checkbox ${isChecked ? "checked" : ""}`}></span>
                    {prod.name} ({prod.count})
                  </label>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="filter-group">
        <button
          type="button"
          className="filter-group-header"
          onClick={() => toggleGroup("useCase")}
          aria-expanded={openGroups.useCase}
        >
          <span>Use case</span>
          <svg
            className={`chevron-icon ${openGroups.useCase ? "expanded" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openGroups.useCase ? (
          <div className="filter-options-container">
            {useCaseCounts.map((uc) => {
              const isChecked = selectedProducts.includes(normalizeLabel(uc.name));
              return (
                <div key={uc.name} className="filter-option-row">
                  <label className="filter-option" onClick={() => handleProductToggle(uc.name)}>
                    <span className={`fake-input fake-checkbox ${isChecked ? "checked" : ""}`}></span>
                    {uc.name} ({uc.count})
                  </label>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      {/* Hero */}
      <section className="hero container">
        <div className="hero-label">The Codemate Blog</div>
        <h1>
          Where engineering teams
          <br className="hidden sm:inline" /> learn to ship faster
        </h1>
        <p className="hero-sub">
          Deep dives, product updates, and case studies for teams
          <br className="hidden sm:inline" /> building with AI-native developer tools.
        </p>
      </section>

      {/* Ticker */}
      {tickerItems.length > 0 && (
        <section className="ticker-wrap">
          <div className="ticker-fade"></div>
          <div className="ticker-track">
            <div className="ticker-set">
              {tickerItems.map((item, idx) => (
                <Link href={`/blog/${item.slug}`} className="ticker-item" key={`set1-${idx}`}>
                  <span className="ticker-category">{item.category}</span>
                  <div className="ticker-title line-clamp-2">{item.title}</div>
                  <div className="ticker-date">{item.date}</div>
                </Link>
              ))}
            </div>
            <div className="ticker-set">
              {tickerItems.map((item, idx) => (
                <Link href={`/blog/${item.slug}`} className="ticker-item" key={`set2-${idx}`}>
                  <span className="ticker-category">{item.category}</span>
                  <div className="ticker-title line-clamp-2">{item.title}</div>
                  <div className="ticker-date">{item.date}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="main-layout container">
        {/* Left Sidebar — Advanced Filters */}
        <aside className={`sidebar ${showFilters ? "open" : ""}`}>{renderSidebarFilters()}</aside>

        {/* Right: Search + Quick Filters + Cards */}
        <div className="main-content">
          {/* Search Bar + View Toggle + Quick Filter Pills */}
          <div className="content-header">
            {/* Desktop & Tablet Toolbar (width >= 768px) */}
            <div className="search-toolbar hidden md:flex">
              {/* Mobile filter toggle */}
              <button
                suppressHydrationWarning
                className="filter-toggle-btn"
                onClick={() => setShowFilters((current) => !current)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>{showFilters ? "Hide Filters" : "Filters"}</span>
              </button>

              <div className="hero-search-bar search-bar-main">
                <svg
                  className="hero-search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  suppressHydrationWarning
                  className="hero-search-input"
                  type="text"
                  placeholder="Search articles, guides, and case studies..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setVisibleCount(6);
                  }}
                />
              </div>

              <div className="view-toggle">
                <button
                  suppressHydrationWarning
                  className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                  </svg>
                </button>
                <button
                  suppressHydrationWarning
                  className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Toolbar (width < 768px) */}
            <div className="mobile-search-toolbar flex justify-between items-center w-full mb-6 md:hidden">
              {/* LHS: Filter & Search Buttons */}
              <div className="flex gap-3">
                <button onClick={openMobileFilters} className="mobile-inline-btn" aria-label="Open filters">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </button>

                <button onClick={openMobileSearch} className="mobile-inline-btn" aria-label="Open search">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>

              {/* RHS: View mode segmented toggle */}
              <div className="mobile-view-toggle">
                <button
                  suppressHydrationWarning
                  className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  aria-label="Grid view"
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                  </svg>
                </button>
                <button
                  suppressHydrationWarning
                  className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  aria-label="List view"
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Filter Pills (hidden on mobile, visible on desktop/iPad) */}
            <div className="quick-filters hidden md:flex">
              <button
                suppressHydrationWarning
                className={`quick-filter-pill ${selectedTag === null ? "active" : ""}`}
                onClick={() => {
                  setSelectedTag(null);
                  setVisibleCount(6);
                }}
              >
                All
              </button>
              {uniqueTagLabels.map((tag) => (
                <button
                  key={normalizeLabel(tag)}
                  suppressHydrationWarning
                  className={`quick-filter-pill ${selectedTag !== null && normalizeLabel(selectedTag) === normalizeLabel(tag) ? "active" : ""}`}
                  onClick={() => {
                    const norm = normalizeLabel(tag);
                    setSelectedTag(selectedTag !== null && normalizeLabel(selectedTag) === norm ? null : norm);
                    setVisibleCount(6);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Card Grid */}
          <div className={`card-grid ${viewMode === "list" ? "list" : ""}`}>
            {filteredAndSortedPosts.slice(0, visibleCount).map((post) => (
              <Link href={`/blog/${post.slug}`} className="card" key={post.id}>
                <div className="card-visual" style={{ background: "#07111f" }}>
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  ) : post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : post.visualMarkup ? (
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: post.visualMarkup }} />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-neutral-500 bg-neutral-900 font-sans text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="card-tags">
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`tag tag-${tag.tone}`}>
                        {normalizeLabel(tag.label)}
                      </span>
                    ))}
                  </div>
                  <h3 className="card-title">{post.title}</h3>
                  <div className="card-date">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>

          {filteredAndSortedPosts.length === 0 && (
            <div style={{ padding: "40px 0", color: "var(--text-secondary)", textAlign: "center" }}>
              No posts matched your current filters.
            </div>
          )}

          {filteredAndSortedPosts.length > visibleCount && (
            <div className="view-more">
              <button
                suppressHydrationWarning
                className="btn-primary"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                View more posts
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showFilters && (
          <>
            <motion.button
              className="overlay-backdrop"
              aria-label="Close filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              style={{ zIndex: 999999999999 }}
            />
            <motion.aside
              className="mobile-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              style={{ zIndex: 999999999999 }}
            >
              <div className="mobile-drawer-header">
                <span>Filter & Sort</span>
                <button
                  className="mobile-drawer-close"
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>
              <div className="mobile-drawer-body">{renderSidebarFilters()}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSearch && (
          <>
            <motion.button
              className="overlay-backdrop"
              aria-label="Close search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              style={{ zIndex: 999999999999 }}
            />
            <motion.div
              className="search-modal"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ type: "tween", duration: 0.2 }}
              style={{ zIndex: 999999999999 }}
            >
              <div className="search-modal-header">
                <span>Search articles</span>
                <button className="search-modal-close" onClick={() => setShowSearch(false)} aria-label="Close search">
                  ×
                </button>
              </div>
              <div className="hero-search-bar search-bar-main search-modal-bar">
                <svg
                  className="hero-search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  autoFocus
                  suppressHydrationWarning
                  className="hero-search-input"
                  type="text"
                  placeholder="Search articles, guides, and case studies..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setVisibleCount(6);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setShowSearch(false);
                    }
                  }}
                />
              </div>
              <p className="search-modal-hint">Search applies instantly to the blog listing.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
