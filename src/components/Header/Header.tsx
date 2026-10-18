"use client";

import { useState } from "react";

import { externalUrls } from "@/config";
import { useScrollY } from "@/hooks/useScrollY";
import { useStoreAttributes } from "@/hooks/useStoreAttributes";
import { useUpdatesBanner } from "@/hooks/useUpdatesBanner";

import HeaderLogo from "./partials/HeaderLogo";
import { Link } from "./partials/Link";
import UpdatesBanner from "./partials/UpdatesBanner";
import { cn } from "../../utils/cn";

type HeaderProps = {
  /**
   * Fades from the page's top colour to transparent behind the header, for
   * contrast over busy content. Only on wide screens, where the header is
   * otherwise transparent.
   */
  fadeToTop?: boolean;
};

const Header = ({ fadeToTop = false }: HeaderProps) => {
  const { isVisible, onClickBanner } = useUpdatesBanner();
  const [isHovering, setIsHovering] = useState(false);

  const { url, label } = useStoreAttributes();
  const y = useScrollY();

  const isHeaderVisible = y > 500;

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "fixed top-0 z-10 w-full duration-500",
        isHeaderVisible || isHovering
          ? "opacity-100"
          : "-translate-y-4 opacity-0",
      )}
    >
      <UpdatesBanner isVisible={isVisible} onClick={onClickBanner} url={url} />
      <div
        className={cn(
          "flex justify-between border-b bg-white/90 px-5 py-3 shadow-xs backdrop-blur-xs xl:border-transparent xl:bg-transparent xl:shadow-none xl:backdrop-blur-none",
          fadeToTop &&
            // Sized to the border box, so the gradient doesn't repeat as a line in the bottom border
            "xl:bg-linear-to-b xl:from-white xl:via-white/80 xl:to-transparent xl:bg-origin-border xl:pb-8"
        )}
      >
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
