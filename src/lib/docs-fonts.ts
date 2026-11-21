import { Instrument_Serif, Manrope } from "next/font/google";

// The one place the docs typefaces are chosen: headings in Instrument Serif, everything else in Manrope.
// Used by the public docs layout and the docs CMS editor, so both always match. Swap a font here to change both.
export const docsBodyFont = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--docs-font-body" });
// Instrument Serif ships in a single weight (400); italic is loaded too so italic text in a heading is real, not slanted by the browser
export const docsHeadingFont = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--docs-font-heading" });

// Classes that define --docs-font-body and --docs-font-heading on an element
export const docsFontVars = `${docsBodyFont.variable} ${docsHeadingFont.variable}`;
