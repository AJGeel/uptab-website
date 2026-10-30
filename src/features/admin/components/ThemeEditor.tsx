import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { notFound } from "next/navigation";

import { findPublicUrl } from "@/features/admin/api/find-public-url";
import { loadAdmin } from "@/features/admin/api/load-admin";
import { reorderPhotosAction } from "@/features/admin/api/reorder";
import { saveThemeAction } from "@/features/admin/api/save-theme";
import { AddPhotoForm } from "@/features/admin/components/AddPhotoForm";
import { DeleteThemeButton } from "@/features/admin/components/DeleteThemeButton";
import { EditForm } from "@/features/admin/components/EditForm";
import { PhotoRow } from "@/features/admin/components/PhotoRow";
import { ProgressBar } from "@/features/admin/components/ProgressBar";
import { SortableList } from "@/features/admin/components/SortableList";
import { cardClass } from "@/features/admin/components/ui/card";
import { Input } from "@/features/admin/components/ui/Input";
import { countPending, imagesOf } from "@/features/admin/utils/theme-summary";
import { isPublished } from "@/features/backgrounds/utils/metadata";

const EDIT_FORM = "theme-edit";

/**
 * One theme's page: its name, an upload card and every photo, all saved
 * together with the floating save bar. 404s for an unknown theme.
 */
export const ThemeEditor = async ({ themeId }: { themeId: string }) => {
  const { metadata } = await loadAdmin();
  const theme = metadata?.themes.find((candidate) => candidate.id === themeId);

  if (!metadata || !theme) {
    notFound();
  }

  const entries = imagesOf(metadata, theme.id);
  const pending = countPending(entries);
  // Only pending photos still need their source found
  const publicUrls = new Map(
    await Promise.all(
      entries
        .filter((entry) => !isPublished(entry))
        .map(async (entry) => [entry.id, await findPublicUrl(entry.file)] as const)
    )
  );

  return (
    <>
      <a
        href="/adminland"
        className="group -mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-dark-pill py-2 pr-4 pl-3 text-sm font-semibold text-white duration-150 hover:bg-[#222f44] active:scale-95"
      >
        <ArrowLeftIcon className="size-4 text-sky-400 duration-150 group-hover:-translate-x-0.5" />
        All themes
      </a>

      {/* Joins the edit form below through form=, so the upload can sit in between */}
      <div className="flex flex-col gap-3">
        <input type="hidden" name="theme:id" value={theme.id} form={EDIT_FORM} />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Input
              name="theme:name"
              defaultValue={theme.name}
              required
              aria-label="Theme name"
              form={EDIT_FORM}
              className="text-2xl! font-bold"
            />
            <ProgressBar published={entries.length - pending} pending={pending} />
          </div>
          <span className="text-sm text-[#7f8da0]">ID: {theme.id} (fixed)</span>
          <div className="ml-auto">
            <DeleteThemeButton id={theme.id} name={theme.name} photoCount={entries.length} />
          </div>
        </div>
      </div>

      <AddPhotoForm theme={theme.id} existingIds={metadata.images.map(({ id }) => id)} />

      <EditForm id={EDIT_FORM} action={saveThemeAction}>
        <section className={cardClass}>
          {entries.length > 0 ? (
            <SortableList
              layout="list"
              withHandle
              className="divide-y divide-dark-line"
              onReorder={reorderPhotosAction.bind(null, theme.id)}
              items={entries.map((entry) => ({
                id: entry.id,
                node: (
                  <PhotoRow
                    entry={entry}
                    themes={metadata.themes}
                    publicUrl={publicUrls.get(entry.id)}
                  />
                ),
              }))}
            />
          ) : (
            <p className="text-sm text-[#7f8da0]">No photos in this theme yet.</p>
          )}
        </section>
      </EditForm>

      {/* Room to scroll past the floating save bar */}
      <div className="h-12" />
    </>
  );
};
