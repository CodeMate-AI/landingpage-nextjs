import type { Metadata } from "next";
import { hpMetadata } from "./config/hpData";
import { formaDJRDisplay } from "@/lib/fonts";

// Sourced page metadata from centralized config module
export const metadata: Metadata = {
  // Absolute, so the root template doesn't add the brand a second time.
  title: { absolute: hpMetadata.title },
  description: hpMetadata.description,
  alternates: {
    canonical: hpMetadata.canonical,
  },
  keywords: [...hpMetadata.keywords],
  openGraph: {
    title: hpMetadata.title,
    description: hpMetadata.description,
    url: hpMetadata.canonical,
    type: "website",
    siteName: "CodeMate AI",
    locale: "en_US",
    images: [
      {
        url: hpMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: hpMetadata.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@codemateai",
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
  return <div className={`${formaDJRDisplay.variable} custom-cursor min-h-screen`}>{children}</div>;
}
