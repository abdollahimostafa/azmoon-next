import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";

// Do NOT export this
const yekanBakh = localFont({
  src: [
    {
      path: "../public/fonts/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-yekan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ماد",
  description: "آموزش دستیاری و ازمون آنلاین",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${yekanBakh.variable} antialiased`}>
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
