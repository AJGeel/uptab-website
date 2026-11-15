import type { ReactNode } from "react";

import { externalUrlOpts } from "@/utils/externalUrlOpts";

export const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} {...externalUrlOpts} className="font-semibold text-sky-800 underline-offset-2 hover:underline">
    {children}
  </a>
);
