"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BURST_MOODS, FaceBurst } from "@/components/FaceBurst";
import { Logo } from "@/components/Logo";
import type { Mood } from "@/components/MoodFace";
import { StoreButton } from "@/components/StoreButton";
import { externalUrls } from "@/config";
import { useScrollY } from "@/hooks/useScrollY";
import { cn } from "@/utils/cn";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

type Theme = "light" | "dark";

type NavLink = { href: Route; label: string; external?: boolean };

const links: NavLink[] = [
  { href: "/backgrounds", label: "Backgrounds" },
  { href: "/changelog", label: "Changelog" },
  { href: externalUrls.github, label: "GitHub", external: true },
];

// The home page has the FAQ on it
const homeLinks: NavLink[] = [...links.slice(0, 2), { href: "/#faq", label: "FAQ" }, ...links.slice(2)];

// The pill links need more room on the light home page
const THEMES = {
  light: {
    bar: "fixed inset-x-0 top-0 z-30 px-[clamp(1rem,4vw,3.5rem)] py-6 text-black transition-[padding] duration-300",
    barScrolled: "py-3",
    tray: "rounded-full border border-white/60 bg-white/55 p-1.5 backdrop-blur-md",
    wide: "min-[760px]:flex",
    narrow: "min-[760px]:hidden",
    link: "hover:bg-white/60",
    active: "bg-white/80",
    menuButton: "border-white/70 bg-white/70 backdrop-blur-md",
    sheet: "bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur-xl",
    sheetLink: "hover:bg-page",
    sheetActive: "bg-page",
    tone: "on-light",
  },
  dark: {
    barScrolled: "py-3",
    bar: "fixed inset-x-0 top-0 z-30 px-[clamp(1rem,4vw,3.5rem)] py-6 text-white transition-[padding] duration-300",
    // Darkens what scrolls behind it, so the white text keeps its contrast over bright photos
    tray: "rounded-full border border-white/10 bg-black/85 p-1.5 backdrop-blur-md",
    wide: "sm:flex",
    narrow: "sm:hidden",
    link: "hover:bg-dark-pill",
    active: "bg-dark-pill",
    menuButton: "border-[#2a374a] bg-dark-surface",
    sheet: "bg-dark-surface shadow-2xl ring-1 ring-[#243042]",
    sheetLink: "hover:bg-dark-pill",
    sheetActive: "bg-dark-pill",
    tone: "on-dark",
  },
} as const;

/** Long enough for a burst (1s in globals.css) to finish. */
const BURST_MS = 1200;

const MenuIcon = ({ open }: { open: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d={open ? "M5 5l10 10M15 5L5 15" : "M3.5 6h13M3.5 10h13M3.5 14h13"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const SiteNav = ({ theme }: { theme: Theme }) => {
  const t = THEMES[theme];
  const navLinks = theme === "light" ? homeLinks : links;
  const pathname = usePathname();
  const scrolled = useScrollY() > 8;
  // The logo throws a different burst every time you point at it; it plays out even if you move away
  const [isBursting, setIsBursting] = useState(false);
  const [burstMood, setBurstMood] = useState<Mood>("happy");
  const burstTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const burst = () => {
    if (isBursting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Never the same one twice in a row
    const others = BURST_MOODS.filter((mood) => mood !== burstMood);

    setBurstMood(others[Math.floor(Math.random() * others.length)]);
    setIsBursting(true);
    burstTimer.current = setTimeout(() => setIsBursting(false), BURST_MS);
  };

  useEffect(() => () => clearTimeout(burstTimer.current), []);
  const [openOn, setOpenOn] = useState<string | null>(null);
  // Tied to the page it was opened on, so navigating closes it
  const open = openOn === pathname;

  useEffect(() => {
    if (!open) {return;}
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const renderLink = (link: NavLink, className: string, activeClassName: string) => {
    const active = !link.external && link.href === pathname;

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpenOn(null)}
        className={cn(className, active && activeClassName)}
        {...(link.external ? externalUrlOpts : {})}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <nav aria-label="Main" className={cn("flex items-center justify-between gap-4", t.bar, scrolled && t.barScrolled)}>
      <Link
        href="/"
        onPointerEnter={burst}
        className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight transition-colors hover:text-sky-500 min-[760px]:text-[22px]"
      >
        <span className={cn("relative flex", isBursting && "is-acting")}>
          <Logo size={32} spinOnScroll />
          <FaceBurst mood={burstMood} flipY />
        </span>
        UpTab
      </Link>

      <div className={cn("hidden items-center gap-1", t.wide, t.tray)}>
        {navLinks.map((link) =>
          renderLink(
            link,
            cn("rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors", t.link),
            cn("font-bold", t.active)
          )
        )}
        <StoreButton tone={t.tone} className="ml-1.5 min-h-0 py-2.5 text-[15px]" />
      </div>

      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpenOn(open ? null : pathname)}
        className={cn(
          "inline-flex size-12 items-center justify-center rounded-full border transition active:scale-[.97]",
          t.narrow,
          t.menuButton
        )}
      >
        <MenuIcon open={open} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute inset-x-4 top-full z-20 mt-1.5 flex flex-col gap-0.5 rounded-3xl p-2.5",
            t.narrow,
            t.sheet
          )}
        >
          {[{ href: "/", label: "Home" } satisfies NavLink, ...navLinks].map((link) =>
            renderLink(
              link,
              cn("flex min-h-13 items-center rounded-2xl px-4 text-lg font-bold", t.sheetLink),
              t.sheetActive
            )
          )}
          <StoreButton tone={t.tone} className="mt-1.5 min-h-14 w-full rounded-2xl text-[17px]" />
        </div>
      )}
    </nav>
  );
};
