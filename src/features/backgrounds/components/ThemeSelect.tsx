"use client";

import { Select } from "@base-ui/react/select";
import Image from "next/image";
import { useState } from "react";

import type { ThemeSummary } from "@/features/backgrounds/utils/theme-summary";

import { NewThemeDialog } from "./NewThemeDialog";

/** Not a valid slug, so it can never clash with a real theme ID. */
const NEW_THEME = "+new";

/** A theme's first photos in a row, so it's recognisable at a glance. */
const Thumbnails = ({ theme }: { theme: ThemeSummary }) => (
  <span className="flex shrink-0 gap-0.5 overflow-hidden rounded-sm bg-slate-100">
    {theme.thumbnails.length > 0 ? (
      theme.thumbnails.map((src) => (
        <Image
          key={src}
          unoptimized
          src={src}
          width={40}
          height={28}
          alt=""
          className="h-7 w-10 object-cover"
        />
      ))
    ) : (
      <span className="flex h-7 w-10 items-center justify-center text-xs text-slate-400">—</span>
    )}
  </span>
);

const Counts = ({ theme }: { theme: ThemeSummary }) => (
  <span className="text-xs text-slate-500">
    {theme.published + theme.pending === 0
      ? "No photos yet"
      : `${theme.published} published · ${theme.pending} pending`}
  </span>
);

/**
 * Picks the theme for an upload, showing each theme's photos. Submits as a
 * regular "theme" form field. The last item creates a theme in a modal and
 * selects it.
 */
export const ThemeSelect = ({ themes }: { themes: ThemeSummary[] }) => {
  const [value, setValue] = useState<string | null>(themes[0]?.id ?? null);
  const [isCreating, setIsCreating] = useState(false);
  const selected = themes.find((theme) => theme.id === value);

  const choose = (next: string | null) => {
    if (next === NEW_THEME) {
      setIsCreating(true);
    } else {
      setValue(next);
    }
  };

  return (
    <>
      <Select.Root
        name="theme"
        value={value}
        onValueChange={choose}
        items={[
          ...themes.map(({ id, name }) => ({ value: id, label: name })),
          { value: NEW_THEME, label: "New theme…" },
        ]}
      >
        <Select.Trigger className="flex w-full items-center gap-3 rounded-lg border border-slate-300 bg-white p-2 text-left duration-150 hover:border-slate-400 data-popup-open:border-sky-500">
          {selected && <Thumbnails theme={selected} />}
          <span className="flex grow flex-col">
            <Select.Value className="text-sm font-medium text-slate-900" />
            {selected && <Counts theme={selected} />}
          </span>
          <Select.Icon className="text-slate-400">▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-50">
            <Select.Popup className="max-h-80 w-(--anchor-width) overflow-auto rounded-lg bg-white p-1 shadow-xl crispy-outline">
              {themes.map((theme) => (
                <Select.Item
                  key={theme.id}
                  value={theme.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 outline-none data-highlighted:bg-slate-100"
                >
                  <Thumbnails theme={theme} />
                  <span className="flex grow flex-col">
                    <Select.ItemText className="text-sm font-medium text-slate-900">
                      {theme.name}
                    </Select.ItemText>
                    <Counts theme={theme} />
                  </span>
                  <Select.ItemIndicator className="text-sky-500">✓</Select.ItemIndicator>
                </Select.Item>
              ))}
              <Select.Separator className="my-1 h-px bg-slate-200" />
              <Select.Item
                value={NEW_THEME}
                className="flex cursor-pointer items-center gap-3 rounded-md p-2 text-sm font-medium text-sky-500 outline-none data-highlighted:bg-sky-50"
              >
                <span className="flex h-7 w-10 items-center justify-center rounded-sm border border-dashed border-sky-300 text-base">
                  +
                </span>
                <Select.ItemText>New theme…</Select.ItemText>
              </Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <NewThemeDialog open={isCreating} onOpenChange={setIsCreating} onCreated={setValue} />
    </>
  );
};
