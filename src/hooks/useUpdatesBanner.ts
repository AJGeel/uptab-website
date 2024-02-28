import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export const useUpdatesBanner = () => {
  const [version, setVersion] = useState<string>();
  const [lastSeenVersion, setLastSeenVersion] = useLocalStorage<string>(
    "lastSeenVersion",
    ""
  );

  const shouldShowBanner = () => {
    if (!version) {
      return false;
    }

    return version !== lastSeenVersion;
  };

  const onClickBanner = () => {
    if (!version) {
      return;
    }

    setLastSeenVersion(version);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-latest-release");
      const data = await res.json();

      setVersion(data.name);
    };

    fetchData();
  }, []);

  return {
    isVisible: shouldShowBanner(),
    onClickBanner: onClickBanner,
  };
};
