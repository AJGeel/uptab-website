import { AdminShell } from "@/features/admin/components/AdminShell";
import { BackgroundsOverview } from "@/features/admin/components/BackgroundsOverview";

const AdminPage = () => (
  <AdminShell>
    <BackgroundsOverview />
  </AdminShell>
);

export default AdminPage;
