import Image from "next/image";
import Link from "next/link";

import type {
  BackgroundImage,
  Catalogue,
  Theme,
} from "@/features/backgrounds/types/catalogue";
import { plural } from "@/utils/plural";

const photoSrc = (image: BackgroundImage) =>
  new URL(image.sources[0].url).pathname;

/** The last slot is an invitation to see every theme, so the featured themes take the slots before it. */
const MAX_THEME_CARDS = 3;

const CARD_CLASS =
  "ut-lift flex flex-col overflow-hidden rounded-[20px] text-black";
const MOSAIC_CLASS =
  "grid grid-cols-2 grid-rows-[96px_72px] gap-0.75 overflow-hidden";

/** A mosaic of photos from themes that aren't shown above, slightly dimmed. */
const ExploreCard = ({
  catalogue: { themes, images },
  shown,
}: {
  catalogue: Catalogue;
  shown: Theme[];
}) => {
  const rest = themes.filter((theme) => !shown.includes(theme));
  // A photo from each hidden theme, then a second from each, then the shown themes' if that's still not three
  const photosOf = (theme: Theme) => images.filter((image) => image.theme === theme.id);
  const teasers = [
    ...rest.map((theme) => photosOf(theme)[0]),
    ...rest.map((theme) => photosOf(theme)[1]),
    ...shown.map((theme) => photosOf(theme)[0]),
  ]
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Link
      href="/backgrounds"
      className={`${CARD_CLASS} group bg-black text-white ring-1 ring-black ring-inset`}
    >
      <div className={MOSAIC_CLASS}>
        {teasers.map((photo, index) => (
          <div
            key={photo.id}
            className={index === 0 ? "relative col-span-2" : "relative"}
            style={{ backgroundColor: photo.color }}
          >
            <Image
              src={photoSrc(photo)}
              alt=""
              fill
              sizes="(min-width: 1024px) 15vw, 50vw"
              className="object-cover opacity-70"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 px-4.5 pt-4 pb-4.5">
        <div>
          <p className="text-lg font-extrabold tracking-[-0.01em]">
            Explore all themes
          </p>
          <p className="mt-0.5 text-sm text-dark-body">
            {plural(images.length, "photo")}, every one credited
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-400 text-black transition-transform duration-200 group-hover:translate-x-1">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
};

/** One card per featured theme: three of its photos, its name and size. Then an invitation to see them all. */
export const Collections = ({
  catalogue,
  themes,
}: {
  catalogue: Catalogue;
  themes: Theme[];
}) => {
  const { images } = catalogue;
  const shownThemes = themes.slice(0, MAX_THEME_CARDS);

  return (
    <section className="mx-auto max-w-310 reveal px-[clamp(1rem,4vw,2rem)] pt-[clamp(4.5rem,9vw,8rem)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-155">
          <p className="text-[13px] font-bold tracking-[0.12em] text-sky-800 uppercase">
            Where to today?
          </p>
          <h2 className="mt-3 text-[clamp(2.125rem,4vw,3.25rem)] leading-heading font-extrabold tracking-[-0.035em]">
            {images.length} views. Pick your favourite corners of the world.
          </h2>
        </div>
        <Link
          href="/backgrounds"
          className="inline-flex min-h-11 items-center gap-2 text-base font-bold text-sky-800 transition-colors hover:text-black"
        >
          Take the scenic route
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-4">
        {shownThemes.map((theme) => {
          const photos = images.filter((image) => image.theme === theme.id);
          // The theme's chosen covers lead, then the rest
          const covers = (theme.coverImageIds ?? []).flatMap((id) =>
            photos.filter((photo) => photo.id === id),
          );
          const shown = [...new Set([...covers, ...photos])].slice(0, 3);

          return (
            <Link
              key={theme.id}
              href="/backgrounds"
              className={`${CARD_CLASS} bg-white ring-1 ring-[#e2e8ef] ring-inset`}
            >
              <div className={MOSAIC_CLASS}>
                {shown.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={index === 0 ? "relative col-span-2" : "relative"}
                    style={{ backgroundColor: photo.color }}
                  >
                    <Image
                      src={photoSrc(photo)}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 15vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="px-4.5 pt-4 pb-4.5">
                <p className="text-lg font-extrabold tracking-[-0.01em]">
                  {theme.name}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  {plural(photos.length, "photo")}
                </p>
              </div>
            </Link>
          );
        })}
        <ExploreCard catalogue={catalogue} shown={shownThemes} />
      </div>
    </section>
  );
};
