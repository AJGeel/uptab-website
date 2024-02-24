"use client";

import { useState } from "react";

import { useStoreAttributes } from "@/hooks/useStoreAttributes";
import { cn } from "@/utils/cn";

import Dialog from "./CTABanner/Dialog";
import { Link } from "./Header/partials/Link";

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
        <div className="absolute inset-0 size-full opacity-60">
          <div className="absolute -top-10 left-6 size-80 animate-pulse rounded-full bg-sky-500 blur-3xl" />
        </div>
        <div className="flex flex-col space-y-6 rounded-lg bg-gradient-to-r from-white/70 to-sky-200/70 px-8 py-10 shadow-lg outline outline-black/10 backdrop-blur-xl md:px-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Convinced?
            <br />
            Start using UpTab today. It&apos;s free!
          </h2>
          <div className="flex items-center gap-3">
            <Link label={label} href={url} iconName="plus" />
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full px-4 py-2 text-sm font-semibold leading-6 text-slate-900 duration-150 hover:bg-slate-900/5 active:scale-90 active:opacity-75"
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
