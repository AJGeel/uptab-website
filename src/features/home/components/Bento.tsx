import { BackspaceIcon, PlusIcon } from "@heroicons/react/24/solid";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { FakeFavicon, type FaviconKind } from "@/features/home/components/FakeFavicon";
import { KeyboardCard } from "@/features/home/components/KeyboardCard";
import { PaceCard } from "@/features/home/components/PaceCard";
import { PrivacyCard } from "@/features/home/components/PrivacyCard";
import { ShortlinksCard } from "@/features/home/components/ShortlinksCard";
import { WeatherCard } from "@/features/home/components/WeatherCard";
import type { Weather } from "@/features/home/season-weather";
import { cn } from "@/utils/cn";

type BentoProps = {
  weather: Weather;
  /** Shown in the keyboard card's Backgrounds dialog. */
  collections: { name: string; photo: BackgroundImage }[];
  photos: {
    /** Three photos that swap in the keyboard card's mini new tab. */
    keyboard: BackgroundImage[];
    /** Four photos that crossfade in the pace card. */
    pace: BackgroundImage[];
  };
};

const CARD = "rounded-3xl p-7 ring-inset";
const WHITE_CARD = cn(CARD, "bg-white ring-1 ring-[#e2e8ef]");
const CURSOR = "M4 2l14 8-6 1.6L9 18z";

const Cursor = ({ className }: { className: string }) => (
  <svg
    className={cn("pointer-events-none absolute drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]", className)}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    aria-hidden="true"
  >
    <path d={CURSOR} fill="#020E2C" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const Title = ({ children, big = false }: { children: string; big?: boolean }) => (
  <h3 className={cn("font-extrabold tracking-tight", big ? "text-[26px]" : "text-[22px]")}>{children}</h3>
);

const Text = ({ children, className }: { children: string; className?: string }) => (
  <p className={cn("mt-2 text-base leading-relaxed text-muted", className)}>{children}</p>
);

/** A bookmark row like the extension's: favicon (a coloured square here) and title. */
const BookmarkRow = ({ title, kind, className, children }: { title: React.ReactNode; kind: FaviconKind; className?: string; children?: React.ReactNode }) => (
  <div className={cn("flex items-center gap-3 px-2 py-1.5 text-[#4b5563]", className)}>
    <FakeFavicon kind={kind} />
    <span className="grow truncate">{title}</span>
    {children}
  </div>
);

export const Bento = ({ photos, weather, collections }: BentoProps) => (
  <section className="mx-auto max-w-310 reveal px-[clamp(1rem,4vw,2rem)] pt-[clamp(4.5rem,9vw,8rem)]">
    <h2 className="max-w-180 text-[clamp(2.125rem,4vw,3.25rem)] leading-heading font-extrabold tracking-[-0.035em]">
      Tiny delights, everywhere.
    </h2>
    <p className="mt-3.5 max-w-140 text-lg text-muted">Go on, poke them. They don’t bite.</p>

    <div className="ut-bento mt-10">
      <WeatherCard weather={weather} />
      <PrivacyCard />

      <article className={cn("ut-s2 flex flex-col gap-4.5", WHITE_CARD)}>
        <div>
          <Title>Three letters. Found it.</Title>
          <Text>Your bookmarks are already there, searchable as you type. No importing, no homework.</Text>
        </div>
        {/* A fixed height, like the extension's list, so rows hiding as you type never move the card */}
        <div className="@container relative mt-auto h-52 overflow-hidden rounded-2xl bg-white ring-1 ring-[#e5e7eb] ring-inset" aria-hidden="true">
          <div className="relative flex items-stretch border-b border-[#e5e7eb]">
            <div className="flex min-w-0 flex-1 items-center py-2 pr-3 pl-9">
              <svg className="absolute top-0 left-0 m-2.5 text-[#4b5563]" width="16" height="16" viewBox="0 0 15 15">
                <circle cx="6.5" cy="6.5" r="4.8" stroke="currentColor" strokeWidth="1.6" fill="none" />
                <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="relative flex h-6 min-w-0 flex-1 items-center">
                <span className="ut-b-ph absolute left-0 truncate text-[#757575]">Search your bookmarks...</span>
                <span>
                  <span className="ut-b-l1">r</span>
                  <span className="ut-b-l2">e</span>
                  <span className="ut-b-l3">c</span>
                </span>
                <span className="ut-caret ml-px inline-block h-4 w-[1.5px] bg-black" />
              </span>
            </div>
          </div>
          <div className="ut-b-hide"><BookmarkRow title="Design inspiration" kind="design" /></div>
          <div className="ut-b-hide"><BookmarkRow title="Team standup notes" kind="notes" /></div>
          <BookmarkRow
            className="ut-b-match"
            kind="recipes"
            title={
              <>
                <span className="ut-b-under">Rec</span>ipes to try
              </>
            }
          >
            <span className="ut-b-open -my-1 flex items-center gap-1">
              <PlusIcon className="size-7 shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-1 text-[#6b7280] shadow-xs" />
              <BackspaceIcon className="size-7 shrink-0 rounded-lg border border-[#e5e7eb] bg-white p-1 text-[#6b7280] shadow-xs" />
            </span>
          </BookmarkRow>
          <div className="ut-b-hide"><BookmarkRow title="Rental apartments" kind="rentals" /></div>
          <div className="ut-b-hide"><BookmarkRow title="Reading list" kind="reading" /></div>
          <div className="ut-b-hide"><BookmarkRow title="Gift ideas for Mum" kind="gifts" /></div>
          <Cursor className="ut-b-cursor top-14 left-[46%]" />
        </div>
      </article>

      <KeyboardCard photos={photos.keyboard} collections={collections} weather={weather} />

      <ShortlinksCard />

      <PaceCard photos={photos.pace} />
    </div>
  </section>
);
