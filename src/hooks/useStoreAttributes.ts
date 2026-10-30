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
  /** False where neither store can install it: Safari, and mobile browsers other than Firefox for Android. */
  supported: boolean;
  /** The label for adding UpTab to the visitor's browser. */
  label: string;
  /** The store for the other browser. */
  other: Store;
};

const chrome: Store = { url: externalUrls.chrome, name: "Chrome" };
const firefox: Store = { url: externalUrls.firefox, name: "Firefox" };

// The user agent never changes, so there is nothing to subscribe to
const subscribe = () => () => {};
const getIsUsingFirefox = () => /firefox/i.test(navigator.userAgent);
const getServerIsUsingFirefox = () => false;
// Chromium browsers (Edge, Brave, Opera, ...) can use the Chrome Web Store, so they count as supported
const getIsSupported = () => {
  const { userAgent } = navigator;
  const isMobile = /iphone|ipad|ipod|android|mobile/i.test(userAgent);
  const isFirefoxForAndroid = /android.+firefox/i.test(userAgent);
  const isSafari = /safari/i.test(userAgent) && !/chrome|chromium|firefox/i.test(userAgent);

  return isFirefoxForAndroid || (!isMobile && !isSafari);
};
const getServerIsSupported = () => true;
const getIsReady = () => true;
const getServerIsReady = () => false;

export const useStoreAttributes = (): StoreAttributes => {
  const isUsingFirefox = useSyncExternalStore(
    subscribe,
    getIsUsingFirefox,
    getServerIsUsingFirefox
  );
  const supported = useSyncExternalStore(subscribe, getIsSupported, getServerIsSupported);
  const ready = useSyncExternalStore(subscribe, getIsReady, getServerIsReady);
  const store = isUsingFirefox ? firefox : chrome;

  return {
    ...store,
    ready,
    stores: [chrome, firefox],
    supported,
    label: supported ? `Add to ${store.name}` : "Get UpTab",
    other: isUsingFirefox ? chrome : firefox,
  };
};
