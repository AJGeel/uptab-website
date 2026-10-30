import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { externalUrlOpts } from "@/utils/externalUrlOpts";

const SHAPES = {
  dot: "M10 0a10 10 0 1 0 0 20a10 10 0 1 0 0-20z",
  star: "M10 0C10.6 6 14 9.4 20 10 14 10.6 10.6 14 10 20 9.4 14 6 10.6 0 10 6 9.4 9.4 6 10 0z",
  heart:
    "M10 17.5S2.5 12.8 2.5 7.6C2.5 5 4.4 3.2 6.7 3.2c1.4 0 2.6.7 3.3 1.8.7-1.1 1.9-1.8 3.3-1.8 2.3 0 4.2 1.8 4.2 4.4 0 5.2-7.5 9.9-7.5 9.9z",
};

type Shape = keyof typeof SHAPES;

/** Seconds one speck takes to rise; stars and hearts take longer, and hearts climb higher. */
const RISE_SECONDS = 5;
const RISE_EM = 1.2;

const SHAPE_ORDER: Shape[] = [
  ...Array<Shape>(10).fill("dot"),
  ...Array<Shape>(3).fill("star"),
  ...Array<Shape>(2).fill("heart"),
];

/** Specks, stars and hearts that rise off "lovely". Golden-ratio steps spread them so no shape clumps. */
const PARTICLES = SHAPE_ORDER.map((shape, i) => {
  const seconds = { dot: RISE_SECONDS, star: RISE_SECONDS + 1, heart: RISE_SECONDS + 2 }[shape];
  const rise = { dot: RISE_EM, star: RISE_EM * 0.8, heart: RISE_EM * 1.3 }[shape];
  const size = {
    dot: 0.05 + (i % 3) * 0.015,
    star: 0.2 + (i % 3) * 0.04,
    heart: 0.14 + (i % 2) * 0.04,
  }[shape];

  return {
    shape,
    left: `${((i * 0.618) % 1) * 96}%`,
    top: `${0.55 + ((i * 7) % 5) * 0.1}em`,
    size: `${size}em`,
    delay: `${((i * 1.3) % RISE_SECONDS).toFixed(1)}s`,
    seconds,
    rise: `${-rise}em`,
    fill: i % 2 === 0 ? "var(--lovely-light)" : "var(--lovely)",
  };
});

const Lovely = () => (
  <span className="ut-accent relative inline-block whitespace-nowrap">
    <span className="ut-lovely">lovely</span>
    {PARTICLES.map(({ shape, left, top, size, delay, seconds, rise, fill }, i) => (
      <span
        key={i}
        className="ut-pt"
        aria-hidden="true"
        style={{
          left,
          top,
          width: size,
          height: size,
          ["--d" as string]: delay,
          ["--t" as string]: `${seconds}s`,
          ["--r" as string]: rise,
        }}
      >
        <svg viewBox="0 0 20 20" className={shape === "dot" ? undefined : `ut-pt-${shape}`}>
          <path d={SHAPES[shape]} style={{ fill }} />
        </svg>
      </span>
    ))}
  </span>
);

const CREDIT_CLASS = "rounded-full bg-black/25 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm";

/** "Photo by …", linking to the photographer's page when the catalogue has one. */
const PhotoCredit = ({ author, link }: { author: string; link: string | null }) =>
  link ? (
    <a
      href={link}
      {...externalUrlOpts}
      className={`${CREDIT_CLASS} transition-colors hover:bg-black/55 hover:text-white`}
    >
      Photo by {author}
    </a>
  ) : (
    <p className={CREDIT_CLASS}>Photo by {author}</p>
  );

/** The full-bleed photo with the headline, over a light scrim, and the nav on top. */
export const Hero = ({
  photo,
  children,
}: {
  photo: BackgroundImage;
  children: React.ReactNode;
}) => {
  // Every prebuilt rendition, so the browser picks the sharpest one for the screen
  const srcSet = photo.sources.map(({ url, width }) => `${new URL(url).pathname} ${width}w`).join(", ");

  return (
    <header
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#8fc3d0]"
      style={{ ["--hero-color" as string]: photo.palette[0] ?? "#138CD0" }}
    >
      {/* A plain img: next/image would re-encode the renditions, softening them */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={new URL(photo.sources.at(-1)!.url).pathname}
        srcSet={srcSet}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="ut-scrim absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-1 flex-col px-[clamp(1rem,4vw,3.5rem)] pt-24 pb-7">
        {/* Centred on mobile; from md up, bottom left with the credit on the right */}
        <div className="flex flex-1 flex-col items-center justify-center text-center md:items-start md:justify-end md:text-left">
          <div className="max-w-190">
            <h1 className="text-[clamp(2.75rem,6.4vw,5rem)] leading-display font-extrabold tracking-[-0.045em] text-balance text-black">
              Open a tab. Land somewhere <Lovely />
            </h1>
            <p className="mx-auto mt-6 max-w-130 text-[clamp(1.125rem,1.6vw,1.3125rem)] leading-normal font-medium text-[#16222f] md:mx-0">
              UpTab turns every blank new tab into a tiny holiday. Gorgeous photos,
              the weather outside, your bookmarks within reach.
            </p>
          </div>
          <div className="mt-8 flex justify-center md:justify-start">{children}</div>
        </div>
        {photo.author && (
          <div className="flex justify-center pt-6 md:absolute md:right-[clamp(1rem,4vw,3.5rem)] md:bottom-7 md:pt-0">
            <PhotoCredit author={photo.author} link={photo.link} />
          </div>
        )}
      </div>
    </header>
  );
};
