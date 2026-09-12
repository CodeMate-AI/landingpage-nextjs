import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Showcase | CodeMate AI",
  description:
    "Explore production-grade platforms, developer tools, and internal utilities built autonomously with CodeMate's AI-native development pipeline.",
  alternates: {
    canonical: "https://codemate.ai/community",
  },
  keywords: [
    "CodeMate Community",
    "CodeMate AI Showcase",
    "Autonomous Software Development",
    "Orbit CRM",
    "AI-Native Developer Tools",
    "SWE-bench SOTA",
    "CORA Agent",
    "BUILD Prototype Mode",
  ],
  openGraph: {
    title: "Community Showcase | CodeMate AI",
    description:
      "Explore production-grade platforms, developer tools, and internal utilities built autonomously with CodeMate's AI-native development pipeline.",
    url: "https://codemate.ai/community",
    type: "website",
    siteName: "CodeMate AI",
    images: [
      {
        url: "/orbit_crm_community.png",
        width: 1200,
        height: 630,
        alt: "CodeMate AI Community Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Showcase | CodeMate AI",
    description:
      "Explore production-grade platforms, developer tools, and internal utilities built autonomously with CodeMate's AI-native development pipeline.",
    images: ["/orbit_crm_community.png"],
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
