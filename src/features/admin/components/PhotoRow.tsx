import Image from "next/image";

import { Field } from "@/features/admin/components/ui/Field";
import { Input, inputClass } from "@/features/admin/components/ui/Input";
import {
  isPublished,
  type SourceEntry,
  type SourceTheme,
} from "@/features/backgrounds/utils/metadata";
import { originalUrl, thumbnailUrl } from "@/features/backgrounds/utils/paths";
import { cn } from "@/utils/cn";

import { RemovePhotoButton } from "./RemovePhotoButton";


const badgeClass = "rounded-full px-2 py-0.5 text-xs font-medium";
const linkClass = "text-sky-400 hover:text-white";

const searchEngines = (url: string) => [
  { name: "Google Lens", href: `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}` },
  { name: "TinEye", href: `https://tineye.com/search?url=${encodeURIComponent(url)}` },
];

/**
 * Reverse image search, to find a pending photo's author and link. The
 * search engines need a public URL; without one, download the original and
 * drop it into Google Lens instead.
 */
const FindSource = ({ file, publicUrl }: { file: string; publicUrl: string | null }) => (
  <span className="flex flex-wrap gap-x-2 text-xs text-[#7f8da0]">
    Find source:
    {publicUrl ? (
      searchEngines(publicUrl).map(({ name, href }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {name}
        </a>
      ))
    ) : (
      <>
        <a href={originalUrl(file)} className={linkClass}>
          Download original
        </a>
        <span>and drop it into</span>
        <a
          href="https://lens.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          Google Lens
        </a>
      </>
    )}
  </span>
);

/**
 * One photo's fields, part of the theme page's edit form. A photo is
 * published while it has an author. Pending photos can still be renamed or
 * moved to another theme; published ones keep their ID and theme.
 */
export const PhotoRow = ({
  entry,
  themes,
  publicUrl = null,
}: {
  entry: SourceEntry;
  themes: SourceTheme[];
  /** Where the live site serves this photo, for reverse image search. */
  publicUrl?: string | null;
}) => {
  const published = isPublished(entry);
  const name = (field: string) => `photo:${entry.id}:${field}`;

  return (
    <div className="grid gap-4 py-4 sm:grid-cols-[160px_1fr]">
      <Image
        unoptimized
        src={thumbnailUrl(entry.file)}
        width={160}
        height={90}
        alt={entry.id}
        className="aspect-video w-40 rounded-xs bg-dark-pill object-cover"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="ID">
          <Input
            name={name("id")}
            defaultValue={entry.id}
            readOnly={published}
            title={published ? "Published IDs are fixed" : undefined}
          />
        </Field>
        <Field label="Theme">
          {published ? (
            <Input name={name("theme")} value={entry.theme} readOnly />
          ) : (
            <select name={name("theme")} defaultValue={entry.theme} className={inputClass}>
              {themes.map(({ id, name: themeName }) => (
                <option key={id} value={id}>
                  {themeName}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Author">
          <Input
            name={name("author")}
            defaultValue={entry.author ?? ""}
            placeholder="Required to publish"
          />
        </Field>
        <Field label="Link">
          <Input
            name={name("link")}
            type="url"
            defaultValue={entry.link ?? ""}
            placeholder="https://"
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
          {published ? (
            <span className={cn(badgeClass, "bg-sky-400/15 text-sky-400")}>Published</span>
          ) : (
            <span className={cn(badgeClass, "bg-amber-400/15 text-amber-300")}>Pending</span>
          )}
          <span className="text-xs text-[#7f8da0]">
            {published
              ? "Clearing the author takes it out of the catalogue."
              : "Add an author to publish it."}
          </span>
          {!published && <FindSource file={entry.file} publicUrl={publicUrl} />}
          <span className="grow" />
          <RemovePhotoButton id={entry.id} file={entry.file} />
        </div>
      </div>
    </div>
  );
};
