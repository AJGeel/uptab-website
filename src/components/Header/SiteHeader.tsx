"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";

import Header from "./Header";

const SiteHeader = ({ fadeToTopOn = [] }: { fadeToTopOn?: Route[] }) => {
  const pathname = usePathname();

  return <Header fadeToTop={fadeToTopOn.some((route) => route === pathname)} />;
};

export default SiteHeader;
