import { AdminShell } from "@/features/backgrounds/components/AdminShell";
import { ThemeEditor } from "@/features/backgrounds/components/ThemeEditor";

const ThemePage = async ({ params }: { params: Promise<{ id: string }> }) => (
  <AdminShell>
    <ThemeEditor themeId={(await params).id} />
  </AdminShell>
);

export default ThemePage;
