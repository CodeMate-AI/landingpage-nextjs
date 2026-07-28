import { loadEnvConfig } from "@next/env";
import path from "path";
loadEnvConfig(path.resolve(__dirname, ".."));

import { generateJSON } from "@tiptap/html";
import { extensions } from "../src/lib/tiptap-extensions";
import { blogPosts } from "../src/app/blog/[slug]/posts";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Blog1Content from "../src/app/blog/[slug]/contents/Blog1Content";
import Blog2Content from "../src/app/blog/[slug]/contents/Blog2Content";
import Blog3Content from "../src/app/blog/[slug]/contents/Blog3Content";
import Blog4Content from "../src/app/blog/[slug]/contents/Blog4Content";

const componentMap: Record<number, React.ComponentType> = {
  1: Blog1Content,
  2: Blog2Content,
  3: Blog3Content,
  4: Blog4Content,
};

async function main() {
  const { default: clientPromise } = await import("../src/lib/mongodb");
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  console.log("Migrating static articles into MongoDB...");

  for (const post of blogPosts) {
    const ContentComponent = componentMap[Number(post.id)];
    if (!ContentComponent) {
      console.warn(`No static JSX layout mapped for id ${post.id}. Skipping...`);
      continue;
    }

    const htmlString = ReactDOMServer.renderToStaticMarkup(React.createElement(ContentComponent));
    const tiptapJson = generateJSON(htmlString, extensions);

    const doc = {
      title: post.title,
      slug: post.slug,
      excerpt: post.dek,
      coverImage: post.image || "",
      category: post.category,
      tags: post.tags,
      readTime: post.readTime,
      content: tiptapJson,
      published: true,
      publishedAt: new Date(post.dateValue),
      views: 0,
      author: "Ayush Singhal",
      createdAt: new Date(post.dateValue),
      updatedAt: new Date(),
    };

    await db.collection("blogs").updateOne({ slug: post.slug }, { $set: doc }, { upsert: true });

    console.log(`Successfully migrated: ${post.title}`);
  }

  console.log("Static blog migration successfully finished.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration script failure:", err);
  process.exit(1);
});
