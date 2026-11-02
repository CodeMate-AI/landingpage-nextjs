const UPLOADS_BASE_URL = "https://backend.codemate.ai/uploaded/images/";
const UPLOAD_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPdfUploadId(id: string): boolean {
  return UPLOAD_ID_PATTERN.test(id);
}

export function buildPdfUploadUrl(id: string): string {
  return `${UPLOADS_BASE_URL}${id}`;
}

// Returns the upload id only for URLs on the uploads host, so other URLs are never proxied.
export function getPdfUploadId(url: string): string | null {
  if (!url.startsWith(UPLOADS_BASE_URL)) return null;

  const id = url.slice(UPLOADS_BASE_URL.length);
  return isPdfUploadId(id) ? id : null;
}

// The id stays in the path because CDNs may leave query strings out of their cache keys.
export function buildPdfProxyPath(id: string, name: string): string {
  return `/api/pdf/${id}/${encodeURIComponent(name)}.pdf`;
}

export function buildPdfProxyUrl(url: string, name: string): string | null {
  const id = getPdfUploadId(url);
  return id ? buildPdfProxyPath(id, name) : null;
}
