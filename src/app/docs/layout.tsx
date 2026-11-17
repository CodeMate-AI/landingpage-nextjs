import "./docs.css";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { Globe, Linkedin, Twitter, Youtube } from "lucide-react";
import { DocsThemeSync } from "./DocsThemeSync";
import { AskProvider } from "./ask-ai/context";
import { AskPanel } from "./ask-ai/Panel";
import { AskBar, AskTrigger } from "./ask-ai/Trigger";
import { buildPageTree, getPublishedNav, getPublishedIndex } from "@/lib/docs-data";

export const revalidate = 60;

export default async function Layout({ children }: { children: ReactNode }) {
  const [nav, pages] = await Promise.all([getPublishedNav(), getPublishedIndex()]);

  return (
    <RootProvider search={{ options: { api: "/api/search" } }}>
      <DocsThemeSync />
      <AskProvider>
        <DocsLayout
          tree={buildPageTree(nav, pages)}
          nav={{ title: "CodeMate Docs", url: "/docs", children: <AskTrigger /> }}
          // Fills the left of the sidebar footer bar next to the theme switch
          links={[
            { type: "icon", text: "CodeMate website", label: "CodeMate website", url: "https://codemate.ai", external: true, icon: <Globe /> },
            { type: "icon", text: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/company/codemateai/", external: true, icon: <Linkedin /> },
            { type: "icon", text: "X", label: "X", url: "https://twitter.com/codemateai", external: true, icon: <Twitter /> },
            { type: "icon", text: "YouTube", label: "YouTube", url: "https://www.youtube.com/@codemateai", external: true, icon: <Youtube /> },
          ]}
        >
          {children}
        </DocsLayout>
        <AskPanel />
        <AskBar />
      </AskProvider>
    </RootProvider>
  );
}
