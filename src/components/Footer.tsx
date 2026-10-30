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

const links: { href: Route; label: string; external?: boolean }[] = [
  { href: "/changelog", label: "Changelog" },
  { href: "/backgrounds", label: "Backgrounds" },
  { href: externalUrls.github, label: "GitHub", external: true },
  { href: externalUrls.chrome, label: "Chrome Web Store", external: true },
  { href: externalUrls.firefox, label: "Firefox Add-ons", external: true },
];

const Footer = ({ theme, credit }: FooterProps) => {
  const dark = theme === "dark";

  return (
    <footer
      className={cn(
        "mx-auto flex max-w-310 flex-wrap items-center justify-between gap-6 px-[clamp(1rem,4vw,2rem)] pt-14 pb-12 text-[15px]",
        dark ? "text-dark-muted" : "text-muted"
      )}
    >
      <div className="flex items-center gap-2.5">
        <Logo size={26} />
        <span>
          <strong className={dark ? "text-white" : "text-black"}>UpTab</strong> · made by{" "}
          <a
            href="https://github.com/ajgeel"
            {...externalUrlOpts}
            className={cn("hover:underline", dark ? "text-white" : "text-black")}
          >
            Arthur Geel
          </a>
          {credit}
        </span>
      </div>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map(({ href, label, external }) => (
          <Link
            key={href}
            href={href}
            className="hover:underline"
            {...(external ? externalUrlOpts : {})}
          >
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
