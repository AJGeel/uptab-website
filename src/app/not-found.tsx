import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import { MoodFace } from "@/components/MoodFace";
import { SiteNav } from "@/components/SiteNav";
import "@/features/home/home.css";

export const metadata: Metadata = { title: "Page not found — UpTab" };

const NotFound = () => (
  <div className="flex min-h-screen flex-col overflow-x-clip bg-black pt-24 text-dark-text antialiased">
    <SiteNav theme="dark" />
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-[clamp(1rem,4vw,2rem)] py-16 text-center">
      <div className="flex items-center gap-[0.04em] text-[clamp(6rem,24vw,13rem)] leading-none font-extrabold tracking-tighter" aria-label="404">
        <span aria-hidden="true">4</span>
        <MoodFace mood="hmm" animated className="ut-act size-[0.8em] drop-shadow-[0_20px_40px_rgba(37,177,255,0.35)]" />
        <span aria-hidden="true">4</span>
      </div>
      <h1 className="text-2xl font-bold">This tab opened to nothing</h1>
      <p className="max-w-md text-dark-muted">The page you&apos;re looking for doesn&apos;t exist, or it moved. We&apos;ll get you somewhere lovely instead.</p>
      <Link href="/" className="rounded-full bg-white px-6 py-3 font-bold text-black transition-transform hover:scale-105">
        Back to home
      </Link>
    </main>
    <Footer theme="dark" />
  </div>
);

export default NotFound;
