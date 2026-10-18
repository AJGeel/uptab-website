import { notFound } from "next/navigation";

import { cardClass } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { findPublicUrl } from "@/features/backgrounds/api/find-public-url";
import { loadAdmin } from "@/features/backgrounds/api/load-admin";
import { saveThemeAction } from "@/features/backgrounds/api/save-theme";
import { AddPhotoForm } from "@/features/backgrounds/components/AddPhotoForm";
import { EditForm } from "@/features/backgrounds/components/EditForm";
import { PhotoRow } from "@/features/backgrounds/components/PhotoRow";
import { ProgressBar } from "@/features/backgrounds/components/ProgressBar";
import { isPublished } from "@/features/backgrounds/utils/edits";
import { countPending, imagesOf } from "@/features/backgrounds/utils/theme-summary";

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
      <a href="/admin" className="-mb-6 text-sm text-sky-500 hover:text-black">
        ← All themes
      </a>

      {/* Joins the edit form below through form=, so the upload can sit in between */}
      <div className="flex flex-col gap-3">
        <input type="hidden" name="theme:id" value={theme.id} form={EDIT_FORM} />
        <div className="flex flex-wrap items-center gap-3">
          <Input
            name="theme:name"
            defaultValue={theme.name}
            required
            aria-label="Theme name"
            form={EDIT_FORM}
            className="max-w-xs text-2xl! font-bold"
          />
          <span className="text-sm text-slate-400">ID: {theme.id} (fixed)</span>
        </div>
        <div className="max-w-sm">
          <ProgressBar published={entries.length - pending} pending={pending} />
        </div>
      </div>

      <AddPhotoForm theme={theme.id} existingIds={metadata.images.map(({ id }) => id)} />

      <EditForm id={EDIT_FORM} action={saveThemeAction}>
        <section className={cardClass}>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <PhotoRow
                key={entry.id}
                entry={entry}
                themes={metadata.themes}
                publicUrl={publicUrls.get(entry.id)}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">No photos in this theme yet.</p>
          )}
        </section>
      </EditForm>

      {/* Room to scroll past the floating save bar */}
      <div className="h-12" />
    </>
  );
};
