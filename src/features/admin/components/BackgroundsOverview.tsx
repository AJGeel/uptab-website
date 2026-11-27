import { loadAdmin } from "@/features/admin/api/load-admin";
import { reorderThemesAction } from "@/features/admin/api/reorder";
import { AddPhotoForm } from "@/features/admin/components/AddPhotoForm";
import { NewThemeCard } from "@/features/admin/components/NewThemeCard";
import { SortableList } from "@/features/admin/components/SortableList";
import { ThemeCard } from "@/features/admin/components/ThemeCard";
import { ThemeContextMenu } from "@/features/admin/components/ThemeContextMenu";
import { isPoorFit } from "@/features/admin/utils/poor-fit";
import { imagesOf, summarizeTheme } from "@/features/admin/utils/theme-summary";
import { sampleToneOfFile } from "@/features/backgrounds/api/sample-tone";
import { isPublished } from "@/features/backgrounds/utils/metadata";

/** The admin's start page: uploading photos, and every theme at a glance. */
export const BackgroundsOverview = async () => {
  const { metadata } = await loadAdmin();

  // The status banner explains why backgrounds.json can't be read
  if (!metadata) {
    return null;
  }

  const themes = await Promise.all(
    metadata.themes.map(async (theme) => {
      const published = imagesOf(metadata, theme.id).filter(isPublished);
      const measured = await Promise.all(published.map(({ file }) => sampleToneOfFile(file)));
      const poorFit = published.filter((entry, index) => isPoorFit(entry, measured[index])).length;

      return { ...summarizeTheme(metadata, theme), poorFit };
    })
  );

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="w-fit rainbow-cycle bg-clip-text text-4xl font-extrabold tracking-[-0.045em] text-transparent">
          /adminland
        </h1>
        <p className="text-sm text-dark-muted">
          Photos with an author are published; rebuild to update the catalogue
          the extension downloads.
        </p>
      </div>

      <AddPhotoForm themes={themes} existingIds={metadata.images.map(({ id }) => id)} />

      <SortableList
        layout="grid"
        leading={<NewThemeCard />}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        onReorder={reorderThemesAction}
        items={themes.map((theme) => ({
          id: theme.id,
          node: (
            <ThemeContextMenu theme={{ id: theme.id, name: theme.name, photoCount: theme.published + theme.pending }}>
              <ThemeCard theme={theme} />
            </ThemeContextMenu>
          ),
        }))}
      />
    </>
  );
};
