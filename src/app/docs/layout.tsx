import "./docs.css";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import Footer from "@/components/footer";
import { DocsThemeInit, DocsThemeSync } from "./DocsThemeSync";
import { AskProvider } from "./ask-ai/context";
import { AskPanel } from "./ask-ai/Panel";
import { AskFloating } from "./ask-ai/Trigger";
import { DocsHeader } from "./components/DocsHeader";
import { DocsSidebar } from "./components/DocsSidebar";
import { buildPageTree, getPublishedNav, getPublishedIndex } from "@/lib/docs-data";

export const revalidate = 60;

// Custom docs layout with header, sidebar, and footer
export default async function Layout({ children }: { children: ReactNode }) {
  const [nav, pages] = await Promise.all([getPublishedNav(), getPublishedIndex()]);

  return (
    <RootProvider search={{ options: { api: "/api/search" } }}>
      <DocsThemeInit />
      <DocsThemeSync />
      <AskProvider>
        <div className="docs-shell relative flex min-h-screen w-full flex-col overflow-x-clip bg-fd-background text-fd-foreground">
          <DocsHeader />
          <div className="mx-auto w-full max-w-[1440px] flex-1 px-5 sm:px-8">
            <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
              <DocsSidebar tree={buildPageTree(nav, pages)} />
              <main className="min-w-0">{children}</main>
            </div>
          </div>
          {/* Keeps footer stacking context below header and floating triggers */}
          <div className="relative z-0">
            <Footer inDocs />
          </div>
        </div>
        <AskPanel />
        <AskFloating />
      </AskProvider>
    </RootProvider>
  );
}
