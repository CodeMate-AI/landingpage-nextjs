/**
 * Central configuration for blog typography and Google Fonts.
 */

export interface FontOption {
  id: string;
  name: string;
  fontKey: string;
  family: string;
  category: "sans-serif" | "serif" | "display";
  isDefault?: boolean;
}

export const AVAILABLE_FONTS: FontOption[] = [
  {
    id: "montserrat",
    name: "Montserrat (Default)",
    fontKey: "Montserrat",
    family: "'Montserrat', sans-serif",
    category: "sans-serif",
    isDefault: true,
  },
  {
    id: "manrope",
    name: "Manrope",
    fontKey: "Manrope",
    family: "'Manrope', sans-serif",
    category: "sans-serif",
  },
  {
    id: "lexend",
    name: "Lexend",
    fontKey: "Lexend",
    family: "'Lexend', sans-serif",
    category: "sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    fontKey: "Poppins",
    family: "'Poppins', sans-serif",
    category: "sans-serif",
  },
  {
    id: "inter",
    name: "Inter",
    fontKey: "Inter",
    family: "'Inter', sans-serif",
    category: "sans-serif",
  },
  {
    id: "source-serif-4",
    name: "Source Serif 4",
    fontKey: "Source Serif 4",
    family: "'Source Serif 4', serif",
    category: "serif",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    fontKey: "DM Sans",
    family: "'DM Sans', sans-serif",
    category: "sans-serif",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    fontKey: "Space Grotesk",
    family: "'Space Grotesk', sans-serif",
    category: "display",
  },
];

export const DEFAULT_FONT: FontOption = AVAILABLE_FONTS[0];

export const GOOGLE_FONTS_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Inter:wght@400..700&family=Lexend:wght@400..700&family=Manrope:wght@400..700&family=Montserrat:ital,wght@0,400..800;1,400..800&family=Poppins:ital,wght@0,400..700;1,400..700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&family=Space+Grotesk:wght@400..700&display=swap";

/**
 * Resolves a fontKey, id, or display name to its canonical FontOption.
 */
export function getFontOption(fontKeyOrId?: string | null): FontOption {
  if (!fontKeyOrId || typeof fontKeyOrId !== "string") {
    return DEFAULT_FONT;
  }
  const normalized = fontKeyOrId.split(",")[0].replace(/['"]/g, "").trim().toLowerCase();
  const matched = AVAILABLE_FONTS.find(
    (f) =>
      f.id.toLowerCase() === normalized ||
      f.fontKey.toLowerCase() === normalized ||
      f.name.toLowerCase() === normalized
  );
  return matched || DEFAULT_FONT;
}

/**
 * Returns the CSS font-family string corresponding to the fontKey or id.
 */
export function getFontCssValue(fontKeyOrId?: string | null): string {
  const option = getFontOption(fontKeyOrId);
  return option.family;
}

/**
 * Returns the human-readable display name for the font.
 */
export function getFontDisplayName(fontKeyOrId?: string | null): string {
  const option = getFontOption(fontKeyOrId);
  return option.name;
}
