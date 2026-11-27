import { Input, inputClass } from "@/features/admin/components/ui/Input";
import { rowId } from "@/features/admin/utils/row-id";
import {
  isPublished,
  type SourceEntry,
  type SourceTheme,
} from "@/features/backgrounds/utils/metadata";
import { originalUrl } from "@/features/backgrounds/utils/paths";
import type { Tone } from "@/features/backgrounds/utils/tone";
import { cn } from "@/utils/cn";

import { PreviewThumbnail } from "./PreviewThumbnail";
import { RemovePhotoButton } from "./RemovePhotoButton";


/** One grid for the header and every row, so the columns line up like a table. */
export const photoColumns =
  "grid min-w-240 grid-cols-[5rem_minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.1fr)_11rem_9rem_5.5rem] items-center gap-3";

/** The text colour a photo of that tone takes. */
const textOf = (tone: Tone) => (tone === "dark" ? "white text" : "dark text");

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
  measured,
}: {
  entry: SourceEntry;
  themes: SourceTheme[];
  /** What sampling found in the top-left of the photo. */
  measured: { tone: Tone; poorFit: boolean };
  /** Where the live site serves this photo, for reverse image search. */
  publicUrl?: string | null;
}) => {
  const published = isPublished(entry);
  const name = (field: string) => `photo:${entry.id}:${field}`;

  return (
    <div id={rowId(entry.id)} className="py-1.5">
      <div className={photoColumns}>
        <PreviewThumbnail id={entry.id} file={entry.file} />
        <Input
          name={name("id")}
          aria-label="ID"
          defaultValue={entry.id}
          readOnly={published}
          title={published ? "Published IDs are fixed" : undefined}
        />
        {published ? (
          <Input name={name("theme")} aria-label="Theme" value={entry.theme} readOnly />
        ) : (
          <select name={name("theme")} aria-label="Theme" defaultValue={entry.theme} className={inputClass}>
            {themes.map(({ id, name: themeName }) => (
              <option key={id} value={id}>
                {themeName}
              </option>
            ))}
          </select>
        )}
        <Input
          name={name("author")}
          aria-label="Author"
          defaultValue={entry.author ?? ""}
          placeholder="Required to publish"
        />
        <Input
          name={name("link")}
          aria-label="Link"
          type="url"
          defaultValue={entry.link ?? ""}
          placeholder="https://"
        />
        <select
          name={name("toneOverride")}
          aria-label="Tone"
          defaultValue={entry.toneOverride ?? ""}
          // Muted while it follows the sampled tone, so manual calls stand out
          className={cn(inputClass, "has-[option[value='']:checked]:text-[#7f8da0] [&>option]:text-dark-text")}
        >
          <option value="">Sampled ({textOf(measured.tone)})</option>
          <option value="light">Light ({textOf("light")})</option>
          <option value="dark">Dark ({textOf("dark")})</option>
        </select>
        <div className="flex flex-wrap gap-1">
          {published ? (
            <span
              title="Clearing the author takes it out of the catalogue."
              className={cn(badgeClass, "bg-sky-400/15 text-sky-400")}
            >
              Published
            </span>
          ) : (
            <span title="Add an author to publish it." className={cn(badgeClass, "bg-amber-400/15 text-amber-300")}>
              Pending
            </span>
          )}
          {(measured.poorFit || entry.poorFitIgnored) && (
            <select
              name={name("poorFitIgnored")}
              aria-label="Poor fit"
              title="Neither text colour reads well in the top-left corner. Change it if the sampling got it wrong."
              defaultValue={entry.poorFitIgnored ? "ok" : ""}
              className={cn(
                badgeClass,
                "field-sizing-content cursor-pointer bg-rose-400/15 text-rose-300 has-[option[value='ok']:checked]:bg-transparent has-[option[value='ok']:checked]:text-[#7f8da0] [&>option]:bg-[#0b121c] [&>option]:text-dark-text"
              )}
            >
              <option value="">Poor fit</option>
              <option value="ok">Not a poor fit</option>
            </select>
          )}
        </div>
        <RemovePhotoButton id={entry.id} file={entry.file} />
      </div>
      {!published && (
        <div className="mt-1.5 pl-23">
          <FindSource file={entry.file} publicUrl={publicUrl} />
        </div>
      )}
    </div>
  );
};
