"use client";

import Link from "next/link";
import { Fragment } from "react";

import { externalUrls } from "@/config";

import HeaderLogo from "./Header/partials/HeaderLogo";

const Footer = () => {
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
      label: "UpTab Chrome",
    },
    {
      href: externalUrls.firefox,
      label: "UpTab Firefox",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-16 sm:gap-12">
      <HeaderLogo rotation={0} />
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
