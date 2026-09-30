"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { BlogDetailPost, Tag } from "@/types/blog";

interface Props {
  post: BlogDetailPost;
  posts: BlogDetailPost[];
  isPreview?: boolean;
}

const StaticArticle = React.memo(({ htmlContent }: { htmlContent: string }) => {
  return <article className="article-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
});
StaticArticle.displayName = "StaticArticle";

export default function BlogPostClient({ post, posts, isPreview = false }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const liveUrl = `https://codemate.ai/blog/${post.slug}`;
  const [shareUrl, setShareUrl] = useState(liveUrl);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPreview) {
      setShareUrl(liveUrl);
    } else if (typeof window !== "undefined") {
      setShareUrl(window.location.origin + "/blog/" + post.slug);
    }
  }, [post.slug, isPreview, liveUrl]);

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return "CM";
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current || !post.sections || post.sections.length === 0) {
        return;
      }

      const element = articleRef.current;
      const elementOffset = element.offsetTop;
      const elementHeight = element.scrollHeight;
      const windowHeight = window.innerHeight;
      const totalScrollableHeight = elementHeight - windowHeight;

      if (totalScrollableHeight > 0) {
        const scrolled = ((window.scrollY - elementOffset) / totalScrollableHeight) * 100;
        setScrollProgress(Math.min(Math.max(scrolled, 0), 100));
      }

      // If user reaches near the bottom of the page, activate the last section
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const scrollBottom = window.scrollY + window.innerHeight;
      if (docHeight - scrollBottom <= 120) {
        setActiveSection(post.sections[post.sections.length - 1].id);
        return;
      }

      const scrollPosition = window.scrollY + Math.min(220, window.innerHeight * 0.3);

      const firstSectionEl = document.getElementById(post.sections[0].id);
      if (firstSectionEl) {
        const firstSectionTop = firstSectionEl.getBoundingClientRect().top + window.scrollY;
        if (scrollPosition < firstSectionTop) {
          setActiveSection("");
          return;
        }
      }

      let currentSectionId = post.sections[0]?.id || "";

      for (const section of post.sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPosition) {
            currentSectionId = section.id;
          } else {
            break;
          }
        }
      }
      setActiveSection(currentSectionId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [post.sections]);

  useEffect(() => {
    const summaries = articleRef.current?.querySelectorAll(".faq-pill-summary");
    if (!summaries) return;

    const listeners: (() => void)[] = [];

    summaries.forEach((summary) => {
      const card = summary.closest(".faq-pill-card");
      const answer = card?.querySelector(".faq-answer-body") as HTMLElement;
      const badge = card?.querySelector(".faq-circle-badge");
      
      if (!card || !answer || !badge) return;

      // Initial state: ensure closed representation
      answer.style.display = "none";
      badge.textContent = "+";

      const toggle = () => {
        const isOpen = card.classList.contains("open");
        if (isOpen) {
          card.classList.remove("open");
          answer.style.display = "none";
          badge.textContent = "+";
        } else {
          // Close any other open FAQ cards
          summaries.forEach((otherSummary) => {
            const otherCard = otherSummary.closest(".faq-pill-card");
            if (otherCard && otherCard !== card && otherCard.classList.contains("open")) {
              otherCard.classList.remove("open");
              const otherAnswer = otherCard.querySelector(".faq-answer-body") as HTMLElement;
              const otherBadge = otherCard.querySelector(".faq-circle-badge");
              if (otherAnswer) otherAnswer.style.display = "none";
              if (otherBadge) otherBadge.textContent = "+";
            }
          });

          card.classList.add("open");
          answer.style.display = "block";
          badge.textContent = "−";
        }
      };

      summary.addEventListener("click", toggle);
      listeners.push(() => summary.removeEventListener("click", toggle));
    });

    return () => {
      listeners.forEach((cleanup) => cleanup());
    };
  }, [post.htmlContent]);

  const handleCopyLink = async () => {
    const urlToCopy = isPreview
      ? liveUrl
      : (typeof window !== "undefined" ? window.location.origin + "/blog/" + post.slug : liveUrl);
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const currentIndex = posts.findIndex((candidate) => candidate.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const relatedPosts = posts.filter((candidate) => candidate.id !== post.id).slice(0, 3);

  const uniqueTags = useMemo<Tag[]>(() => {
    const seen = new Set<string>();
    const result: Tag[] = [];
    for (const tag of post.tags || []) {
      const norm = tag && tag.label ? tag.label.trim().toUpperCase() : "";
      if (norm && !seen.has(norm)) {
        seen.add(norm);
        result.push(tag);
      }
    }
    return result;
  }, [post.tags]);

  return (
    <>
      {!isPreview && (
        <div className="reading-progress">
          <div className="reading-progress-fill" style={{ width: `${scrollProgress}%` }}></div>
        </div>
      )}

      <header className="article-hero container">
        <div className="hero-grid">
          <div className="hero-text">
            <h1 className="article-title">{post.title}</h1>
            {post.dek ? <p className="hero-dek">{post.dek}</p> : null}
            <div className="byline-row">
              {post.authorImage ? (
                <img
                  src={post.authorImage}
                  alt={post.author || "Author"}
                  className="byline-avatar"
                />
              ) : (
                <svg className="byline-avatar" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#3b82f6" fillOpacity="0.15" />
                  <text x="20" y="25" textAnchor="middle" fontFamily="Montserrat" fontSize="14" fill="#60a5fa" fontWeight="700">
                    {getInitials(post.author)}
                  </text>
                </svg>
              )}
              {post.author ? (
                <>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{post.author}</span>
                  <span className="byline-divider"></span>
                </>
              ) : null}
              {post.authorRole ? (
                <>
                  <span style={{ color: "var(--text-secondary)" }}>{post.authorRole}</span>
                  <span className="byline-divider"></span>
                </>
              ) : null}
              <span>{post.date}</span>
              <span className="byline-divider"></span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="article-layout" ref={articleRef}>
        <aside className="toc-sidebar">
          <div className="toc-title">On this page</div>
          <ul className="toc-list">
            {post.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleSectionClick(e, section.id)}
                  className={`toc-item ${activeSection === section.id ? "active" : ""}`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="article-content-wrap">
          <StaticArticle htmlContent={post.htmlContent ?? ""} />
        </div>

        <aside className="utility-rail">
          <div className="rail-section">
            <div className="rail-section-title">Share</div>
            <div className="rail-share">
                <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Check out this article: "${post.title}"`)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rail-share-btn" aria-label="Share on X">
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rail-share-btn" aria-label="Share on LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-section-title">Link of Blog Page</div>
            <div className={`rail-link-box ${copied ? "copied" : ""}`} onClick={handleCopyLink} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }} suppressHydrationWarning>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span suppressHydrationWarning style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "12px", fontWeight: 500, color: copied ? "#10b981" : "var(--text-secondary)", userSelect: "none" }}>
                {copied ? "Link Copied!" : "Copy link"}
              </span>
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-section-title">Tags</div>
            <div className="rail-tags">
              {(() => {
                const displayRailTags = uniqueTags.slice(0, 3);
                const overflowRailCount = uniqueTags.length - 3;
                return (
                  <>
                    {displayRailTags.map((tag, idx) => (
                      <span key={idx} className="rail-tag">
                        {tag.label}
                      </span>
                    ))}
                    {overflowRailCount > 0 && (
                      <span className="rail-tag text-neutral-400" title={`${overflowRailCount} more tags`}>
                        +{overflowRailCount}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </aside>
      </div>

      {!isPreview && (
        <>
          <div className="end-article container">
            <div className="post-nav">
              {prevPost ? (
                <Link href={`/blog/${prevPost.slug}`} prefetch={true} className="post-nav-card">
                  <span className="post-nav-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Previous
                  </span>
                  <span className="post-nav-title">{prevPost.title}</span>
                </Link>
              ) : (
                <div></div>
              )}
              {nextPost ? (
                <Link href={`/blog/${nextPost.slug}`} prefetch={true} className="post-nav-card">
                  <span className="post-nav-label">
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                  <span className="post-nav-title">{nextPost.title}</span>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <section className="related-section container">
            <h3 className="related-heading">Related posts</h3>
            <div className="related-grid">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} prefetch={true} className="card">
                  <div className="card-visual" style={{ background: "#07111f" }}>
                    <div dangerouslySetInnerHTML={{ __html: relatedPost.visualMarkup ?? "" }} />
                  </div>
                  <div className="card-body">
                    <div className="card-pills">
                      {(() => {
                        const seen = new Set<string>();
                        const uniqueCardTags: Tag[] = [];
                        for (const t of relatedPost.tags || []) {
                          const norm = (t.label || "").trim().toUpperCase();
                          if (norm && !seen.has(norm)) {
                            seen.add(norm);
                            uniqueCardTags.push(t);
                          }
                        }
                        const displayTags = uniqueCardTags.slice(0, 2);
                        const overflowCount = uniqueCardTags.length - 2;

                        return (
                          <>
                            {displayTags.map((tag, tagIdx) => (
                              <span key={tagIdx} className={`pill pill-${tag.tone}`}>
                                {tag.label}
                              </span>
                            ))}
                            {overflowCount > 0 && (
                              <span className="pill pill-slate text-neutral-400" title={`${overflowCount} more tags`}>
                                +{overflowCount}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <div className="card-title">{relatedPost.title}</div>
                    <p className="card-excerpt">{relatedPost.dek}</p>
                    <div className="card-footer">
                      {relatedPost.authorImage ? (
                        <img
                          src={relatedPost.authorImage}
                          alt={relatedPost.author || "Author"}
                          className="card-avatar"
                          width={24}
                          height={24}
                          loading="lazy"
                        />
                      ) : (
                        <svg className="card-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#3b82f6" fillOpacity="0.15" />
                          <text x="12" y="16" textAnchor="middle" fontFamily="Montserrat" fontSize="9" fill="#22d3ee" fontWeight="700">
                            {getInitials(relatedPost.author)}
                          </text>
                        </svg>
                      )}
                      <span>{relatedPost.author || ""}</span>
                      <span>·</span>
                      <span>{relatedPost.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
