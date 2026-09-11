import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HP × CodeMate AI",
  description:
    "CodeMate is an AI-native SDLC agent that accelerates the entire software development lifecycle. Run CodeMate seamlessly on HP's Next Gen AI PCs with codebase security.",
  alternates: {
    canonical: "https://codemate.ai/hp",
  },
  keywords: [
    "HP",
    "CodeMate AI",
    "AI PC",
    "HP Next Gen AI PCs",
    "Software Development Lifecycle",
    "AI Pair Programmer",
    "Codebase Intelligence",
  ],
  openGraph: {
    title: "HP × CodeMate AI",
    description:
      "CodeMate is an AI-native SDLC agent that accelerates the entire software development lifecycle. Run CodeMate seamlessly on HP's Next Gen AI PCs with codebase security.",
    type: "website",
    siteName: "CodeMate AI",
    images: [
      {
        url: "/hero_workspace_v1.png",
        width: 1200,
        height: 630,
        alt: "HP x CodeMate AI - Next Gen AI PCs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HP × CodeMate AI",
    description:
      "CodeMate is an AI-native SDLC agent that accelerates the entire software development lifecycle. Run CodeMate seamlessly on HP's Next Gen AI PCs with codebase security.",
    images: ["/hero_workspace_v1.png"],
  },
};

export default function HPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="custom-cursor min-h-screen">{children}</div>;
}
