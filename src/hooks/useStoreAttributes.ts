import { useSyncExternalStore } from "react";

import { externalUrls } from "@/config";

type StoreAttributes = {
  url: string;
  label: string;
};

// The user agent never changes, so there is nothing to subscribe to
const subscribe = () => () => {};
const getIsUsingFirefox = () => navigator.userAgent.indexOf("Firefox") !== -1;
const getServerIsUsingFirefox = () => false;

export const useStoreAttributes = (): StoreAttributes => {
  const isUsingFirefox = useSyncExternalStore(
    subscribe,
    getIsUsingFirefox,
    getServerIsUsingFirefox
  );

  return {
    url: isUsingFirefox ? externalUrls.firefox : externalUrls.chrome,
    label: isUsingFirefox ? "Add to Firefox" : "Add to Chrome",
  };
};
