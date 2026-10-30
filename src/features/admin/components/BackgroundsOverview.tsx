import { loadAdmin } from "@/features/admin/api/load-admin";
import { reorderThemesAction } from "@/features/admin/api/reorder";
import { AddPhotoForm } from "@/features/admin/components/AddPhotoForm";
import { NewThemeCard } from "@/features/admin/components/NewThemeCard";
import { SortableList } from "@/features/admin/components/SortableList";
import { ThemeCard } from "@/features/admin/components/ThemeCard";
import { ThemeContextMenu } from "@/features/admin/components/ThemeContextMenu";
import { summarizeTheme } from "@/features/admin/utils/theme-summary";

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
        <h1 className="text-4xl font-extrabold tracking-[-0.045em] text-sky-400">
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
