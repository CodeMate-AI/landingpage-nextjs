import { notFound, redirect } from "next/navigation";
import { firstSlug, getPublishedNav, getPublishedIndex } from "@/lib/docs-data";

export const revalidate = 60;

// /docs has no content of its own: it opens the first page in the sidebar
export default async function DocsIndex() {
  const [nav, pages] = await Promise.all([getPublishedNav(), getPublishedIndex()]);
  const slug = firstSlug(nav, pages);
  if (!slug) notFound();
  redirect(`/docs/${slug}`);
}
