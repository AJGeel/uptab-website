"use client";

import { Toast } from "@base-ui/react/toast";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { type FormEvent, useState } from "react";

import { addPhotoAction } from "@/features/admin/api/add-photo";
import { Button } from "@/features/admin/components/ui/Button";
import { Field } from "@/features/admin/components/ui/Field";
import { Input } from "@/features/admin/components/ui/Input";
import { idProblem, suggestId } from "@/features/admin/utils/batch";
import type { ThemeSummary } from "@/features/admin/utils/theme-summary";
import { parseUnsplashName } from "@/features/admin/utils/unsplash";
import { cn } from "@/utils/cn";
import { plural } from "@/utils/plural";

import { PhotoDrop } from "./PhotoDrop";
import { ThemeSelect } from "./ThemeSelect";
import { UnsplashPaste } from "./UnsplashPaste";

type Staged = {
  key: string;
  file: File;
  preview: string;
  id: string;
  author: string;
  link: string;
  error: string | null;
};

/**
 * Stages any number of photos, each with its own ID, author and link, then
 * uploads them one at a time with a progress toast. One theme for the whole
 * batch: chosen here, or fixed by `theme`. Uploaded photos leave the list;
 * failed ones stay with their error, ready to fix and retry.
 */
export const BatchUpload = ({
  themes = [],
  theme,
  existingIds,
}: {
  themes?: ThemeSummary[];
  theme?: string;
  existingIds: string[];
}) => {
  const [staged, setStaged] = useState<Staged[]>([]);
  const [shared, setShared] = useState({ author: "", link: "" });
  const [isUploading, setIsUploading] = useState(false);
  const { add, update } = Toast.useToastManager();
  const existing = new Set(existingIds);
  const batchIds = staged.map(({ id }) => id);
  const problems = staged.map(({ id }) => idProblem(id, existing, batchIds));
  const invalid = problems.filter(Boolean).length;

  const addFiles = (files: File[], credit?: { author: string; link: string }) =>
    setStaged((current) => {
      const taken = new Set([...existingIds, ...current.map(({ id }) => id)]);

      return [
        ...current,
        ...files.map((file) => {
          const id = suggestId(file.name, taken);

          taken.add(id);

          // A fetched photo's own credit is exact; a download's name has a best guess. Both beat the shared defaults
          const unsplash = credit ?? parseUnsplashName(file.name);

          return {
            key: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
            id,
            author: unsplash?.author ?? shared.author,
            link: unsplash?.link ?? shared.link,
            error: null,
          };
        }),
      ];
    });

  const edit = (key: string, changes: Partial<Staged>) =>
    setStaged((current) =>
      current.map((item) => (item.key === key ? { ...item, ...changes, error: null } : item))
    );

  const remove = (key: string) =>
    setStaged((current) => {
      const item = current.find((candidate) => candidate.key === key);

      if (item) {
        URL.revokeObjectURL(item.preview);
      }

      return current.filter((candidate) => candidate.key !== key);
    });

  const applyToAll = () =>
    setStaged((current) =>
      current.map((item) => ({
        ...item,
        ...(shared.author.trim() ? { author: shared.author } : {}),
        ...(shared.link.trim() ? { link: shared.link } : {}),
      }))
    );

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const chosenTheme = theme ?? String(new FormData(event.currentTarget).get("theme") ?? "");
    const batch = staged;
    const batchKeys = new Set(batch.map(({ key }) => key));
    const toast = add({ title: `Uploading 1 of ${batch.length}…`, type: "loading", timeout: 0 });
    const failed = new Map<string, string>();
    let published = 0;

    setIsUploading(true);

    for (const [index, item] of batch.entries()) {
      update(toast, {
        title: `Uploading ${index + 1} of ${batch.length}…`,
        description: item.file.name,
      });

      const data = new FormData();

      data.set("file", item.file);
      data.set("theme", chosenTheme);
      data.set("id", item.id);
      data.set("author", item.author);
      data.set("link", item.link);

      const result = await addPhotoAction(data);

      if (result.error) {
        failed.set(item.key, result.error);
      } else if (item.author.trim()) {
        published += 1;
      }
    }

    const uploaded = batch.length - failed.size;

    // Keep failures, with their error, so they can be fixed and retried
    setStaged((current) =>
      current.flatMap((item) => {
        if (!batchKeys.has(item.key)) {
          return [item];
        }

        if (failed.has(item.key)) {
          return [{ ...item, error: failed.get(item.key) ?? null }];
        }

        URL.revokeObjectURL(item.preview);

        return [];
      })
    );
    setIsUploading(false);

    update(toast, {
      type: failed.size > 0 ? "error" : "success",
      title:
        failed.size > 0
          ? `${uploaded} of ${batch.length} uploaded`
          : `Added ${plural(uploaded, "photo")}`,
      description: [
        uploaded > 0 && `${published} published · ${uploaded - published} pending`,
        failed.size > 0 && `${plural(failed.size, "photo")} failed: see the list`,
      ]
        .filter(Boolean)
        .join("\n"),
      timeout: failed.size > 0 ? 0 : 5000,
    });
  };

  const field = (item: Staged, name: "id" | "author" | "link", placeholder: string) => (
    <Input
      value={item[name]}
      onChange={(event) => edit(item.key, { [name]: event.target.value })}
      placeholder={placeholder}
      aria-label={`${name} for ${item.file.name}`}
      type={name === "link" ? "url" : "text"}
    />
  );

  return (
    <form onSubmit={upload} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold">Add photos</h2>
        <p className="text-sm text-[#7f8da0]">
          Photos with an author are published right away; the rest stay pending.
        </p>
      </div>

      <div
        className={cn(
          "grid gap-4",
          !theme && "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
          staged.length > 0 && "items-end"
        )}
      >
        <div className="flex flex-col gap-3">
          <PhotoDrop onAdd={addFiles} compact={staged.length > 0} />
          <UnsplashPaste onAdd={addFiles} />
        </div>
        {!theme && (
          // Not a <label>: clicking one would also click the picker's button
          <div className="flex flex-col gap-1 text-xs font-medium text-[#7f8da0]">
            Theme for these photos
            <ThemeSelect themes={themes} />
          </div>
        )}
      </div>

      {staged.length > 0 && (
        <fieldset disabled={isUploading} className="contents">
          <div className="flex flex-wrap items-end gap-3 rounded-lg bg-[#0b121c] p-3">
            <Field label="Author for all">
              <Input
                value={shared.author}
                onChange={(event) => setShared({ ...shared, author: event.target.value })}
                placeholder="e.g. Unsplash photographer"
              />
            </Field>
            <Field label="Link for all">
              <Input
                type="url"
                value={shared.link}
                onChange={(event) => setShared({ ...shared, link: event.target.value })}
                placeholder="https://"
              />
            </Field>
            <Button
              type="button"
              onClick={applyToAll}
              disabled={!shared.author.trim() && !shared.link.trim()}
              variant="dark"
            >
              Apply to all
            </Button>
          </div>

          <div className="hidden gap-3 px-0 text-xs font-medium text-[#7f8da0] sm:grid sm:grid-cols-[96px_1fr_1fr_1fr_auto]">
            <span />
            <span>ID</span>
            <span>Author</span>
            <span>Link</span>
            <span className="w-11" />
          </div>
          <ul className="-mt-3 flex flex-col divide-y divide-dark-line">
            {staged.map((item, index) => (
              <li key={item.key} className="flex flex-col gap-1 py-3">
                <div className="grid items-center gap-3 sm:grid-cols-[96px_1fr_1fr_1fr_auto]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, which next/image can't load */}
                  <img
                    src={item.preview}
                    alt=""
                    className="aspect-video w-24 rounded-xs bg-dark-pill object-cover"
                  />
                  {field(item, "id", "ID")}
                  {field(item, "author", "Author: required to publish")}
                  {field(item, "link", "Link (optional)")}
                  <Button
                    type="button"
                    onClick={() => remove(item.key)}
                    disabled={isUploading}
                    aria-label={`Remove ${item.file.name} from this batch`}
                    variant="ghost"
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                </div>
                {(problems[index] ?? item.error) && (
                  <p className="text-xs text-red-400 sm:pl-27">{problems[index] ?? item.error}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              disabled={isUploading || invalid > 0}
              variant="primary"
            >
              {isUploading ? "Uploading…" : `Upload ${plural(staged.length, "photo")}`}
            </Button>
            {invalid > 0 && (
              <span className="text-sm text-red-400">
                Fix {plural(invalid, "ID")} first
              </span>
            )}
          </div>
        </fieldset>
      )}
    </form>
  );
};
