import Link from "next/link";
import { notFound } from "next/navigation";

import { saveThemeAction } from "../../actions";
import { AddPhotoForm } from "../../AddPhotoForm";
import { AdminShell } from "../../AdminShell";
import { countPending, imagesOf, loadAdmin } from "../../data";
import { EditForm } from "../../EditForm";
import { PhotoRow } from "../../PhotoRow";
import { cardClass, inputClass, ProgressBar } from "../../ui";

const ThemePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { metadata } = await loadAdmin();
  const theme = metadata?.themes.find((candidate) => candidate.id === id);

  if (!metadata || !theme) {
    notFound();
  }

  const entries = imagesOf(metadata, theme.id);
  const pending = countPending(entries);

  return (
    <AdminShell>
      <Link href="/admin" className="-mb-6 text-sm text-sky-500 hover:text-black">
        ← All themes
      </Link>

      <EditForm action={saveThemeAction}>
        <div className="mb-8 flex flex-col gap-3">
          <input type="hidden" name="theme:id" value={theme.id} />
          <div className="flex flex-wrap items-center gap-3">
            <input
              name="theme:name"
              defaultValue={theme.name}
              required
              aria-label="Theme name"
              className={`${inputClass} max-w-xs text-2xl! font-bold`}
            />
            <span className="text-sm text-slate-400">ID: {theme.id} (fixed)</span>
          </div>
          <div className="max-w-sm">
            <ProgressBar published={entries.length - pending} pending={pending} />
          </div>
        </div>

        <section className={cardClass}>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <PhotoRow key={entry.id} entry={entry} themes={metadata.themes} />
            ))
          ) : (
            <p className="text-sm text-slate-500">No photos in this theme yet.</p>
          )}
        </section>
      </EditForm>

      <AddPhotoForm themes={metadata.themes} theme={theme.id} />

      {/* Room to scroll past the floating save bar */}
      <div className="h-12" />
    </AdminShell>
  );
};

export default ThemePage;
