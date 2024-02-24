"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { cn } from "../utils/cn";

export type SlideProps = {
  title: string;
  text: string;
  imageUrl: string;
  className?: string;
  alignment?: "left" | "right";
};

const Slide = ({
  title,
  text,
  imageUrl,
  alignment = "left",
  className,
}: SlideProps) => {
  return (
    <div
      className={cn(
        "flex flex-col md:h-96 items-center md:rounded-lg md:bg-white md:outline outline-black/10 overflow-hidden md:shadow-lg",
        alignment === "left" ? "md:flex-row" : "md:flex-row-reverse",
        "-translate-y-8 md:translate-y-0"
      )}
    >
      <div className="w-full h-52 rounded-md mb-8 md:mb-0 md:h-full md:w-[45%] overflow-hidden bg-slate-100 relative">
        <Image
          src={imageUrl}
          alt={text}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw"
        />
      </div>
      <div className="md:w-[55%] md:p-14 space-y-3">
        <div className="flex items-center gap-1">
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          <SparklesIcon className="size-6 text-sky-500" />
        </div>
        <p className="md:text-lg text-slate-500 leading-relaxed text-balance">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Slide;
