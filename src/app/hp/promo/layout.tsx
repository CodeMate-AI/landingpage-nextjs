import type { Metadata } from "next";

// Only people with an invitation need this page, so it stays out of search results.
export const metadata: Metadata = {
  alternates: { canonical: "https://codemate.ai/hp/promo" },
  robots: { index: false, follow: false },
};

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
