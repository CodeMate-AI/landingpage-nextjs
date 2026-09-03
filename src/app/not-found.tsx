import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | CodeMate AI",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-4 text-center">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-zinc-200 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
