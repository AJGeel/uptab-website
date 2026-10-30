import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { photoSrc } from "@/features/home/photo-src";
import { cn } from "@/utils/cn";

export type Modal = "backgrounds" | "settings" | "hotkeys";

export type Collection = { name: string; photo: BackgroundImage };

const MiniToggle = ({ on }: { on: boolean }) => (
  <span className={cn("relative h-3 w-5.5 rounded-full", on ? "bg-sky-500" : "bg-[#c3ceda]")}>
    <span className={cn("absolute top-0.5 size-2 rounded-full bg-white", on ? "right-0.5" : "left-0.5")} />
  </span>
);

/** The extension's dialogs, shrunk to fit the mini new tab. */
export const MiniModal = ({ modal, collections }: { modal: Modal; collections: Collection[] }) => (
  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/25 p-3 backdrop-blur-[2px]">
    <div className="flex max-h-full w-[82%] flex-col gap-2 overflow-hidden rounded-xl bg-white p-3 text-[10px] leading-tight text-[#4b5563] shadow-2xl">
      {modal === "backgrounds" && (
        <>
          <p className="text-xs font-bold text-black">Backgrounds</p>
          <p>Pick the themes you&rsquo;d like to see.</p>
          <div className="grid grid-cols-2 gap-1.5">
            {collections.slice(0, 4).map(({ name, photo }, index) => (
              <div
                key={name}
                className={cn("overflow-hidden rounded-lg border bg-white", index < 2 ? "border-sky-500 ring-1 ring-sky-500" : "border-black/10 opacity-70")}
              >
                <div className="relative h-9" style={{ backgroundColor: photo.color }}>
                  <Image src={photoSrc(photo, 240)} alt="" fill sizes="120px" className="object-cover" />
                  {index < 2 && <CheckCircleIcon className="absolute top-0.5 right-0.5 size-3.5 rounded-full bg-white text-sky-500" />}
                </div>
                <p className="px-1.5 py-1 font-semibold text-black">{name}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {modal === "settings" && (
        <>
          <p className="text-xs font-bold text-black">Preferences</p>
          {[
            ["Show the weather", true],
            ["Show shortlinks", true],
            ["Show bookmarks", true],
            ["Show photo credits", false],
          ].map(([label, on]) => (
            <div key={String(label)} className="flex items-center justify-between border-t border-black/10 pt-1.5">
              <span>{label}</span>
              <MiniToggle on={Boolean(on)} />
            </div>
          ))}
        </>
      )}
      {modal === "hotkeys" && (
        <>
          <p className="text-xs font-bold text-black">Keyboard Shortcuts</p>
          {[
            ["Settings", "/"],
            ["Toggle sidebar", "\\"],
            ["All shortcuts", "?"],
            ["Previous background", "←"],
            ["Next background", "→"],
            ["Choose backgrounds", "B"],
          ].map(([label, key]) => (
            <div key={label} className="flex items-center justify-between border-t border-black/10 pt-1">
              <span>{label}</span>
              <kbd className="flex w-5 items-center justify-center rounded-md border border-b-2 border-sky-900/30 bg-white py-px font-mono font-bold text-sky-500">{key}</kbd>
            </div>
          ))}
        </>
      )}
    </div>
  </div>
);
