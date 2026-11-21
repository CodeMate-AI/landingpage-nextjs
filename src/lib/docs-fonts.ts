import { Manrope } from "next/font/google";

// The one place the docs typeface is chosen: Manrope for everything, headings included.
// Used by the public docs layout, the docs CMS editor and its preview, so all three always match. Swap it here to change all.
export const docsBodyFont = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--docs-font-body" });

// Class that defines --docs-font-body on an element
export const docsFontVars = docsBodyFont.variable;
