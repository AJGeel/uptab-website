import { useSyncExternalStore } from "react";

import { externalUrls } from "@/config";

type Store = {
  url: string;
  /** The browser's own name, e.g. "Firefox". */
  name: string;
};

type StoreAttributes = Store & {
  /** False until the browser is known, i.e. while server-rendered and hydrating. */
  ready: boolean;
  /** Both stores, for reserving room for whichever label turns out to be needed. */
  stores: Store[];
  /** The label for adding UpTab to the visitor's browser. */
  label: string;
  /** The store for the other browser. */
  other: Store;
};

const chrome: Store = { url: externalUrls.chrome, name: "Chrome" };
const firefox: Store = { url: externalUrls.firefox, name: "Firefox" };

// The user agent never changes, so there is nothing to subscribe to
const subscribe = () => () => {};
const getIsUsingFirefox = () => /firefox|fxios/i.test(navigator.userAgent);
const getServerIsUsingFirefox = () => false;
const getIsReady = () => true;
const getServerIsReady = () => false;

export const useStoreAttributes = (): StoreAttributes => {
  const isUsingFirefox = useSyncExternalStore(
    subscribe,
    getIsUsingFirefox,
    getServerIsUsingFirefox
  );
  const ready = useSyncExternalStore(subscribe, getIsReady, getServerIsReady);
  const store = isUsingFirefox ? firefox : chrome;

  return {
    ...store,
    ready,
    stores: [chrome, firefox],
    label: `Add to ${store.name}`,
    other: isUsingFirefox ? chrome : firefox,
  };
};
