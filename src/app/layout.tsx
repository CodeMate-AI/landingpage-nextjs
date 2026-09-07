import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Analytics from "@/components/Analytics";

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://codemate.ai'),
  title: "CodeMate AI | Sovereign AI for Software Development",
  description: "Build and ship faster with AI that works where your data lives, keeping your data, code, intelligence, and AI under your control.",
  keywords: [
    "Sovereign AI",
    "AI Pair Programmer",
    "CodeMate AI",
    "AI SDLC Agent",
    "Software Development",
    "AI Code Generator",
    "VS Code AI Extension",
    "Automated Code Review",
    "AI Terminal",
  ],
  authors: [{ name: "CodeMate AI", url: "https://codemate.ai" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://codemate.ai",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "CodeMate AI | Sovereign AI for Software Development",
    description: "Build and ship faster with AI that works where your data lives, keeping your data, code, intelligence, and AI under your control.",
    url: "https://codemate.ai",
    siteName: "CodeMate AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeMate AI - Sovereign AI for Software Development",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMate AI | Sovereign AI for Software Development",
    description: "Build and ship faster with AI that works where your data lives, keeping your data, code, intelligence, and AI under your control.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased bg-zinc-950 text-white dark`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "CodeMate AI",
            description:
              "Code 10x faster as CodeMate search, navigate and understand complex codebases for you.",
            operatingSystem: ["Web", "iOS", "Android", "Windows", "MacOS", "Linux", "VS Code Extension"],
          }),
        }}
      />

    </html>
  );
}

