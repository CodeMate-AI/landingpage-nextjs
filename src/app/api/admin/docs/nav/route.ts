import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { withAuth } from "@/lib/authWrapper";
import type { TokenPayload } from "@/lib/auth";
import { getDocsDatabase } from "@/lib/mongodb";
import { NavSchema, versionFilter } from "@/lib/docs-validation";

const ID = "main" as any;

async function getNav() {
  const db = await getDocsDatabase();
  const nav = await db.collection("nav").findOne({ _id: ID });
  return NextResponse.json({
    draft: nav?.draft ?? [],
    published: nav?.published ?? [],
    hasDraftChanges: JSON.stringify(nav?.draft ?? []) !== JSON.stringify(nav?.published ?? []),
    // Edit conflict guard: the editor sends this back when it saves
    version: nav?.version ?? 0,
  });
}

// Saves the sidebar tree as draft, or as draft + published when saveMode is "publish"
async function putNav(req: NextRequest, session: TokenPayload) {
  const parsed = NavSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { tree, saveMode, version, forceOverwrite } = parsed.data;
  const now = new Date();
  const $set: Record<string, unknown> = { draft: tree, updatedAt: now, lastModifiedBy: { email: session?.email || "", at: now } };
  if (saveMode === "publish") $set.published = tree;

  const db = await getDocsDatabase();
  const checked = typeof version === "number" && !forceOverwrite;
  if (checked) {
    // Atomic: only writes if nobody saved the sidebar since the client loaded this version
    $set.version = version + 1;
    let matched = true;
    try {
      const result = await db.collection("nav").updateOne({ _id: ID, ...versionFilter(version) }, { $set }, { upsert: version === 0 });
      matched = result.matchedCount > 0 || result.upsertedCount > 0;
    } catch (err) {
      // Upsert hit the existing record (it has a newer version): that is a conflict, not a crash
      if ((err as { code?: number }).code !== 11000) throw err;
      matched = false;
    }
    if (!matched) {
      const latest = await db.collection("nav").findOne({ _id: ID }, { projection: { lastModifiedBy: 1 } });
      return NextResponse.json(
        { error: "The sidebar was changed in another tab or by another admin.", conflict: true, lastModifiedBy: latest?.lastModifiedBy || null },
        { status: 409 }
      );
    }
  } else {
    await db.collection("nav").updateOne({ _id: ID }, { $set, $inc: { version: 1 } }, { upsert: true });
  }

  if (saveMode === "publish") revalidatePath("/docs", "layout");
  const saved = await db.collection("nav").findOne({ _id: ID }, { projection: { version: 1 } });
  return NextResponse.json({ success: true, version: saved?.version ?? 0 });
}

export const GET = withAuth(getNav);
export const PUT = withAuth(putNav);
