// JSON stored in an HTML attribute must survive DOMPurify, which drops any attribute containing
// sequences like "-->", "]>" or "</title>". Unicode escapes keep the value valid JSON without them.
export function encodeJsonAttr(value: unknown): string {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

// Reads a JSON value back from a raw serialized attribute value. "&amp;" is decoded last so a
// literal "&lt;" in the text is not decoded twice. Returns null for missing or invalid values.
export function decodeJsonAttrValue(raw: string | null | undefined): any {
  if (!raw) return null;
  const json = raw
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Reads a JSON array back from a raw serialized attribute value, or [] for anything else
export function decodeJsonAttr(raw: string | null | undefined): any[] {
  const parsed = decodeJsonAttrValue(raw);
  return Array.isArray(parsed) ? parsed : [];
}
