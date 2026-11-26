import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// The contact page's plain "Back to Home" link, shared so every inner page leads home the same way; className places it
export default function BackToHome({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Back to Home"
      className={`group inline-flex h-11 min-w-11 items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white ${className}`}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
      <span>Back to Home</span>
    </Link>
  );
}
