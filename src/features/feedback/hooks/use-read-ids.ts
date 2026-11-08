import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "uptab-feedback-read";

const listeners = new Set<() => void>();

/** Mirrors localStorage, and keeps working for the session when storage is blocked. */
let cached: string | null = null;

const load = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

const getSnapshot = () => (cached ??= load());

// Null until hydration is done, so the server and the first client render agree
const getServerSnapshot = () => null;

const subscribe = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cached = null;
      listener();
    }
  };

  listeners.add(listener);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const write = (ids: Iterable<string>) => {
  cached = JSON.stringify([...ids]);

  try {
    localStorage.setItem(STORAGE_KEY, cached);
  } catch {
    // Private mode or blocked storage: the state lives on in memory until the page closes
  }

  listeners.forEach((listener) => listener());
};

const parse = (snapshot: string) => {
  try {
    const ids: unknown = JSON.parse(snapshot);

    return new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set<string>();
  }
};

/** Which feedback this browser has read. Stored on this device only. */
export const useReadIds = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ids = useMemo(() => parse(snapshot ?? "[]"), [snapshot]);

  return {
    ready: snapshot !== null,
    isRead: (id: string) => ids.has(id),
    toggle: (id: string) => write(ids.has(id) ? [...ids].filter((read) => read !== id) : [...ids, id]),
    markRead: (shown: string[]) => write([...ids, ...shown]),
    markUnread: (shown: string[]) => write([...ids].filter((id) => !shown.includes(id))),
  };
};
