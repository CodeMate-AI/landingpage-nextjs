import type { Metadata } from "next";
import { hpMetadata } from "./config/hpData";

// Sourced page metadata from centralized config module
export const metadata: Metadata = {
  title: hpMetadata.title,
  description: hpMetadata.description,
  alternates: {
    canonical: hpMetadata.canonical,
  },
  keywords: [...hpMetadata.keywords],
  openGraph: {
    title: hpMetadata.title,
    description: hpMetadata.description,
    type: "website",
    siteName: "CodeMate AI",
    images: [
      {
        url: hpMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: `${hpMetadata.title} - Next Gen AI PCs`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: hpMetadata.title,
    description: hpMetadata.description,
    images: [hpMetadata.ogImage],
  },
};

export default function HPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="custom-cursor min-h-screen">{children}</div>;
}
