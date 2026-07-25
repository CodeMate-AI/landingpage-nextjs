"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { blogPosts } from "./[slug]/posts";


const blogVisualMap: Record<number, React.ComponentType> = {
  1: () => (
    <img src="/online_threat_images.png" alt="online threat images" className="w-full h-full object-cover" style={{ backgroundColor: "white" }} />
  ),
  2: () => (
    <img src="/blog2CoverImage.jpeg" alt="Cora SWE-bench Verified SOTA" className="w-full h-full object-cover" style={{ backgroundColor: "#080f12" }} />
  ),
  3: () => (
    <img src="/codemateaiVSclaudecodeImageCover.png" alt="CodeMate VS Claude Code" className="w-full h-full object-cover" style={{ backgroundColor: "#07111f" }} />
  ),
  4: () => (
    <img src="/codematevsgithubcopilot.png" alt="CodeMate VS GitHub Copilot" className="w-full h-full object-cover" style={{ backgroundColor: "#07111f" }} />
  ),
};

const defaultCategories = [
  "Product",
  "CORA Updates",
  "C0 Updates",
  "Build Updates",
  "Engineering",
  "Engineering & Comparisons",
  "Security & Code Review",
  "Case Studies",
  "Community",
] as const;

const categoryCounts = defaultCategories.map((cat) => ({
  name: cat,
  count: blogPosts.filter((post) => post.category === cat).length,
}));

const tickerItems = blogPosts.map((post) => {
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

const productFilters = ["CORA", "C0", "C0 Web", "Build", "AI Terminal", "Education", "PR Review Agent"] as const;
const useCaseFilters = ["Code Review", "Agents", "Security", "Enterprise", "Onboarding", "Testing"] as const;

// Unique tag labels derived from posts for quick-filter pills
const uniqueTagLabels = Array.from(
  new Set(blogPosts.flatMap((p) => p.tags.map((t) => t.label)))
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "a-z" | "z-a">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [openGroups, setOpenGroups] = useState({
    sortBy: false,
    category: false,
    product: false,
    useCase: false,
  });

  const filteredAndSortedPosts = useMemo(() => {
    const result = blogPosts.filter((post) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.label.toLowerCase().includes(query));

      // Quick tag pill filter
      const matchesTag =
        selectedTag === null ||
        post.tags.some((t) => t.label === selectedTag);

      // Sidebar category filter
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(post.category);

      // Sidebar product filter
      const matchesProduct =
        selectedProducts.length === 0 ||
        post.tags.some((tag) => selectedProducts.includes(tag.label));

      // Sidebar use case filter
      const matchesUseCase =
        selectedUseCases.length === 0 ||
        post.tags.some((tag) => selectedUseCases.includes(tag.label)) ||
        selectedUseCases.includes(post.category);

      return matchesSearch && matchesTag && matchesCategory && matchesProduct && matchesUseCase;
    });

    return result.sort((a, b) => {
      if (sortBy === "a-z") return a.title.localeCompare(b.title);
      if (sortBy === "z-a") return b.title.localeCompare(a.title);
      return b.dateValue.localeCompare(a.dateValue);
    });
  }, [searchQuery, selectedTag, selectedCategories, selectedProducts, selectedUseCases, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category]
    );
    setVisibleCount(6);
  };

  const handleProductToggle = (product: string) => {
    setSelectedProducts((current) =>
      current.includes(product)
        ? current.filter((p) => p !== product)
        : [...current, product]
    );
    setVisibleCount(6);
  };

  const handleUseCaseToggle = (useCase: string) => {
    setSelectedUseCases((current) =>
      current.includes(useCase)
        ? current.filter((u) => u !== useCase)
        : [...current, useCase]
    );
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
    selectedUseCases.length > 0 ||
    sortBy !== "newest";

  const handleReset = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSelectedCategories([]);
    setSelectedProducts([]);
    setSelectedUseCases([]);
    setSortBy("newest");
    setShowFilters(false);
    setVisibleCount(6);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero container">
        <div className="hero-label">The Codemate Blog</div>
        <h1>
          Where engineering teams<br className="hidden sm:inline" /> learn to ship faster
        </h1>
        <p className="hero-sub">
          Deep dives, product updates, and case studies for teams<br className="hidden sm:inline" /> building with AI-native developer tools.
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
        <aside className={`sidebar ${showFilters ? "open" : ""}`}>
          <div className="sidebar-title">
            <span>Filter and sort</span>
            {hasActiveFilters ? (
              <button suppressHydrationWarning className="clear-all-btn" onClick={handleReset}>
                Clear all
              </button>
            ) : null}
          </div>

          {/* Sort by */}
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
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
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
                    <label key={opt} className="filter-option" onClick={() => setSortBy(opt)}>
                      <span className={`fake-input fake-radio ${isChecked ? "checked" : ""}`}></span>
                      {opt === "newest" ? "Newest" : opt === "a-z" ? "A–Z" : "Z–A"}
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Category */}
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
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
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
                    <label key={cat.name} className="filter-option" onClick={() => handleCategoryToggle(cat.name)}>
                      <span className={`fake-input fake-checkbox ${isChecked ? "checked" : ""}`}></span>
                      {cat.name} ({cat.count})
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Product */}
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
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openGroups.product ? (
              <div className="filter-options-container">
                {productFilters.map((prod) => {
                  const isChecked = selectedProducts.includes(prod);
                  return (
                    <label key={prod} className="filter-option" onClick={() => handleProductToggle(prod)}>
                      <span className={`fake-input fake-checkbox ${isChecked ? "checked" : ""}`}></span>
                      {prod}
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Use case */}
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
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openGroups.useCase ? (
              <div className="filter-options-container">
                {useCaseFilters.map((uc) => {
                  const isChecked = selectedUseCases.includes(uc);
                  return (
                    <label key={uc} className="filter-option" onClick={() => handleUseCaseToggle(uc)}>
                      <span className={`fake-input fake-checkbox ${isChecked ? "checked" : ""}`}></span>
                      {uc}
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>
        </aside>

        {/* Right: Search + Quick Filters + Cards */}
        <div className="main-content">

          {/* Search Bar + View Toggle + Quick Filter Pills */}
          <div className="content-header">
            <div className="search-toolbar">
              {/* Mobile filter toggle */}
              <button
                suppressHydrationWarning
                className="filter-toggle-btn"
                onClick={() => setShowFilters((current) => !current)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>{showFilters ? "Hide Filters" : "Filters"}</span>
              </button>

              <div className="hero-search-bar search-bar-main">
                <svg
                  className="hero-search-icon"
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

            {/* Quick Filter Pills */}
            <div className="quick-filters">
              <button
                suppressHydrationWarning
                className={`quick-filter-pill ${selectedTag === null ? "active" : ""}`}
                onClick={() => { setSelectedTag(null); setVisibleCount(6); }}
              >
                All
              </button>
              {uniqueTagLabels.map((tag) => (
                <button
                  key={tag}
                  suppressHydrationWarning
                  className={`quick-filter-pill ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => { setSelectedTag(selectedTag === tag ? null : tag); setVisibleCount(6); }}
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
                <div className="card-visual" style={{ background: post.bgColor }}>
                  {(() => {
                    const VisualComponent = blogVisualMap[post.id];
                    return VisualComponent ? <VisualComponent /> : null;
                  })()}
                </div>
                <div className="card-body">
                  <div className="card-tags">
                    {post.tags.map((tag, tIdx) => (
                      <span key={tIdx} className={`tag tag-${tag.tone}`}>
                        {tag.label}
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
    </>
  );
}
