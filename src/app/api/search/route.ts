import { createSearchAPI } from "fumadocs-core/search/server";
import { getSearchVersion, loadSearchIndexes } from "@/lib/docs-data";

// Fumadocs builds its index once per createSearchAPI call, so keep one per version token and
// rebuild only when a publish, rename or delete changes the token (see getSearchVersion).
let current: { version: number; api: ReturnType<typeof createSearchAPI> } | null = null;

export async function GET(request: Request) {
  const version = await getSearchVersion();
  if (current?.version !== version) {
    current = { version, api: createSearchAPI("advanced", { indexes: loadSearchIndexes }) };
  }
  return current.api.GET(request);
}
