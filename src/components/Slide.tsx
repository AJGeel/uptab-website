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

const Slide = ({ title, text, imageUrl, alignment = "left" }: SlideProps) => (
  <div
    className={cn(
      "flex flex-col items-center overflow-hidden outline-black/10 md:h-96 md:rounded-lg md:bg-white md:shadow-lg md:outline-1",
      alignment === "left" ? "md:flex-row" : "md:flex-row-reverse",
      "-translate-y-8 md:translate-y-0"
    )}
  >
    <div className="relative mb-8 h-52 w-full overflow-hidden rounded-md bg-slate-100 md:mb-0 md:h-full md:w-[45%] md:rounded-none">
      <Image
        src={imageUrl}
        alt={text}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw"
      />
    </div>
    <div className="space-y-3 md:w-[55%] md:p-14">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
        <SparklesIcon className="size-6 text-sky-500" />
      </div>
      <p className="leading-relaxed text-balance text-slate-500 md:text-lg">
        {text}
      </p>
    </div>
  </div>
);

export default Slide;
