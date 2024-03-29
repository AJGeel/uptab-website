"use client";

import { useWindowScroll, useWindowSize } from "@uidotdev/usehooks";

const safeCalculatePercentage = (part: number | null, total: number | null) => {
  if (!part || !total) {
    return 0;
  }

  return (part / total) * 100;
};

const ScrollProgress = () => {
  const { height } = useWindowSize();
  const [{ y }] = useWindowScroll();

  const progress = safeCalculatePercentage(y, height);

  return (
    <div className="fixed top-0 z-10 flex h-[2px] w-full">
      <div className="bg-sky-500" style={{ width: `${progress}%` }} />
      <div className="grow" />
    </div>
  );
};

export default ScrollProgress;
