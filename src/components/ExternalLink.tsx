import type { ReactNode } from "react";

import { externalUrlOpts } from "@/utils/externalUrlOpts";

export const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} {...externalUrlOpts} className="font-semibold text-sky-800 underline decoration-sky-800/30 underline-offset-2 hover:decoration-sky-800">
    {children}
  </a>
);
