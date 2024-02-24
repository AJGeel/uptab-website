import { useEffect, useState } from "react";

import { externalUrls } from "@/config";

type StoreAttributes = {
  url: string;
  label: string;
};

export const useStoreAttributes = (): StoreAttributes => {
  const [isUsingFirefox, setIsUsingFirefox] = useState(false);

  useEffect(() => {
    if (!navigator) {
      return;
    }

    setIsUsingFirefox(navigator.userAgent.indexOf("Firefox") !== -1);
  }, []);

  return {
    url: isUsingFirefox ? externalUrls.firefox : externalUrls.chrome,
    label: isUsingFirefox ? "Add to Firefox" : "Add to Chrome",
  };
};
