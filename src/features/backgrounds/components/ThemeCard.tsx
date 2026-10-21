import Image from "next/image";

import { cardClass } from "@/components/ui/card";
import { ProgressBar } from "@/features/backgrounds/components/ProgressBar";
import type { ThemeSummary } from "@/features/backgrounds/utils/theme-summary";
import { cn } from "@/utils/cn";


export const ThemeCard = ({ theme }: { theme: ThemeSummary }) => (
  <a
    href={`/admin/themes/${theme.id}`}
    className={cn(cardClass, "group flex h-full flex-col gap-3 duration-150 hover:shadow-md")}
  >
    <div className="grid aspect-video grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-sm bg-slate-100">
      {theme.thumbnails.map((src) => (
        <Image
          key={src}
          unoptimized
          src={src}
          width={240}
          height={135}
          alt=""
          className="size-full object-cover"
        />
      ))}
    </div>
    <div>
      <h3 className="font-bold duration-150 group-hover:text-sky-500">{theme.name}</h3>
      <p className="text-xs text-slate-400">{theme.id}</p>
    </div>
    <ProgressBar published={theme.published} pending={theme.pending} />
  </a>
);
