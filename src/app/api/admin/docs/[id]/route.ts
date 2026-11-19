import { NextRequest, NextResponse } from "next/server";
import { invalidateDocs } from "@/lib/docs-data";
import { ObjectId } from "mongodb";
import { withAuth } from "@/lib/authWrapper";
import { getDocsDatabase } from "@/lib/mongodb";
import { DocPageSchema, buildSnapshot, draftDiffers, removeSlug, versionFilter } from "@/lib/docs-validation";

type Ctx = { params: Promise<{ id: string }> };

async function getDoc(_req: NextRequest, _session: any, { params }: Ctx) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
  const db = await getDocsDatabase();
  const page = await db.collection("pages").findOne({ _id: new ObjectId(id) });
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json({ page });
}

// Saves the draft; with saveMode "publish" also freezes it into publishedVersion
async function updateDoc(req: NextRequest, session: any, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });

    const parsed = DocPageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const db = await getDocsDatabase();
    const existing = await db.collection("pages").findOne({ _id: new ObjectId(id) });
    if (!existing) return NextResponse.json({ error: "Page not found" }, { status: 404 });

    const { saveMode, version, forceOverwrite, ...draft } = parsed.data;
    const publish = saveMode === "publish";
    const now = new Date();
    const snapshot = buildSnapshot(parsed.data);

    const $set: Record<string, unknown> = {
      ...draft,
      sections: snapshot.sections,
      lastModifiedBy: { email: session?.email || "", at: now },
      updatedAt: now,
    };
    // Edit conflict guard: bump the version on every save
    const checked = typeof version === "number" && !forceOverwrite;
    $set.version = (checked ? version : existing.version || 0) + 1;
    if (publish) {
      Object.assign($set, {
        published: true,
        publishedAt: existing.publishedAt || now,
        publishedVersion: snapshot,
        hasDraftChanges: false,
      });
    } else {
      $set.hasDraftChanges = Boolean(existing.published) && draftDiffers(parsed.data, existing.publishedVersion);
    }

    try {
      // Atomic: only writes if nobody saved since the client loaded this version
      const filter = checked ? { _id: existing._id, ...versionFilter(version) } : { _id: existing._id };
      const result = await db.collection("pages").updateOne(filter, { $set });
      if (result.matchedCount === 0) {
        const latest = await db.collection("pages").findOne({ _id: existing._id }, { projection: { lastModifiedBy: 1 } });
        return NextResponse.json(
          { error: "This page was changed in another tab or by another admin.", conflict: true, lastModifiedBy: latest?.lastModifiedBy || null },
          { status: 409 }
        );
      }
    } catch (err: any) {
      if (err.code === 11000) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      throw err;
    }

    // Publishing a renamed slug must also fix the nav entries pointing at the old one
    if (publish && existing.publishedVersion?.slug && existing.publishedVersion.slug !== draft.slug) {
      const old = existing.publishedVersion.slug;
      const nav = await db.collection("nav").findOne({ _id: "main" as any });
      if (nav) {
        const rename = (t: any[]): any[] =>
          t.map((n) =>
            n.type === "group"
              ? { ...n, children: rename(n.children) }
              : n.slug === old
              ? { ...n, slug: draft.slug }
              : n
          );
        await db.collection("nav").updateOne(
          { _id: "main" as any },
          // Bump the nav version so an open sidebar editor sees the rename as a newer save
          { $set: { draft: rename(nav.draft || []), published: rename(nav.published || []) }, $inc: { version: 1 } }
        );
      }
    }

    if (publish) invalidateDocs();
    return NextResponse.json({ success: true, slug: draft.slug, version: $set.version });
  } catch (error) {
    console.error("Update doc error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function deleteDoc(_req: NextRequest, _session: any, { params }: Ctx) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });

  const db = await getDocsDatabase();
  const page = await db.collection("pages").findOneAndDelete({ _id: new ObjectId(id) });
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const nav = await db.collection("nav").findOne({ _id: "main" as any });
  if (nav) {
    const slugs = new Set([page.slug, page.publishedVersion?.slug].filter(Boolean));
    let draft = nav.draft || [];
    let published = nav.published || [];
    for (const s of slugs) {
      draft = removeSlug(draft, s);
      published = removeSlug(published, s);
    }
    // Bump the nav version so an open sidebar editor sees the removal as a newer save
    await db.collection("nav").updateOne({ _id: "main" as any }, { $set: { draft, published }, $inc: { version: 1 } });
  }

  invalidateDocs();
  return NextResponse.json({ success: true });
}

export const GET = withAuth(getDoc);
export const PUT = withAuth(updateDoc);
export const DELETE = withAuth(deleteDoc);
