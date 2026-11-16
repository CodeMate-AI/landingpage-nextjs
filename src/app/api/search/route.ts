import { getSearchApi } from "@/lib/docs-search-api";

export async function GET(request: Request) {
  return (await getSearchApi()).GET(request);
}
