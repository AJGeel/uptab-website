import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SiteNav } from "@/components/SiteNav";
import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { loadAdmin } from "@/features/admin/api/load-admin";
import { Toaster } from "@/features/admin/components/ui/Toaster";

import { RebuildGuard } from "./RebuildGuard";
import { StatusBanner } from "./StatusBanner";

/**
 * Frame for every admin page: the localhost check, the status banner and
 * toasts.
 * A component rather than a layout.dev.tsx, because a dev-only layout makes
 * Next's generated dev and production route types disagree.
 */
export const AdminShell = async ({ children }: { children: ReactNode }) => {
  if (!(await isLocalRequest())) {
    notFound();
  }

  const { problems, catalogue } = await loadAdmin();

  return (
    <Toaster>
      <div className="min-h-screen bg-black text-dark-text antialiased">
        <SiteNav theme="dark" logoOnly />
        <RebuildGuard isStale={catalogue.state === "stale"} />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-24 md:px-6">
          <StatusBanner problems={problems} catalogue={catalogue} />
          {children}
        </div>
      </div>
    </Toaster>
  );
};
