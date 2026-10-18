import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { loadAdmin } from "@/features/backgrounds/api/admin-data";
import { isLocalRequest } from "@/features/backgrounds/api/is-local-request";

import { StatusBanner } from "./StatusBanner";
import { Toaster } from "./Toaster";

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
      <div className="mx-auto my-24 flex w-full max-w-6xl flex-col gap-10 px-4 md:px-6">
        <StatusBanner problems={problems} catalogue={catalogue} />
        {children}
      </div>
    </Toaster>
  );
};
