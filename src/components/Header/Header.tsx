"use client";

import { useWindowScroll } from "@uidotdev/usehooks";
import Image from "next/image";
import { cn } from "../../utils/cn";
import { externalUrls } from "@/config";
import { Link } from "./partials/Link";
import UpdatesBanner from "./partials/UpdatesBanner";
import { useStoreAttributes } from "@/hooks/useStoreAttributes";

const Header = () => {
  const [{ y }] = useWindowScroll();
  const isHeaderVisible = y && y > 500;

  const { url, label } = useStoreAttributes();

  return (
    <div
      className={cn(
        "w-full fixed top-0 z-10 duration-500",
        isHeaderVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none -translate-y-4"
      )}
    >
      <UpdatesBanner />
      <div className="px-5 py-3 flex justify-between bg-white/90 xl:bg-transparent border-b shadow-sm xl:shadow-none xl:border-transparent backdrop-blur-sm xl:backdrop-blur-none">
        <a
          href={url}
          className="flex items-center gap-2 hover:text-sky-500 duration-150 active:scale-90 active:opacity-75 group"
        >
          <Image
            src="/images/icon.svg"
            width="24"
            height="24"
            alt="UpTab Logo"
            className="group-hover:brightness-110 duration-150"
            priority
            style={{ transform: `rotateZ(${(y ?? 0) / 3}deg)` }}
          />
          <span className="font-medium">UpTab</span>
        </a>
        <div className="flex gap-3 items-center">
          <Link href={url} label={label} iconName="plus" />
          <Link
            className="hidden md:flex"
            href={externalUrls.github}
            label="View Github"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
