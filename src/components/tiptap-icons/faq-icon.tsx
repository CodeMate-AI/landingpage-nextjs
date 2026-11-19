import React from "react";

// Question-and-answer icon for the FAQ block button, drawn to match the other block icons
export function FaqIcon({ className = "tiptap-button-icon" }: { className?: string }) {
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
      <rect x="3" y="3" width="18" height="7" rx="3.5" />
      <path d="M7 6.5h1M11 6.5h6" />
      <rect x="3" y="14" width="18" height="7" rx="3.5" />
      <path d="M7 17.5h1M11 17.5h6" />
    </svg>
  );
}
