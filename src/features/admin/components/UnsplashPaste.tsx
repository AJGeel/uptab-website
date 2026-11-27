"use client";

import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

import { fetchUnsplashPhotoAction } from "@/features/admin/api/fetch-unsplash-photo";
import { HelperExtensionDialog } from "@/features/admin/components/HelperExtensionDialog";
import { Button } from "@/features/admin/components/ui/Button";
import { useActionToast } from "@/features/admin/hooks/use-action-toast";
import { closeTabs, listPhotoTabs } from "@/features/admin/utils/browser-tabs";
import { parseUnsplashUrl } from "@/features/admin/utils/unsplash";
import { cn } from "@/utils/cn";
import { plural } from "@/utils/plural";

/** Unsplash's demo API key allows 50 requests an hour, and a photo takes two. */
const MAX_PER_HOUR = 25;

/** When the hourly limit most likely resets: the start of the next clock hour. */
const nextHour = () => {
  const reset = new Date();

  reset.setHours(reset.getHours() + 1, 0, 0, 0);

  return reset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Spinner = () => (
  <span
    aria-hidden="true"
    className="size-4 shrink-0 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500"
  />
);

type Credit = { author: string; link: string };

/**
 * Fetches Unsplash photos from pasted page links, one per line, or from the
 * browser's open photo tabs, which are closed once their photo is fetched.
 * Hands each photo on as a file.
 */
export const UnsplashPaste = ({ onAdd }: { onAdd: (files: File[], credit: Credit) => void }) => {
  const [text, setText] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  // "checking" until the helper extension has answered, or has had time to
  const [extension, setExtension] = useState<"checking" | "found" | "missing">("checking");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const notify = useActionToast();

  useEffect(() => {
    void listPhotoTabs().then((tabs) => setExtension(tabs !== null ? "found" : "missing"));
  }, []);

  const checkAgain = async () => {
    setExtension("checking");

    const isFound = (await listPhotoTabs()) !== null;

    setExtension(isFound ? "found" : "missing");

    if (isFound) {
      setIsHelpOpen(false);
      notify({ error: null, message: "Found the helper extension" });
    }
  };

  /** Fetches each URL once, returning those that failed. A URL's tabs are all closed if it worked. */
  const fetchAll = async (entries: { url: string; tabIds: number[] }[]) => {
    const failed: string[] = [];
    const fetchedTabIds: number[] = [];

    for (const [index, { url, tabIds }] of entries.entries()) {
      const result = await fetchUnsplashPhotoAction(url);
      const { photo, error } = result;

      if (photo) {
        const bytes = Uint8Array.from(atob(photo.data), (char) => char.charCodeAt(0));

        onAdd([new File([bytes], photo.name, { type: "image/jpeg" })], photo);
        fetchedTabIds.push(...tabIds);
      } else if (result.rateLimited) {
        // Trying the rest would only fail the same way
        failed.push(...entries.slice(index).map((entry) => entry.url));
        notify({ error: `${error}. Try again after ${nextHour()}.`, message: null });
        break;
      } else {
        failed.push(url);
        notify({ error, message: null });
      }
    }

    if (fetchedTabIds.length > 0) {
      await closeTabs(fetchedTabIds);
    }

    if (failed.length === 0) {
      notify({ error: null, message: `Fetched ${plural(entries.length, "photo")} from Unsplash` });
    }

    return failed;
  };

  const pasted = text.split(/\s+/).filter(Boolean);

  const fetchPasted = async () => {
    setIsFetching(true);

    const failed = await fetchAll(pasted.slice(0, MAX_PER_HOUR).map((url) => ({ url, tabIds: [] })));

    setText([...failed, ...pasted.slice(MAX_PER_HOUR)].join("\n"));
    setIsFetching(false);
  };

  const fetchTabs = async () => {
    // Without the extension there's nothing to fetch from: explain how to get it instead
    if (extension === "missing") {
      setIsHelpOpen(true);

      return;
    }

    setIsFetching(true);

    const tabs = await listPhotoTabs();

    setExtension(tabs !== null ? "found" : "missing");

    if (tabs === null) {
      setIsHelpOpen(true);
    } else {
      // The same photo can be open twice; fetch it once and close both
      const byPhoto = new Map<string, { url: string; tabIds: number[] }>();

      for (const { id, url } of tabs) {
        const photoId = parseUnsplashUrl(url);

        if (photoId) {
          byPhoto.set(photoId, { url, tabIds: [...(byPhoto.get(photoId)?.tabIds ?? []), id] });
        }
      }

      if (byPhoto.size === 0) {
        notify({ error: "No Unsplash photo tabs are open.", message: null });
      } else {
        const entries = [...byPhoto.values()];

        await fetchAll(entries.slice(0, MAX_PER_HOUR));

        if (entries.length > MAX_PER_HOUR) {
          notify({
            error: `Fetched ${MAX_PER_HOUR} of ${entries.length}, to stay under the Unsplash limit. The other tabs are still open.`,
            message: null,
          });
        }
      }
    }

    setIsFetching(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <HelperExtensionDialog
        open={isHelpOpen}
        onOpenChange={setIsHelpOpen}
        isChecking={extension === "checking"}
        onCheckAgain={checkAgain}
      />
      <label className="flex flex-col gap-1 text-xs font-medium text-[#7f8da0]">
        Or paste Unsplash links, one per line
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={isFetching}
          rows={3}
          placeholder="https://unsplash.com/photos/…"
          className="rounded-lg bg-[#0b121c] px-3 py-2 text-sm text-dark-text ring-1 ring-[#33465f] ring-inset focus:ring-sky-500 focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="dark" onClick={fetchPasted} disabled={isFetching || !text.trim()}>
          {isFetching ? "Fetching…" : "Fetch photos"}
        </Button>
        <Button
          type="button"
          variant="dark"
          onClick={fetchTabs}
          disabled={isFetching || extension === "checking"}
          title={extension === "missing" ? "The helper extension wasn't found" : undefined}
        >
          Import from open tabs
          {extension === "checking" && <Spinner />}
          {extension === "missing" && (
            <>
              <ExclamationCircleIcon className="size-4 text-amber-300" aria-hidden />
              <span className="sr-only">The helper extension wasn&apos;t found</span>
            </>
          )}
        </Button>
        <p className={cn("ml-auto text-xs", pasted.length > MAX_PER_HOUR ? "text-amber-300" : "text-[#7f8da0]")}>
          {pasted.length > MAX_PER_HOUR
            ? `Only the first ${MAX_PER_HOUR} links will be fetched now. The rest stay here.`
            : `Unsplash allows about ${MAX_PER_HOUR} photos an hour.`}
        </p>
      </div>
    </div>
  );
};
