import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });

  return () => window.removeEventListener("scroll", onChange);
};

const getScrollY = () => window.scrollY;
const getServerScrollY = () => 0;

export const useScrollY = () =>
  useSyncExternalStore(subscribe, getScrollY, getServerScrollY);
