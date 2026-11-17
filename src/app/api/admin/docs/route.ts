import { NextRequest, NextResponse } from "next/server";
import { invalidateDocs } from "@/lib/docs-data";
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
    const { saveMode, ...draft } = parsed.data;
    const published = saveMode === "publish";
    const now = new Date();

    const doc = {
      ...draft,
      sections: buildSnapshot(parsed.data).sections,
      published,
      publishedAt: published ? now : null,
      publishedVersion: published ? buildSnapshot(parsed.data) : null,
      hasDraftChanges: false,
      lastModifiedBy: { email: session?.email || "", at: now },
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDocsDatabase();
    try {
      const result = await db.collection("pages").insertOne(doc);
      if (published) invalidateDocs();
      return NextResponse.json({ success: true, id: result.insertedId, slug: draft.slug }, { status: 201 });
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
