import "./docs.css";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsThemeSync } from "./DocsThemeSync";
import { AskAI } from "./AskAI";
import { buildPageTree, getPublishedNav, getPublishedIndex } from "@/lib/docs-data";

export const revalidate = 60;

export default async function Layout({ children }: { children: ReactNode }) {
  const [nav, pages] = await Promise.all([getPublishedNav(), getPublishedIndex()]);

  return (
    <RootProvider search={{ options: { api: "/api/search" } }}>
      <DocsThemeSync />
      <DocsLayout tree={buildPageTree(nav, pages)} nav={{ title: "CodeMate Docs", url: "/docs", children: <AskAI /> }}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
