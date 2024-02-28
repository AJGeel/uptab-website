"use client";

import { useWindowScroll } from "@uidotdev/usehooks";

import { externalUrls } from "@/config";
import { useStoreAttributes } from "@/hooks/useStoreAttributes";
import { useUpdatesBanner } from "@/hooks/useUpdatesBanner";

import HeaderLogo from "./partials/HeaderLogo";
import { Link } from "./partials/Link";
import UpdatesBanner from "./partials/UpdatesBanner";
import { cn } from "../../utils/cn";

const Header = () => {
  const { isVisible, onClickBanner } = useUpdatesBanner();

  const { url, label } = useStoreAttributes();
  const [{ y }] = useWindowScroll();

  const isHeaderVisible = !!y && y > 500;

  return (
    <div
      className={cn(
        "w-full fixed top-0 z-10 duration-500",
        isHeaderVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none -translate-y-4"
      )}
    >
      <UpdatesBanner isVisible={isVisible} onClick={onClickBanner} url={url} />
      <div className="flex justify-between border-b bg-white/90 px-5 py-3 shadow-sm backdrop-blur-sm xl:border-transparent xl:bg-transparent xl:shadow-none xl:backdrop-blur-none">
        <HeaderLogo rotation={y} />
        <div className="flex items-center gap-3">
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
