import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/authWrapper";
import { getDocsDatabase } from "@/lib/mongodb";
import { NavSchema } from "@/lib/docs-validation";

const ID = "main" as any;

async function getNav() {
  const db = await getDocsDatabase();
  const nav = await db.collection("nav").findOne({ _id: ID });
  return NextResponse.json({
    draft: nav?.draft ?? [],
    published: nav?.published ?? [],
    hasDraftChanges: JSON.stringify(nav?.draft ?? []) !== JSON.stringify(nav?.published ?? []),
  });
}

// Saves the sidebar tree as draft, or as draft + published when saveMode is "publish"
async function putNav(req: NextRequest) {
  const parsed = NavSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { tree, saveMode } = parsed.data;
  const $set: Record<string, unknown> = { draft: tree, updatedAt: new Date() };
  if (saveMode === "publish") $set.published = tree;

  const db = await getDocsDatabase();
  await db.collection("nav").updateOne({ _id: ID }, { $set }, { upsert: true });

  if (saveMode === "publish") revalidatePath("/docs", "layout");
  return NextResponse.json({ success: true });
}

export const GET = withAuth(getNav);
export const PUT = withAuth(putNav);
