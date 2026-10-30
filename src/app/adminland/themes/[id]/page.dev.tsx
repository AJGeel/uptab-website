import { AdminShell } from "@/features/admin/components/AdminShell";
import { ThemeEditor } from "@/features/admin/components/ThemeEditor";

const ThemePage = async ({ params }: { params: Promise<{ id: string }> }) => (
  <AdminShell>
    <ThemeEditor themeId={(await params).id} />
  </AdminShell>
);

export default ThemePage;
