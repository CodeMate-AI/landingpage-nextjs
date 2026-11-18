"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";

const norm = (u: string) => u.replace(/\/+$/, "");
const contains = (node: PageTree.Node, url: string): boolean =>
  node.type === "page" ? norm(node.url) === url : node.type === "folder" ? node.children.some((c) => contains(c, url)) : false;

function Folder({ node, url }: { node: PageTree.Folder; url: string }) {
  const hasActive = contains(node, url);
  const [open, setOpen] = useState(hasActive);
  // Open the folder that holds the page when the route changes (the reader can still toggle it)
  const [seen, setSeen] = useState(hasActive);
  if (hasActive !== seen) {
    setSeen(hasActive);
    if (hasActive) setOpen(true);
  }
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-start text-sm text-fd-muted-foreground transition hover:text-fd-foreground lg:min-h-9"
      >
        <span className={hasActive ? "font-medium text-fd-foreground" : undefined}>{node.name}</span>
        <ChevronRight className={`size-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul className="ms-3 border-s border-fd-border ps-2">
          {node.children.map((c, i) => (
            <Item key={i} node={c} url={url} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Item({ node, url }: { node: PageTree.Node; url: string }) {
  if (node.type === "folder") return <Folder node={node} url={url} />;
  if (node.type !== "page") return null;
  const active = norm(node.url) === url;
  return (
    <li>
      <Link
        href={node.url}
        data-active={active}
        aria-current={active ? "page" : undefined}
        className="flex min-h-11 items-center rounded-md px-3 py-1.5 text-sm text-fd-muted-foreground transition hover:text-fd-foreground data-[active=true]:bg-fd-accent data-[active=true]:font-medium data-[active=true]:text-fd-foreground lg:min-h-9"
      >
        {node.name}
      </Link>
    </li>
  );
}

export function SidebarTree({ tree }: { tree: PageTree.Root }) {
  const pathname = norm(usePathname());
  const ref = useRef<HTMLUListElement>(null);
  // Bring the current page into view when the sidebar first shows
  useEffect(() => {
    ref.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, []);
  return (
    <ul ref={ref} className="flex flex-col gap-0.5">
      {tree.children.map((n, i) => (
        <Item key={i} node={n} url={pathname} />
      ))}
    </ul>
  );
}

// Desktop: sticky column with its own scroll, no collapse button
export function DocsSidebar({ tree }: { tree: PageTree.Root }) {
  return (
    // The wrapper's bottom padding keeps the sticky sidebar from touching the footer at the end of the page
    <div className="hidden pb-12 lg:block">
      <aside
        aria-label="Docs navigation"
        className="docs-scroll sticky top-[var(--docs-header-height)] h-[calc(100dvh-var(--docs-header-height))] overflow-y-auto pb-6 pe-2 pt-4"
      >
        <SidebarTree tree={tree} />
      </aside>
    </div>
  );
}
