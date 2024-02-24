import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UpTab — Browser Extension",
  description:
    "Enhance your browsing experience with UpTab - A customizable new tab extension.",
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
    className="min-h-screen bg-gradient-to-b from-white via-slate-200 to-slate-200 bg-slate-200"
  >
    <body className={dmSans.className}>{children}</body>
  </html>
);

export default RootLayout;
