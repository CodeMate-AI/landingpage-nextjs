import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authWrapper";
import clientPromise from "@/lib/mongodb";

const INITIAL_CATEGORIES = [
  "Product",
  "CORA Updates",
  "C0 Updates",
  "Build Updates",
  "Engineering",
  "Engineering & Comparisons",
  "Security & Code Review",
  "Case Studies",
  "Community",
];

const INITIAL_PRODUCTS = [
  "CORA",
  "C0",
  "C0 Web",
  "Build",
  "AI Terminal",
  "Education",
  "PR Review Agent",
];

const INITIAL_USE_CASES = [
  "Code Review",
  "Agents",
  "Security",
  "Enterprise",
  "Onboarding",
  "Testing",
];

async function getFiltersDocument(db: any) {
  let doc = await db.collection("filter_options").findOne({ _id: "global_filters" as any });
  if (!doc) {
    doc = {
      _id: "global_filters",
      categories: INITIAL_CATEGORIES,
      productFilters: INITIAL_PRODUCTS,
      useCaseFilters: INITIAL_USE_CASES,
    };
    await db.collection("filter_options").insertOne(doc as any);
  }
  return doc;
}

async function getFiltersHandler(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const doc = await getFiltersDocument(db);
    return NextResponse.json(doc);
  } catch (error) {
    console.error("Failed to fetch filters:", error);
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 });
  }
}

async function updateFiltersHandler(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("codemate_blog");
    const body = await req.json();
    const { action, type, value } = body; // action: 'add' | 'delete', type: 'categories' | 'productFilters' | 'useCaseFilters', value: string

    if (!action || !type || !value) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return NextResponse.json({ error: "Value cannot be empty" }, { status: 400 });
    }

    const doc = await getFiltersDocument(db);

    let updatedList = [...(doc[type] || [])];

    if (action === "add") {
      if (updatedList.some((item: string) => item.toUpperCase() === trimmedValue.toUpperCase())) {
        return NextResponse.json({ error: `${value} already exists in ${type}` }, { status: 400 });
      }
      updatedList.push(trimmedValue);
    } else if (action === "delete") {
      updatedList = updatedList.filter((item: string) => item.toUpperCase() !== trimmedValue.toUpperCase());
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await db.collection("filter_options").updateOne(
      { _id: "global_filters" as any },
      { $set: { [type]: updatedList } }
    );

    return NextResponse.json({ success: true, [type]: updatedList });
  } catch (error) {
    console.error("Failed to update filters:", error);
    return NextResponse.json({ error: "Failed to update filters" }, { status: 500 });
  }
}

export const GET = withAuth(getFiltersHandler);
export const POST = withAuth(updateFiltersHandler);
