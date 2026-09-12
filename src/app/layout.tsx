import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Analytics from "@/components/Analytics";

import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://codemate.ai'),
  title: {
    default: "CodeMate AI | Sovereign AI Pair Programmer & Code Assistant",
    template: "%s | CodeMate AI",
  },
  description: "CodeMate AI is the sovereign AI pair programmer and developer assistant. Code 10x faster with private, self-hosted AI code completion, automated code reviews, debugging, and terminal workflows. The secure alternative to GitHub Copilot, Cursor AI, Windsurf, and Tabnine.",
  keywords: [
    // Brand Keywords
    "CodeMate AI",
    "CodeMate",
    "codemate.ai",
    "Code Mate",
    "CodeMate AI Assistant",
    "CodeMate IDE",
    "CodeMate VS Code",
    // Competitor & Alternative Keywords
    "Cursor AI alternative",
    "GitHub Copilot alternative",
    "Tabnine alternative",
    "Windsurf alternative",
    "Codeium alternative",
    "Claude Code alternative",
    "Supermaven alternative",
    "Augment Code alternative",
    "Devin alternative",
    // Core Developer & AI Pair Programmer Keywords
    "AI Pair Programmer",
    "AI Coding Assistant",
    "AI Code Generator",
    "AI Code Completion",
    "AI Code Reviewer",
    "AI Refactoring",
    "AI Debugging Tool",
    "Autonomous Coding Agent",
    "AI Software Engineering",
    "AI SDLC Agent",
    "SWE-bench SOTA",
    // Sovereign & Privacy Keywords
    "Sovereign AI",
    "Self-hosted AI coding assistant",
    "Private AI code generator",
    "On-premise AI coding",
    "Enterprise AI pair programmer",
    "Air-gapped AI developer tool",
    "Secure AI coding assistant",
    "Zero data retention AI",
    // IDE & Platform Extensions
    "VS Code AI Extension",
    "Automated Code Review",
    "AI Terminal",
    "CLI AI Agent",
    "Software Development",
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
    title: "CodeMate AI | Sovereign AI Pair Programmer & Code Assistant",
    description: "Build and ship software 10x faster with private, sovereign AI that works directly in your environment. The secure alternative to GitHub Copilot and Cursor AI.",
    url: "https://codemate.ai",
    siteName: "CodeMate AI",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeMate AI - Sovereign AI Pair Programmer & Code Assistant",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMate AI | Sovereign AI Pair Programmer & Code Assistant",
    description: "Build and ship software 10x faster with private, sovereign AI that works directly in your environment. The secure alternative to GitHub Copilot and Cursor AI.",
    site: "@codemateai",
    creator: "@codemateai",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet"></link>
      </head>
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
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "@id": "https://codemate.ai/#software",
                name: "CodeMate AI",
                alternateName: ["CodeMate", "Code Mate", "CodeMate AI Assistant"],
                applicationCategory: "DeveloperApplication",
                applicationSubCategory: "AI Coding Assistant",
                description:
                  "CodeMate AI is the sovereign AI pair programmer and software development agent providing secure, private, and self-hosted code generation, code review, and debugging.",
                operatingSystem: ["Windows", "macOS", "Linux", "Web", "VS Code Extension"],
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                url: "https://codemate.ai",
              },
              {
                "@type": "Organization",
                "@id": "https://codemate.ai/#organization",
                name: "CodeMate AI",
                url: "https://codemate.ai",
                logo: "https://codemate.ai/logo.png",
                sameAs: [
                  "https://twitter.com/codemateai",
                  "https://github.com/codemateai",
                  "https://linkedin.com/company/codemateai",
                ],
              },
              {
                "@type": "WebSite",
                "@id": "https://codemate.ai/#website",
                url: "https://codemate.ai",
                name: "CodeMate AI",
                publisher: {
                  "@id": "https://codemate.ai/#organization",
                },
              },
            ],
          }),
        }}
      />
    </html>
  );
}
