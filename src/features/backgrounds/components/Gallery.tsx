import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import type { BackgroundImage, Catalogue } from "@/features/backgrounds/types/catalogue";
import { targetBlank } from "@/utils/targetBlank";

const Credit = ({ author, link }: Pick<BackgroundImage, "author" | "link">) => {
  if (!author) {
    return null;
  }

  return (
    <figcaption className="text-xs text-slate-500">
      Photo by{" "}
      {link ? (
        <Link
          href={link}
          {...targetBlank}
          className="text-sky-500 duration-150 hover:text-black"
        >
          {author}
        </Link>
      ) : (
        author
      )}
    </figcaption>
  );
};

/**
 * The public gallery: every published photo per theme, with credits. Each
 * photo links to its largest rendition.
 */
export const Gallery = ({ catalogue: { themes, images } }: { catalogue: Catalogue }) =>
  themes.map((theme) => (
    <div className="flex flex-col gap-4" key={theme.id}>
      <h2 className="font-bold">Theme: {theme.name}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {images
          .filter((image) => image.theme === theme.id)
          .map(({ id, author, link, color, sources }) => (
            <figure key={id} className="flex flex-col gap-2 sm:even:-mt-16">
              <Link
                href={sources[sources.length - 1].url}
                className="group flex w-full items-center justify-center overflow-hidden rounded-xs duration-300 active:scale-90"
                style={{ backgroundColor: color }}
                {...targetBlank}
              >
                <EyeIcon className="absolute z-10 size-8 text-black opacity-0 duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100" />
                <Image
                  // A local path, so next/image can optimize it without remotePatterns
                  src={new URL(sources[0].url).pathname}
                  width={640}
                  height={360}
                  alt=""
                  className="aspect-video w-full object-cover duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-60"
                />
              </Link>
              <Credit author={author} link={link} />
            </figure>
          ))}
      </div>
    </div>
  ));
