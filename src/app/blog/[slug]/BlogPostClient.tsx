"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { BlogDetailPost } from "./posts";
import Blog1Content from "./contents/Blog1Content";
import Blog2Content from "./contents/Blog2Content";
import Blog3Content from "./contents/Blog3Content";
import Blog4Content from "./contents/Blog4Content";

interface Props {
  post: BlogDetailPost;
  posts: BlogDetailPost[];
}

const blogContentMap: Record<number, React.ComponentType> = {
  1: Blog1Content,
  2: Blog2Content,
  3: Blog3Content,
  4: Blog4Content,
};

export default function BlogPostClient({ post, posts }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>(post.sections[0]?.id || "intro");
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) {
        return;
      }

      // 1. Calculate reading progress
      const element = articleRef.current;
      const elementOffset = element.offsetTop;
      const elementHeight = element.scrollHeight;
      const windowHeight = window.innerHeight;
      const totalScrollableHeight = elementHeight - windowHeight;

      if (totalScrollableHeight > 0) {
        const scrolled = ((window.scrollY - elementOffset) / totalScrollableHeight) * 100;
        setScrollProgress(Math.min(Math.max(scrolled, 0), 100));
      }

      // 2. Calculate active section (clearing navbar height)
      const scrollPosition = window.scrollY + 160;
      let currentSectionId = post.sections[0]?.id || "intro";

      for (const section of post.sections) {
        const el = document.getElementById(section.id);
        if (el) {
          if (el.offsetTop <= scrollPosition) {
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

  const handleCopyLink = async () => {
    const origin = window.location.origin || "https://blog.codemate.ai";
    const shareUrl = `${origin}/${post.slug}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
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

  return (
    <>
      <div className="reading-progress">
        <div className="reading-progress-fill" style={{ width: `${scrollProgress}%` }}></div>
      </div>


      <header className="article-hero container">
        <div className="hero-grid">
          <div className="hero-text">
            <h1 className="article-title">{post.title}</h1>
            <div className="byline-row">
              <svg className="byline-avatar" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#3b82f6" fillOpacity="0.15" />
                <text x="20" y="25" textAnchor="middle" fontFamily="Montserrat" fontSize="14" fill="#60a5fa" fontWeight="700">
                  AS
                </text>
              </svg>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Ayush Singhal</span>
              <span className="byline-divider"></span>
              <span style={{ color: "var(--text-secondary)" }}>Founder &amp; CEO</span>
              <span className="byline-divider"></span>
              <span>{post.date}</span>
              <span className="byline-divider"></span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="article-layout container" ref={articleRef}>
        <aside className="toc-sidebar">
          <div className="toc-title">On this page</div>
          <ul className="toc-list">
            {post.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={`toc-item ${activeSection === section.id ? "active" : ""}`}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="article-content-wrap">
          <article className="article-content">
            {(() => {
              const ContentComponent = blogContentMap[post.id];
              return ContentComponent ? <ContentComponent /> : null;
            })()}
          </article>
        </div>

        <aside className="utility-rail">
          <div className="rail-section">
            <div className="rail-section-title">Share</div>
            <div className="rail-share">
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Check out this article: "${post.title}"\n\nhttps://blog.codemate.ai/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-share-btn"
                aria-label="Share on X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://blog.codemate.ai/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-share-btn"
                aria-label="Share on LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-section-title">Link of Blog Page</div>
            <div
              className={`rail-link-box ${copied ? "copied" : ""}`}
              onClick={handleCopyLink}
              style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
              suppressHydrationWarning
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span
                suppressHydrationWarning
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: copied ? "#10b981" : "var(--text-secondary)",
                  userSelect: "none",
                }}
              >
                {copied ? "Link Copied!" : "Copy link"}
              </span>
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-section-title">Tags</div>
            <div className="rail-tags">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="rail-tag">
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="end-article container">
        <div className="post-nav">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="post-nav-card">
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
            <Link href={`/blog/${nextPost.slug}`} className="post-nav-card">
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
            <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="card">
              <div className="card-visual" style={{ background: relatedPost.bgColor }}>
                <div dangerouslySetInnerHTML={{ __html: relatedPost.visualMarkup }} />
              </div>
              <div className="card-body">
                <div className="card-pills">
                  {relatedPost.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className={`pill pill-${tag.tone}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                <div className="card-title">{relatedPost.title}</div>
                <p className="card-excerpt">{relatedPost.dek}</p>
                <div className="card-footer">
                  <svg className="card-avatar" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#3b82f6" fillOpacity="0.15" />
                    <text x="12" y="16" textAnchor="middle" fontFamily="Montserrat" fontSize="9" fill="#22d3ee" fontWeight="700">
                      AS
                    </text>
                  </svg>
                  <span>Ayush Singhal</span>
                  <span>·</span>
                  <span>{relatedPost.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
