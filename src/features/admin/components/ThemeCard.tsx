import Image from "next/image";

import { ProgressBar } from "@/features/admin/components/ProgressBar";
import { cardClass } from "@/features/admin/components/ui/card";
import type { ThemeSummary } from "@/features/admin/utils/theme-summary";
import { cn } from "@/utils/cn";


export const ThemeCard = ({ theme }: { theme: ThemeSummary }) => (
  <a
    href={`/admin/themes/${theme.id}`}
    draggable={false}
    className={cn(cardClass, "group flex h-full flex-col gap-3 duration-150 hover:shadow-md")}
  >
    <div className="grid aspect-video grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-sm bg-dark-pill">
      {theme.thumbnails.map((src) => (
        <Image
          key={src}
          unoptimized
          draggable={false}
          src={src}
          width={240}
          height={135}
          alt=""
          className="size-full object-cover"
        />
      ))}
    </div>
    <div>
      <h3 className="font-bold duration-150 group-hover:text-sky-400">{theme.name}</h3>
      <p className="text-xs text-[#7f8da0]">{theme.id}</p>
    </div>
    <ProgressBar published={theme.published} pending={theme.pending} />
  </a>
);
