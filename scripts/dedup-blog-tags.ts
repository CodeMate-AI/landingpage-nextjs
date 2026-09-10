import { loadEnvConfig } from "@next/env";
import path from "path";
loadEnvConfig(path.resolve(__dirname, ".."));

function deduplicateTags(tags: any[] = []) {
  const seen = new Set<string>();
  const result: any[] = [];
  for (const t of tags) {
    if (!t || !t.label) continue;
    const norm = t.label.trim().toUpperCase();
    if (norm && !seen.has(norm)) {
      seen.add(norm);
      result.push({
        ...t,
        label: t.label.trim(),
      });
    }
  }
  return result;
}

function deduplicateFilterLabels(labels: string[] = []) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const l of labels) {
    if (!l) continue;
    const norm = l.trim().toUpperCase();
    if (norm && !seen.has(norm)) {
      seen.add(norm);
      result.push(norm);
    }
  }
  return result;
}

async function main() {
  const { default: clientPromise } = await import("../src/lib/mongodb");
  const client = await clientPromise;
  const db = client.db("codemate_blog");

  console.log("Deduplicating tags across all blog posts in database...");

  const posts = await db.collection("blogs").find({}).toArray();
  let updatedCount = 0;

  for (const post of posts) {
    const updateOps: Record<string, any> = {};

    if (post.tags && Array.isArray(post.tags)) {
      const dedupedTags = deduplicateTags(post.tags);
      if (dedupedTags.length !== post.tags.length) {
        updateOps.tags = dedupedTags;
      }
    }

    if (post.filterLabels && Array.isArray(post.filterLabels)) {
      const dedupedFilters = deduplicateFilterLabels(post.filterLabels);
      if (dedupedFilters.length !== post.filterLabels.length) {
        updateOps.filterLabels = dedupedFilters;
      }
    }

    if (post.publishedVersion) {
      let pubVersionUpdated = false;
      const pubVersion = { ...post.publishedVersion };

      if (pubVersion.tags && Array.isArray(pubVersion.tags)) {
        const dedupedPubTags = deduplicateTags(pubVersion.tags);
        if (dedupedPubTags.length !== pubVersion.tags.length) {
          pubVersion.tags = dedupedPubTags;
          pubVersionUpdated = true;
        }
      }

      if (pubVersion.filterLabels && Array.isArray(pubVersion.filterLabels)) {
        const dedupedPubFilters = deduplicateFilterLabels(pubVersion.filterLabels);
        if (dedupedPubFilters.length !== pubVersion.filterLabels.length) {
          pubVersion.filterLabels = dedupedPubFilters;
          pubVersionUpdated = true;
        }
      }

      if (pubVersionUpdated) {
        updateOps.publishedVersion = pubVersion;
      }
    }

    if (Object.keys(updateOps).length > 0) {
      await db.collection("blogs").updateOne({ _id: post._id }, { $set: updateOps });
      console.log(`Updated post "${post.title || post.slug}" (ID: ${post._id})`);
      updatedCount++;
    }
  }

  console.log(`Finished deduplicating tags. Total posts cleaned: ${updatedCount}/${posts.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Tag deduplication failed:", err);
  process.exit(1);
});
