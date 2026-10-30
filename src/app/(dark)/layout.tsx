import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";

/** The dark pages: backgrounds and changelog. The nav is fixed, so the page starts below it. */
const DarkLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen overflow-x-clip bg-black pt-24 text-dark-text antialiased">
    <SiteNav theme="dark" />
    {children}
    <Footer theme="dark" />
  </div>
);

export default DarkLayout;
