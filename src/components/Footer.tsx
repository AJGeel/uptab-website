import type { Route } from "next";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { externalUrls } from "@/config";
import { cn } from "@/utils/cn";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

type FooterProps = {
  theme: "light" | "dark";
  /** Replaces the default credit line, e.g. to thank photographers. */
  credit?: string;
};

type FooterLink = { href: Route; label: string; external?: boolean };

const groups: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { href: "/backgrounds", label: "Backgrounds" },
      { href: "/changelog", label: "Changelog" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    heading: "Get UpTab",
    links: [
      { href: externalUrls.chrome, label: "Chrome Web Store", external: true },
      { href: externalUrls.firefox, label: "Firefox Add-ons", external: true },
      { href: externalUrls.github, label: "GitHub", external: true },
    ],
  },
];

const Footer = ({ theme, credit }: FooterProps) => {
  const dark = theme === "dark";

  return (
    <footer
      className={cn(
        "mx-auto flex w-full max-w-310 flex-wrap justify-between gap-x-16 gap-y-10 px-[clamp(1rem,4vw,2rem)] pt-[clamp(6rem,14vw,11rem)] pb-12 text-[15px]",
        dark ? "text-dark-muted" : "text-muted"
      )}
    >
      <div className="flex max-w-72 flex-col justify-end gap-3">
        <div className="flex items-center gap-2.5">
          <Logo size={28} />
          <strong className={cn("text-lg", dark ? "text-white" : "text-black")}>UpTab</strong>
        </div>
        <p className="text-sm">
          Free and open source.
          <br />
          <span className="whitespace-nowrap">
            made by{" "}
            <a
              href="https://arthur-geel.vercel.app"
              {...externalUrlOpts}
              className={cn("link-pill", dark ? "text-white" : "text-black")}
            >
              Arthur Geel
            </a>
          </span>
          {credit}
        </p>
      </div>
      <div className="flex flex-wrap gap-x-14 gap-y-8">
        {groups.map(({ heading, links }) => (
          <nav key={heading} aria-label={heading} className="flex flex-col items-start gap-1">
            <p className={cn("mb-1 text-xs font-bold tracking-[0.12em] uppercase", dark ? "text-sky-400" : "text-sky-800")}>
              {heading}
            </p>
            {links.map(({ href, label, external }) => (
              <Link key={href} href={href} className="link-pill" {...(external ? externalUrlOpts : {})}>
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
