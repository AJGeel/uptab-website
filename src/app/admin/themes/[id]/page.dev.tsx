import Link from "next/link";
import { notFound } from "next/navigation";

import { isPublished } from "../../../../../scripts/edits";
import { saveThemeAction } from "../../actions";
import { AddPhotoForm } from "../../AddPhotoForm";
import { AdminShell } from "../../AdminShell";
import { countPending, findPublicUrl, imagesOf, loadAdmin } from "../../data";
import { EditForm } from "../../EditForm";
import { PhotoRow } from "../../PhotoRow";
import { cardClass, inputClass, ProgressBar } from "../../ui";

const EDIT_FORM = "theme-edit";

const ThemePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { metadata } = await loadAdmin();
  const theme = metadata?.themes.find((candidate) => candidate.id === id);

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
    <AdminShell>
      <Link href="/admin" className="-mb-6 text-sm text-sky-500 hover:text-black">
        ← All themes
      </Link>

      {/* Joins the edit form below through form=, so the upload can sit in between */}
      <div className="flex flex-col gap-3">
        <input type="hidden" name="theme:id" value={theme.id} form={EDIT_FORM} />
        <div className="flex flex-wrap items-center gap-3">
          <input
            name="theme:name"
            defaultValue={theme.name}
            required
            aria-label="Theme name"
            form={EDIT_FORM}
            className={`${inputClass} max-w-xs text-2xl! font-bold`}
          />
          <span className="text-sm text-slate-400">ID: {theme.id} (fixed)</span>
        </div>
        <div className="max-w-sm">
          <ProgressBar published={entries.length - pending} pending={pending} />
        </div>
      </div>

      <AddPhotoForm theme={theme.id} />

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
    </AdminShell>
  );
};

export default ThemePage;
