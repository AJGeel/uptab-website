import Image from "next/image";

import { thumbnailUrl } from "./data";
import { RemovePhotoButton } from "./RemovePhotoButton";
import { Field, inputClass } from "./ui";
import type { SourceEntry, SourceMetadata } from "../../../scripts/backgrounds";
import { isPublished } from "../../../scripts/edits";

const badgeClass = "rounded-full px-2 py-0.5 text-xs font-medium";

/**
 * One photo's fields, part of the theme page's edit form. A photo is
 * published while it has an author. Pending photos can still be renamed or
 * moved to another theme; published ones keep their ID and theme.
 */
export const PhotoRow = ({
  entry,
  themes,
}: {
  entry: SourceEntry;
  themes: SourceMetadata["themes"];
}) => {
  const published = isPublished(entry);
  const name = (field: string) => `photo:${entry.id}:${field}`;

  return (
    <div className="grid gap-4 border-t border-slate-200 py-4 first:border-t-0 sm:grid-cols-[160px_1fr]">
      <Image
        unoptimized
        src={thumbnailUrl(entry.file)}
        width={160}
        height={90}
        alt={entry.id}
        className="aspect-video w-40 rounded-xs bg-slate-200 object-cover"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="ID">
          <input
            name={name("id")}
            defaultValue={entry.id}
            readOnly={published}
            title={published ? "Published IDs are fixed" : undefined}
            className={inputClass}
          />
        </Field>
        <Field label="Theme">
          {published ? (
            <input name={name("theme")} value={entry.theme} readOnly className={inputClass} />
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
          <input
            name={name("author")}
            defaultValue={entry.author ?? ""}
            placeholder="Required to publish"
            className={inputClass}
          />
        </Field>
        <Field label="Link">
          <input
            name={name("link")}
            type="url"
            defaultValue={entry.link ?? ""}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
          {published ? (
            <span className={`${badgeClass} bg-green-100 text-green-800`}>Published</span>
          ) : (
            <span className={`${badgeClass} bg-amber-100 text-amber-800`}>Pending</span>
          )}
          <span className="text-xs text-slate-500">
            {published
              ? "Clearing the author takes it out of the catalogue."
              : "Add an author to publish it."}
          </span>
          <span className="grow" />
          <RemovePhotoButton id={entry.id} file={entry.file} />
        </div>
      </div>
    </div>
  );
};
