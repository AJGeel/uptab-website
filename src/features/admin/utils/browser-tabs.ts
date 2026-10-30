type Tab = { id: number; url: string };

/**
 * Asks the "Unsplash tabs" extension (tools/unsplash-tabs) for something. Resolves to
 * null when it doesn't answer, as it isn't installed or this isn't that browser.
 */
const askExtension = <T>(type: "list" | "close", ids?: number[]) =>
  new Promise<T | null>((resolve) => {
    const requestId = crypto.randomUUID();
    const finish = (result: T | null) => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
      resolve(result);
    };
    const onMessage = ({ data }: MessageEvent) => {
      if (data?.from === "unsplash-tabs" && data.requestId === requestId) {
        finish(data.result ?? null);
      }
    };
    const timer = setTimeout(() => finish(null), 1500);

    window.addEventListener("message", onMessage);
    window.postMessage({ from: "uptab-admin", type, ids, requestId }, window.location.origin);
  });

export const listPhotoTabs = () => askExtension<Tab[]>("list");

export const closeTabs = (ids: number[]) => askExtension("close", ids);
