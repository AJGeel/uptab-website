import { loadAdmin } from "@/features/backgrounds/api/load-admin";
import { AddPhotoForm } from "@/features/backgrounds/components/AddPhotoForm";
import { ThemeCard } from "@/features/backgrounds/components/ThemeCard";
import { summarizeTheme } from "@/features/backgrounds/utils/theme-summary";

/** The admin's start page: uploading photos, and every theme at a glance. */
export const BackgroundsOverview = async () => {
  const { metadata } = await loadAdmin();

  // The status banner explains why backgrounds.json can't be read
  if (!metadata) {
    return null;
  }

  const themes = metadata.themes.map((theme) => summarizeTheme(metadata, theme));

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Backgrounds</h1>
        <p className="text-sm text-slate-600">
          Photos with an author are published; rebuild to update the catalogue
          the extension downloads.
        </p>
      </div>

      <AddPhotoForm themes={themes} existingIds={metadata.images.map(({ id }) => id)} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </section>
    </>
  );
};
