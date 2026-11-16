import { getPublishedPage } from "@/lib/docs-data";
import { tiptapToMarkdown } from "@/lib/docs-markdown";

export const revalidate = 60;

// Public Markdown of one published docs page, reached as /docs/<slug>.md via a rewrite.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return new Response("Not found", { status: 404 });
  return new Response(tiptapToMarkdown(page.content, page.title, page.description), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
