import Image from "next/image";

import { externalUrls } from "@/config";

import { cn } from "../utils/cn";
import { externalUrlOpts } from "../utils/externalUrlOpts";

type StoreButtonProps = {
  label: string;
  url: string;
  iconUrl: string;
};

const StoreButton = ({ label, url, iconUrl }: StoreButtonProps) => (
  <a
    href={url}
    {...externalUrlOpts}
    className="crispy-outline flex items-center gap-4 rounded-lg bg-white px-4 py-3 shadow-md ring-sky-500 ring-offset-1 duration-150 hover:ring-2 focus:ring-2 active:scale-90 active:opacity-75"
  >
    <Image src={iconUrl} width="34" height="34" alt={label} priority />
    <div className="">
      <p className="text-sm font-medium text-slate-500">Get it for</p>
      <p className="font-bold text-slate-900">{label}</p>
    </div>
  </a>
);

const Hero = ({ className }: { className?: string }) => (
  <div className={cn("flex-col items-center", className)}>
    <Image
      src="/images/icon.svg"
      width="80"
      height="80"
      alt="UpTab Logo"
      className="drop-shadow-xl"
      priority
    />
    <h1 className="mt-6 text-balance text-center text-2xl font-bold leading-normal md:text-3xl md:leading-normal">
      <span className="text-sky-500">Super-charge your new tabs</span> with
      weather forecasts, bookmarks and Dutch landscapes.
    </h1>
    <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
      <StoreButton
        label="Google Chrome"
        url={externalUrls.chrome}
        iconUrl="/images/chrome-icon.svg"
      />
      <StoreButton
        label="Mozilla Firefox"
        url={externalUrls.firefox}
        iconUrl="/images/firefox-icon.svg"
      />
    </div>
  </div>
);

export default Hero;
