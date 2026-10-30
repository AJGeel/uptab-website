import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/Toaster";
import { isLocalRequest } from "@/features/backgrounds/api/is-local-request";
import { loadAdmin } from "@/features/backgrounds/api/load-admin";

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
      <div className="min-h-screen bg-slate-200 bg-linear-to-b from-white via-slate-200 to-slate-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-24 md:px-6">
          <StatusBanner problems={problems} catalogue={catalogue} />
          {children}
        </div>
      </div>
    </Toaster>
  );
};
