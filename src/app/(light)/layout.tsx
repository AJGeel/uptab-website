import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

/** The light document pages: privacy and terms. The nav is fixed, so the page starts below it. */
const LightLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen overflow-x-clip bg-page pt-24 text-black antialiased">
    <SiteNav theme="light" />
    {children}
    <Footer theme="light" />
  </div>
);

export default LightLayout;
