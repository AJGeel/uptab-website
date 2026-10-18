import { AddPhotoForm } from "./AddPhotoForm";
import { AdminShell } from "./AdminShell";
import { imagesOf, loadAdmin } from "./data";
import { NewThemeCard, ThemeCard } from "./ThemeCards";

const AdminPage = async () => {
  const { metadata } = await loadAdmin();

  return (
    <AdminShell>
      {metadata && (
        <>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Backgrounds</h1>
            <p className="text-sm text-slate-600">
              The photos the extension shows on new tabs. Published IDs and
              themes are fixed, because installed extensions may have stored
              them.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metadata.themes.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} entries={imagesOf(metadata, theme.id)} />
            ))}
            <NewThemeCard />
          </section>

          <AddPhotoForm themes={metadata.themes} />
        </>
      )}
    </AdminShell>
  );
};

export default AdminPage;
