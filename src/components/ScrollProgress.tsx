"use client";

import { useScrollY } from "@/hooks/useScrollY";

const safeCalculatePercentage = (part: number, total: number) => {
  if (!part || total <= 0) {
    return 0;
  }

  return Math.min((part / total) * 100, 100);
};

const getScrollableHeight = () =>
  typeof document === "undefined"
    ? 0
    : document.documentElement.scrollHeight - window.innerHeight;

const ScrollProgress = () => {
  const y = useScrollY();

  const progress = safeCalculatePercentage(y, getScrollableHeight());

  return (
    <div className="fixed top-0 z-10 flex h-[2px] w-full">
      <div className="bg-sky-500" style={{ width: `${progress}%` }} />
      <div className="grow" />
    </div>
  );
};

export default ScrollProgress;
