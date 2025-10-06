// lib/fonts.ts
import localFont from "next/font/local";

export const yekanBakh = localFont({
  src: [
    { path: "../public/fonts/YekanBakhFaNum-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/YekanBakhFaNum-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/YekanBakhFaNum-Thin.woff2", weight: "100", style: "normal" },
  ],
  variable: "--font-yekan",
  display: "swap",
});
