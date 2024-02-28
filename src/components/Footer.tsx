"use client";

import Link from "next/link";
import { Fragment } from "react";

import { externalUrls } from "@/config";
import { useStoreAttributes } from "@/hooks/useStoreAttributes";

import HeaderLogo from "./Header/partials/HeaderLogo";

type FooterProps = {
  homeUrl?: string;
};

const Footer = ({ homeUrl }: FooterProps) => {
  const { url } = useStoreAttributes();

  const urls = [
    {
      href: "/changelog",
      label: "Changelog",
    },
    {
      href: externalUrls.github,
      label: "Github",
    },
    {
      href: externalUrls.chrome,
      label: "On Chrome",
    },
    {
      href: externalUrls.firefox,
      label: "On Firefox",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-16 sm:gap-12">
      <HeaderLogo url={url} homeUrl={homeUrl} rotation={0} />
      <div className="flex items-center justify-center gap-4">
        {urls.map((item, index) => (
          <Fragment key={item.href}>
            {index >= 1 && <div className="size-1 rounded-full bg-black/10" />}
            <Link
              className="text-sm duration-150 hover:text-sky-500"
              href={item.href}
            >
              {item.label}
            </Link>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Footer;
