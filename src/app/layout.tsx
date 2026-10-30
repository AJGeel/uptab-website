import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { ReactNode } from "react";

import "./globals.css";
import { getBaseUrl } from "@/features/backgrounds/utils/base-url";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

const title = "UpTab — Browser Extension";
const description =
  "Enhance your browsing experience with UpTab - A customizable new tab extension.";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title,
  description,
  openGraph: { title, description, siteName: "UpTab", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  authors: [{ name: "Arthur Geel", url: "https://github.com/ajgeel" }],
  keywords: ["browser extension", "new tab", "customizable"],
  referrer: "origin",
  creator: "Arthur Geel",
  robots: { index: true, follow: true },
  category: "Browser Extensions",
};

type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => (
  <html
    lang="en"
    // Dark, so overscrolling past either end of a page shows the brand colour
    className={`${figtree.variable} bg-black`}
    // Next only glides to a #section when the page asks for smooth scrolling here
    data-scroll-behavior="smooth"
  >
    <body className="min-h-screen bg-page font-sans motion-safe:animate-fade-in">{children}</body>
    <Analytics />
  </html>
);

export default RootLayout;
