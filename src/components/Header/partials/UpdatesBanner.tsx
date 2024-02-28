"use client";

import { XMarkIcon } from "@heroicons/react/20/solid";

import { cn } from "@/utils/cn";

type UpdatesBannerProps = {
  isVisible: boolean;
  onClick: () => void;
  url: string;
};

const UpdatesBanner = ({ isVisible, onClick, url }: UpdatesBannerProps) => (
  <div
    className={cn(
      "flex items-center justify-between gap-x-6 bg-slate-800 px-6 sm:pr-3.5 lg:pl-8 duration-500 overflow-hidden",
      isVisible ? "h-11" : "h-0 pointer-events-none"
    )}
    onClick={onClick}
  >
    <a
      className="w-full text-center text-sm leading-6 text-white"
      target="_blank"
      rel="noopener noreferrer"
      href={url}
    >
      A new version of UpTab has been released!&nbsp;
      <span aria-hidden="true">&rarr;</span>
    </a>
    <button
      type="button"
      className="-m-3 flex-none bg-slate-800 p-3 duration-150 hover:brightness-150 focus-visible:outline-offset-[-4px] active:scale-90 active:opacity-75"
    >
      <span className="sr-only">Dismiss</span>
      <XMarkIcon className="size-5 text-white" aria-hidden="true" />
    </button>
  </div>
);

export default UpdatesBanner;
