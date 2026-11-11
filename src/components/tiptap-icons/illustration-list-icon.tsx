import React from "react";

// Semantic SVG icon representing an illustration feature list with side-by-side cards,
// optically balanced to match BentoGridIcon and Ref Blogs in height and weight
export function IllustrationListIcon({ className = "tiptap-button-icon" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <path d="M14 5.5h7" />
      <path d="M14 8.5h4.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <path d="M14 15.5h7" />
      <path d="M14 18.5h4.5" />
    </svg>
  );
}
