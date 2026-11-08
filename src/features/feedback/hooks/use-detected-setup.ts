import { useSyncExternalStore } from "react";

// Nothing here ever changes while the page is open
const subscribe = () => () => {};

const useSearchParam = (name: string) =>
  useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name)?.trim() ?? "",
    () => ""
  );

/** What UpTab passes along when it links to the form: ?v= for the version and ?browser= for the browser and system. Empty otherwise. */
export const useDetectedSetup = () => ({
  version: useSearchParam("v").replace(/^v/i, ""),
  browser: useSearchParam("browser").slice(0, 100),
});
