"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/features/admin/components/ui/Button";
import { cardClass } from "@/features/admin/components/ui/card";
import { rowId } from "@/features/admin/utils/row-id";
import { previewUrl } from "@/features/backgrounds/utils/paths";
import type { Tone } from "@/features/backgrounds/utils/tone";
import { cn } from "@/utils/cn";

/** Where `bun preview` serves the extension, in the UpTab repo. */
const PREVIEW_URL = process.env.NEXT_PUBLIC_EXTENSION_PREVIEW_URL ?? "http://localhost:5174/dev/preview/";
const PREVIEW_ORIGIN = new URL(PREVIEW_URL).origin;
const WIDTH = 1280;
const HEIGHT = 720;
/** Photos loaded ahead and behind, so the next one is already there. */
const PRELOAD = [1, 2, -1];
/** How long the preview has to say hello before it counts as not running. */
const READY_TIMEOUT = 5000;

/** Sent on window with a photo's ID, to show that photo in the previewer. */
export const SELECT_PHOTO_EVENT = "select-preview-photo";

/** The same choices as the Tone select in each row, which this sets. */
const TEXT_CHOICES: { value: "" | Tone; label: string }[] = [
  { value: "", label: "Sampled" },
  { value: "light", label: "Dark text" },
  { value: "dark", label: "White text" },
];

/** Scrolls to a photo's row in the table, and flashes it. */
const showRow = (id: string) => {
  const row = document.getElementById(rowId(id));

  row?.scrollIntoView({ behavior: "smooth", block: "center" });
  row?.animate([{ backgroundColor: "rgb(56 189 248 / 0.2)" }, { backgroundColor: "transparent" }], { duration: 1500 });
};

type Photo = {
  id: string;
  file: string;
  tone: Tone;
  poorFit: boolean;
  /** The saved manual call that it isn't a poor fit after all. */
  fitIgnored?: boolean;
  /** The saved manual call. */
  override?: Tone;
};

const absolute = (file: string) => new URL(previewUrl(file), window.location.origin).href;

const selectFor = (id: string, field = "toneOverride") =>
  document.querySelector<HTMLSelectElement>(`select[name="photo:${id}:${field}"]`);

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName);

/**
 * One UpTab new tab for the whole theme, to cycle through its photos with the
 * arrow keys. The app loads once and is sent each photo as a message, so
 * switching is quick. It follows the Tone selects in the rows below, so a
 * manual call can be tried before saving.
 */
export const ThemePreview = ({ photos }: { photos: Photo[] }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [fits, setFits] = useState<Record<string, string | undefined>>({});
  const frame = useRef<HTMLIFrameElement>(null);
  const section = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const isReady = useRef(false);
  const [error, setError] = useState<string>();
  // The frame is a full-size window, shrunk to whatever width the card has
  const [scale, setScale] = useState(1);
  const photo = photos[Math.min(index, photos.length - 1)];
  const chosen = selected[photo.id] ?? photo.override;
  const selection = selected[photo.id] ?? photo.override ?? "";
  const isIgnored = (fits[photo.id] ?? (photo.fitIgnored ? "ok" : "")) === "ok";
  const isPoorFit = photo.poorFit && !isIgnored;
  const tone = chosen === "light" || chosen === "dark" ? chosen : photo.tone;

  /** Sets the row's Tone select, so it's an edit that Save keeps and Discard undoes. */
  const setChoice = (value: string) => {
    const select = selectFor(photo.id);

    if (select) {
      select.value = value;
      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const go = useCallback(
    (step: number) => setIndex((current) => (current + step + photos.length) % photos.length),
    [photos.length]
  );

  // The tone selects live in the edit form, which resets them on Discard without a change event
  useEffect(() => {
    const read = () => {
      setSelected(Object.fromEntries(photos.map(({ id }) => [id, selectFor(id)?.value ?? ""])));
      setFits(Object.fromEntries(photos.map(({ id }) => [id, selectFor(id, "poorFitIgnored")?.value])));
    };
    const readAfterReset = () => setTimeout(read);

    read();
    document.addEventListener("change", read);
    document.addEventListener("reset", readAfterReset);

    return () => {
      document.removeEventListener("change", read);
      document.removeEventListener("reset", readAfterReset);
    };
  }, [photos]);

  useEffect(() => {
    const onSelect = (event: Event) => {
      const next = photos.findIndex(({ id }) => id === (event as CustomEvent<string>).detail);

      if (next !== -1) {
        setIndex(next);
        section.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener(SELECT_PHOTO_EVENT, onSelect);

    return () => window.removeEventListener(SELECT_PHOTO_EVENT, onSelect);
  }, [photos]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        go(event.key === "ArrowRight" ? 1 : -1);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const send = useCallback(() => {
    if (isReady.current) {
      frame.current?.contentWindow?.postMessage(
        { type: "uptab-preview", src: absolute(photo.file), tone },
        PREVIEW_ORIGIN
      );
    }
  }, [photo.file, tone]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== PREVIEW_ORIGIN) {
        return;
      }

      if (event.data?.type === "uptab-preview-ready") {
        isReady.current = true;
        setError(undefined);
        send();
      } else if (event.data?.type === "uptab-preview-error") {
        setError(String(event.data.message));
      }
    };

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  useEffect(send, [send]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isReady.current) {
        setError(`Nothing answered at ${PREVIEW_URL}.\nRun "bun preview" in the UpTab repo.`);
      }
    }, READY_TIMEOUT);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const element = box.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / WIDTH));

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    for (const step of PRELOAD) {
      const next = photos[(index + step + photos.length) % photos.length];

      new Image().src = absolute(next.file);
    }
  }, [index, photos]);

  return (
    <section ref={section} className={cn(cardClass, "flex scroll-mt-4 flex-col gap-3")}>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" aria-label="Previous photo" onClick={() => go(-1)}>
          <ArrowLeftIcon className="size-4" />
        </Button>
        <Button type="button" variant="ghost" aria-label="Next photo" onClick={() => go(1)}>
          <ArrowRightIcon className="size-4" />
        </Button>
        <span className="text-sm font-medium text-dark-text">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          title="Show in the table"
          onClick={() => showRow(photo.id)}
          className="cursor-pointer truncate text-sm text-[#7f8da0] duration-150 hover:text-white"
        >
          {photo.id}
        </button>
        <div role="group" aria-label="Text colour" className="ml-auto flex rounded-full bg-[#0b121c] p-0.5 text-xs font-medium">
          {TEXT_CHOICES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={selection === value}
              onClick={() => setChoice(value)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 duration-150",
                selection === value ? "bg-sky-500 text-white" : "text-[#7f8da0] hover:text-white"
              )}
            >
              {value === "" ? `${label} (${photo.tone === "dark" ? "white" : "dark"} text)` : label}
            </button>
          ))}
        </div>
        {isPoorFit && (
          <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-xs font-medium text-rose-300">
            Poor fit: text won&apos;t read well
          </span>
        )}
      </div>
      <div
        ref={box}
        className="relative aspect-video w-full overflow-hidden rounded-md"
      >
        {error && (
          <div
            role="alert"
            className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 p-6 text-center text-xl font-medium text-rose-300 backdrop-blur-md"
          >
            <p className="max-w-xl whitespace-pre-wrap break-words">{error}</p>
          </div>
        )}
        <iframe
          ref={frame}
          title="UpTab preview"
          // A picture to judge: focus never reaches it, so its shortcuts and buttons stay quiet and the arrows keep cycling here
          inert
          src={PREVIEW_URL}
          style={{ width: WIDTH, height: HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="border-0"
        />
      </div>
    </section>
  );
};
