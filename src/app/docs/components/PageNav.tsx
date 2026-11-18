import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Entry = { slug: string; title: string } | undefined;

const card =
  "flex min-w-0 flex-1 flex-col gap-1 rounded-xl border border-fd-border p-4 text-sm transition hover:bg-fd-accent";

// Previous and next page in sidebar order
export function PageNav({ prev, next }: { prev: Entry; next: Entry }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Pages" className="mt-10 flex flex-col gap-3 sm:flex-row">
      {prev ? (
        <Link href={`/docs/${prev.slug}`} className={card}>
          <span className="inline-flex items-center gap-1 font-medium"><ChevronLeft className="size-4 shrink-0" aria-hidden />{prev.title}</span>
          <span className="text-fd-muted-foreground">Previous page</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link href={`/docs/${next.slug}`} className={`${card} sm:text-end`}>
          <span className="inline-flex items-center gap-1 font-medium sm:justify-end">{next.title}<ChevronRight className="size-4 shrink-0" aria-hidden /></span>
          <span className="text-fd-muted-foreground">Next page</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
    </nav>
  );
}
