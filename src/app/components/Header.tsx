"use client";

import { useWindowScroll } from "@uidotdev/usehooks";
import Image from "next/image";
import { cn } from "../utils/cn";
import { externalUrls } from "@/config";
import { ArrowTrendingUpIcon } from "@heroicons/react/16/solid";

const Link = ({ label, href }: { label: string; href: string }) => (
  <a
    className="flex items-center gap-1 hover:text-sky-600 duration-150 active:opacity-75 active:scale-90"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    <span>{label}</span>
    <ArrowTrendingUpIcon className="w-3 h-3" />
  </a>
);

const Header = () => {
  const [{ y }] = useWindowScroll();

  const isHeaderVisible = y && y > 500;
  const isUsingFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
  const storeUrl = isUsingFirefox ? externalUrls.firefox : externalUrls.chrome;

  return (
    <div
      className={cn(
        "w-full fixed top-0 p-5 flex justify-between z-10 duration-500 bg-white/90 xl:bg-transparent border-b shadow-sm xl:shadow-none xl:border-transparent backdrop-blur-sm xl:backdrop-blur-none",
        isHeaderVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none -translate-y-4"
      )}
    >
      <a
        href={storeUrl}
        className="flex items-center gap-2 hover:text-sky-500 duration-150 active:scale-90 active:opacity-75 group"
      >
        <Image
          src="/images/icon.svg"
          width="24"
          height="24"
          alt="UpTab Logo"
          className="group-hover:brightness-110 duration-150"
        />
        <span className="font-medium">UpTab</span>
      </a>
      <div className="flex gap-3 items-center">
        <Link href={externalUrls.github} label="Star on Github" />
        <Link
          href={storeUrl}
          label={`Add to ${isUsingFirefox ? "Firefox" : "Chrome"}`}
        />
      </div>
    </div>
  );
};

export default Header;
