import { loadAdmin, summarizeTheme } from "@/features/backgrounds/api/admin-data";
import { AddPhotoForm } from "@/features/backgrounds/components/AddPhotoForm";
import { AdminShell } from "@/features/backgrounds/components/AdminShell";
import { ThemeCard } from "@/features/backgrounds/components/ThemeCard";

const AdminPage = async () => {
  const { metadata } = await loadAdmin();
  const themes = metadata?.themes.map((theme) => summarizeTheme(metadata, theme)) ?? [];

  return (
    <AdminShell>
      {metadata && (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Backgrounds</h1>
            <p className="text-sm text-slate-600">
              Photos with an author are published; rebuild to update the
              catalogue the extension downloads.
            </p>
          </div>

          <AddPhotoForm
            themes={themes}
            existingIds={metadata.images.map(({ id }) => id)}
          />

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </section>
        </>
      )}
    </AdminShell>
  );
};

export default AdminPage;
