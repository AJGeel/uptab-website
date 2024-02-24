"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { cn } from "../utils/cn";

export type SlideProps = {
  title: string;
  text: string;
  imageUrl: string;
  alignment?: "left" | "right";
};

const Slide = ({ title, text, imageUrl, alignment = "left" }: SlideProps) => {
  return (
    <div
      className={cn(
        "flex h-96 items-center rounded-lg bg-white outline outline-black/10 overflow-hidden shadow-lg",
        alignment === "left" ? "flex-row" : "flex-row-reverse"
      )}
    >
      <div className="w-[45%] overflow-hidden bg-slate-100 h-full relative">
        <Image src={imageUrl} alt={text} fill className=" object-cover" />
      </div>
      <div className="w-[55%] p-14 space-y-3">
        <div className="flex items-center gap-1">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <SparklesIcon className="size-6 text-sky-500" />
        </div>
        <p className="text-lg text-slate-500 leading-relaxed text-balance">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Slide;
