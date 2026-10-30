"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { BackgroundImage } from "@/features/backgrounds/types/catalogue";
import { FakeFavicon } from "@/features/home/components/FakeFavicon";
import { MiniModal, type Collection, type Modal } from "@/features/home/components/MiniModal";
import { photoSrc } from "@/features/home/photo-src";
import type { Weather } from "@/features/home/season-weather";
import { cn } from "@/utils/cn";


type KeyboardCardProps = {
  /** The photos the mini new tab flips through. */
  photos: BackgroundImage[];
  /** Shown in the Backgrounds dialog. */
  collections: Collection[];
  weather: Weather;
};

/** The extension's hotkeys (src/services/hotkeys in the UpTab repo), as the key events that trigger them. */
const HOTKEYS = {
  backslash: { key: "\\", label: "\\" },
  left: { key: "ArrowLeft", label: "←" },
  right: { key: "ArrowRight", label: "→" },
  b: { key: "b", label: "B" },
  slash: { key: "/", label: "/" },
  question: { key: "?", label: "?" },
} as const;

type HotkeyName = keyof typeof HOTKEYS;

const hotkeyFor = (key: string): HotkeyName | undefined =>
  (Object.keys(HOTKEYS) as HotkeyName[]).find((name) => HOTKEYS[name].key === key.toLowerCase() || HOTKEYS[name].key === key);

/** What the idle demo plays, one step at a time, until the visitor takes over. */
const SCRIPT: HotkeyName[] = ["right", "backslash", "b", "b", "backslash", "right", "left"];
const SCRIPT_STEP_MS = 1700;
const PRESS_MS = 180;

const KEY_ROWS: { keys: HotkeyName[]; label: string }[] = [
  { keys: ["backslash"], label: "Sidebar in / out" },
  { keys: ["left", "right"], label: "Previous / next background" },
  { keys: ["b"], label: "Choose backgrounds" },
  { keys: ["slash", "question"], label: "Settings / all shortcuts" },
];

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName));

/** The extension's Kbd: a white key with a sky-blue legend and a thick bottom edge. */
const Keycap = ({ name, pressed, onPress }: { name: HotkeyName; pressed: boolean; onPress: (name: HotkeyName) => void }) => (
  <button
    type="button"
    aria-label={`Press ${HOTKEYS[name].label}`}
    onClick={() => onPress(name)}
    className={cn(
      "flex h-11 min-w-11 items-center justify-center rounded-xl border border-sky-900/30 bg-white font-mono text-lg font-bold text-sky-500 shadow-xs transition-[transform,border-width,background-color] duration-100 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500",
      pressed ? "translate-y-0.5 border-b-2 bg-sky-500/10" : "border-b-4"
    )}
  >
    {HOTKEYS[name].label}
  </button>
);

/** "For the mouse-averse": the real hotkeys, wired to a mini new tab. Press the keys here or on your keyboard. */
export const KeyboardCard = ({ photos, collections, weather }: KeyboardCardProps) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [pressed, setPressed] = useState<HotkeyName | null>(null);
  // The idle demo plays until the visitor presses something
  const [isDemo, setIsDemo] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const run = useCallback(
    (name: HotkeyName) => {
      const toggleModal = (next: Modal) => setModal((current) => (current === next ? null : next));

      if (name === "backslash") {
        setSidebarOpen((open) => !open);
      } else if (name === "left" || name === "right") {
        setPhotoIndex((index) => (index + (name === "right" ? 1 : -1) + photos.length) % photos.length);
      } else if (name === "b") {
        toggleModal("backgrounds");
      } else if (name === "slash") {
        toggleModal("settings");
      } else {
        toggleModal("hotkeys");
      }
    },
    [photos.length]
  );

  const flash = useCallback((name: HotkeyName) => {
    setPressed(name);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(null), PRESS_MS);
  }, []);

  const press = useCallback(
    (name: HotkeyName) => {
      setIsDemo(false);
      flash(name);
      run(name);
    },
    [flash, run]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.6 });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // The visitor's own keyboard, but only while the card is on screen, so the page's keys stay theirs everywhere else
  useEffect(() => {
    if (!isInView) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || isTypingTarget(event.target)) {
        return;
      }

      if (event.key === "Escape" && modal) {
        setIsDemo(false);
        setModal(null);

        return;
      }

      // "?" is Shift + "/" on most keyboards, and not every browser reports it as "?"
      const name = event.key === "/" && event.shiftKey ? "question" : hotkeyFor(event.key);

      if (name) {
        event.preventDefault();
        press(name);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isInView, modal, press]);

  useEffect(() => {
    if (!isDemo || !isInView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let step = 0;
    const timer = setInterval(() => {
      const name = SCRIPT[step % SCRIPT.length];

      step += 1;
      flash(name);
      run(name);
    }, SCRIPT_STEP_MS);

    return () => clearInterval(timer);
  }, [isDemo, isInView, flash, run]);

  useEffect(() => () => clearTimeout(pressTimer.current), []);

  return (
    <article
      ref={cardRef}
      className="ut-s4 flex flex-wrap items-center gap-7 rounded-3xl bg-linear-to-br from-tint to-[#eef6fb] p-7 ring-1 ring-[#cfe3f1] ring-inset"
    >
      <div className="flex flex-[1_1_220px] flex-col gap-4.5">
        <div>
          <h3 className="text-[26px] font-extrabold tracking-tight">For the mouse-averse</h3>
          <p className="mt-2 text-base leading-relaxed text-body">
            Change backgrounds, pop the sidebar, Open your collections. Your mouse can take the day off. Go on, press them: here or on your own keyboard.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-body">
          {KEY_ROWS.map(({ keys, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="inline-flex gap-2">
                {keys.map((name) => (
                  <Keycap key={name} name={name} pressed={pressed === name} onPress={press} />
                ))}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative aspect-16/10 flex-[2_1_320px] overflow-hidden rounded-[14px] bg-[#c9dcea] shadow-[0_0_0_6px_#fff,0_24px_40px_-18px_rgba(2,14,44,0.4)]"
        role="img"
        aria-label="A miniature UpTab new tab that responds to the keys"
      >
        {photos.map((photo, index) => (
          <Image
            key={photo.id}
            src={photoSrc(photo, 960)}
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, 90vw"
            className={cn("object-cover transition-opacity duration-500", index === photoIndex ? "opacity-100" : "opacity-0")}
          />
        ))}

        <div
          className={cn(
            "absolute inset-y-0 left-0 z-20 flex w-[40%] flex-col gap-2.5 bg-white p-3.5 shadow-[8px_0_24px_-12px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-out-soft",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-black">{weather.temperature.toFixed(1)}°</span>
            <span className="flex flex-1 flex-col gap-1">
              <span className="h-1.5 w-[70%] rounded-sm bg-[#e5e7eb]" />
              <span className="h-1.5 w-[45%] rounded-sm bg-[#eef0f3]" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(["mail", "docs", "calendar", "news"] as const).map((kind) => (
              <span key={kind} className="flex items-center gap-1.5 rounded-lg p-1.5 ring-1 ring-[#e5e7eb] ring-inset">
                <FakeFavicon kind={kind} size={12} />
                <span className="h-1.5 flex-1 rounded-sm bg-[#e5e7eb]" />
              </span>
            ))}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg ring-1 ring-[#e5e7eb] ring-inset">
            <span className="h-4.5 border-b border-[#e5e7eb]" />
            {([["design", 80], ["notes", 62], ["recipes", 72], ["rentals", 55]] as const).map(([kind, width]) => (
              <span key={kind} className="flex items-center gap-1.5 px-1.5 py-1.25">
                <FakeFavicon kind={kind} size={12} />
                <span className="h-1.5 rounded-sm bg-[#eef0f3]" style={{ width: `${width}%` }} />
              </span>
            ))}
          </div>
          <span className="h-1.5 w-[60%] rounded-sm bg-[#e5e7eb]" />
        </div>

        {modal && <MiniModal modal={modal} collections={collections} />}
      </div>
    </article>
  );
};
