"use client";

import { useStoreAttributes } from "@/hooks/useStoreAttributes";
import { cn } from "@/utils/cn";
import { Link } from "./Header/partials/Link";
import Dialog from "./CTABanner/Dialog";
import { useState } from "react";

type CTABannerProps = {
  className?: string;
};

const CTABanner = ({ className }: CTABannerProps) => {
  const { url, label } = useStoreAttributes();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Dialog isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <div className={cn(className, "relative")}>
        <div className="absolute inset-0 w-full h-full opacity-60">
          <div className="bg-sky-500 size-80 absolute left-6 -top-10 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="px-16 py-10 bg-gradient-to-r from-white/70 to-sky-200/70 backdrop-blur-xl rounded-lg space-y-6 flex flex-col outline outline-black/10 shadow-lg">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Convinced?
            <br />
            Start using UpTab today. It's free!
          </h2>
          <div className="flex items-center gap-3">
            <Link label={label} href={url} iconName="plus" />
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold leading-6 text-slate-900 px-4 py-2 rounded-full hover:bg-slate-900/5 duration-150"
            >
              Convince me 🤨
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTABanner;
