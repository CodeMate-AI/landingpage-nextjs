import "./docs.css";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import Footer from "@/components/footer";
import { DocsThemeSync } from "./DocsThemeSync";
import { AskProvider } from "./ask-ai/context";
import { AskPanel } from "./ask-ai/Panel";
import { AskFloating } from "./ask-ai/Trigger";
import { DocsHeader } from "./components/DocsHeader";
import { DocsSidebar } from "./components/DocsSidebar";
import { buildPageTree, getPublishedNav, getPublishedIndex } from "@/lib/docs-data";

export const revalidate = 60;

// Own layout (modelled on docs.pangolin.net): header on top, sidebar and page in two columns, footer below.
// `docs-shell` makes room for the Ask AI side panel on desktop (docs.css).
export default async function Layout({ children }: { children: ReactNode }) {
  const [nav, pages] = await Promise.all([getPublishedNav(), getPublishedIndex()]);

  return (
    <RootProvider search={{ options: { api: "/api/search" } }}>
      {/* Runs before first paint: strips the body's dark classes for light mode so a full page load doesn't flash dark. DocsThemeSync keeps them in step afterwards */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("theme");if(t==="light"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: light)").matches))document.body.classList.remove("dark","bg-zinc-950","text-white")}catch(e){}`,
        }}
      />
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
          {/* The landing footer sets z-index 999999; its own stacking context keeps it under the header and the Ask AI button */}
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
