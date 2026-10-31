import localFont from "next/font/local";

// Forma DJR Display local font configuration with preloading and fallback metrics
export const formaDJRDisplay = localFont({
  src: "../app/fonts/formadjrdisplay-regular.woff2",
  variable: "--font-forma-djr",
  weight: "400",
  style: "normal",
  display: "swap",
});
