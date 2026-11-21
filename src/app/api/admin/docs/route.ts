import { NextRequest, NextResponse } from "next/server";
import { invalidateDocs, publishedSlugTaken } from "@/lib/docs-data";
import { withAuth } from "@/lib/authWrapper";
import { getDocsDatabase } from "@/lib/mongodb";
import { DocPageSchema, buildSnapshot } from "@/lib/docs-validation";

// Lists all docs pages (small set, no pagination)
async function listDocs() {
  const db = await getDocsDatabase();
  const pages = await db
    .collection("pages")
    .find({}, { projection: { slug: 1, "publishedVersion.slug": 1, title: 1, published: 1, hasDraftChanges: 1, updatedAt: 1 } })
    .sort({ updatedAt: -1 })
    .toArray();
  return NextResponse.json({ pages });
}

// Creates a docs page as draft, or published immediately when saveMode is "publish"
async function createDoc(req: NextRequest, session: any) {
  try {
    const parsed = DocPageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    // version/forceOverwrite only matter on updates; a new page starts at version 1
    const { saveMode, version: _version, forceOverwrite: _force, ...draft } = parsed.data;
    const published = saveMode === "publish";
    const now = new Date();

    const doc = {
      ...draft,
      sections: buildSnapshot(parsed.data).sections,
      published,
      publishedAt: published ? now : null,
      publishedVersion: published ? buildSnapshot(parsed.data) : null,
      hasDraftChanges: false,
      version: 1,
      lastModifiedBy: { email: session?.email || "", at: now },
      createdAt: now,
      updatedAt: now,
    };

    // The unique index only covers draft slugs; a renamed page can still be live at this URL
    if (published && (await publishedSlugTaken(draft.slug))) {
      return NextResponse.json({ error: "Another published page already uses this URL" }, { status: 409 });
    }

    const db = await getDocsDatabase();
    try {
      const result = await db.collection("pages").insertOne(doc);
      if (published) invalidateDocs();
      return NextResponse.json({ success: true, id: result.insertedId, slug: draft.slug, version: 1 }, { status: 201 });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
      throw err;
    }
  } catch (error) {
    console.error("Create doc error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = withAuth(listDocs);
export const POST = withAuth(createDoc);
