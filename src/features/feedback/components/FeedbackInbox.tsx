"use client";

import { Select } from "@base-ui/react/select";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { FeedbackCard } from "@/features/feedback/components/FeedbackCard";
import { InboxZero } from "@/features/feedback/components/InboxZero";
import { SkyGradient } from "@/features/feedback/components/RatingFace";
import { useReadIds } from "@/features/feedback/hooks/use-read-ids";
import { CATEGORY_COLORS } from "@/features/feedback/utils/category-colors";
import { DATE_RANGES, type DateRange } from "@/features/feedback/utils/date-range";
import { CATEGORIES, CATEGORY_LABELS, type Category, type Feedback } from "@/features/feedback/utils/schema";
import { cn } from "@/utils/cn";
import "@/features/feedback/feedback.css";

const pill =
  "inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full button-wipe px-4 text-[15px] font-bold ring-1 [--wipe:linear-gradient(rgb(255_255_255/0.12),rgb(255_255_255/0.12))] ring-inset active:scale-[.97]";

const idle = "bg-[#0a111c] text-[#dce5ee] ring-[#2a374a] [--wipe-text:#dce5ee]";

const active = "text-black ring-transparent [--wipe-text:var(--color-black)]";

type Filter = Category | "all";

export const FeedbackInbox = ({ entries, range }: { entries: Feedback[]; range: DateRange }) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { ready, isRead, toggle, markRead, markUnread } = useReadIds();
  const [category, setCategory] = useState<Filter>("all");
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [now] = useState(() => Date.now());

  const rangeLabel = DATE_RANGES[range];
  const unreadTotal = entries.filter((entry) => !isRead(entry.id)).length;
  // The counts on the pills describe what each pill would show
  // Read-state is only known in the browser, so show nothing rather than flash cards that are about to be filtered out
  const candidates = ready ? entries.filter((entry) => !(unreadOnly && isRead(entry.id))) : [];
  const inboxZero = ready && unreadOnly && entries.length > 0 && candidates.length === 0;
  const shown = category === "all" ? candidates : candidates.filter((entry) => entry.category === category);
  const filters: { id: Filter; label: string; count: number; on: string }[] = [
    { id: "all", label: "All", count: candidates.length, on: "bg-white" },
    ...CATEGORIES.map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
      count: candidates.filter((entry) => entry.category === id).length,
      on: CATEGORY_COLORS[id].selected,
    })),
  ];

  return (
    <div className="flex flex-col gap-5">
      <SkyGradient />

      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-[-0.045em] text-white">The Complaints Department</h1>
        <p className="text-sm text-dark-muted">{ready && unreadTotal > 0 ? `${unreadTotal} new` : "All caught up"}</p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map(({ id, label, count, on }) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
            className={cn(pill, category === id ? [on, active] : idle)}
          >
            {label}
            <span
              className={cn(
                "text-[13px] tabular-nums",
                category === id ? "opacity-100" : "opacity-50"
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span id="inbox-range" className="text-[15px] font-semibold text-dark-muted">
          Date
        </span>
        <Select.Root
          value={range}
          disabled={pending}
          items={DATE_RANGES}
          onValueChange={(value) =>
            startTransition(() => router.replace(`?date=${value}`, { scroll: false }))
          }
        >
          <Select.Trigger
            aria-labelledby="inbox-range"
            className="flex min-h-10 items-center gap-2 rounded-xl bg-[#0a111c] px-3 text-[15px] font-semibold text-dark-text ring-1 ring-[#2a374a] duration-150 ring-inset hover:ring-[#3d506b] data-popup-open:ring-sky-500"
          >
            <Select.Value />
            <Select.Icon className="text-dark-muted">
              <ChevronDownIcon className="size-4" strokeWidth={2.5} aria-hidden="true" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-50">
              <Select.Popup className="min-w-(--anchor-width) rounded-xl bg-[#1b2638] p-1 text-dark-text shadow-2xl ring-1 ring-[#33465f] ring-inset">
                {Object.entries(DATE_RANGES).map(([value, label]) => (
                  <Select.Item
                    key={value}
                    value={value}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 outline-none data-highlighted:bg-dark-pill"
                  >
                    <Select.ItemText className="grow text-[15px] font-semibold">{label}</Select.ItemText>
                    <Select.ItemIndicator className="text-sky-400">✓</Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <button
          type="button"
          aria-pressed={unreadOnly}
          onClick={() => setUnreadOnly((current) => !current)}
          className={cn(pill, unreadOnly ? ["bg-sky-400", active] : idle)}
        >
          Unread
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-dark-line pt-4 text-[15px] text-dark-muted">
        <p aria-live="polite">
          {`${shown.length} ${shown.length === 1 ? "response" : "responses"}${range === "all" ? " in total" : ` in the ${rangeLabel.toLowerCase()}`}`}
        </p>
        <button
          type="button"
          disabled={!ready || entries.length === 0}
          onClick={() => {
            const ids = entries.map((entry) => entry.id);

            return unreadTotal > 0 ? markRead(ids) : markUnread(ids);
          }}
          className="font-bold text-sky-400 transition-colors hover:text-white disabled:opacity-50 disabled:hover:text-sky-400"
        >
          {unreadTotal > 0 ? "Mark all as read" : "Mark all as unread"}
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {shown.map((entry) => (
          <li key={entry.id}>
            <FeedbackCard
              entry={entry}
              // Until the browser's read-state is known, show the calm look rather than flashing every card as unread
              read={!ready || isRead(entry.id)}
              now={ready ? now : null}
              onToggleRead={() => toggle(entry.id)}
            />
          </li>
        ))}
      </ul>
      {inboxZero && <InboxZero />}
      {ready && !inboxZero && shown.length === 0 && (
        <p className="text-dark-muted">
          {unreadOnly ? "Nothing unread here." : `Nothing in this view (${rangeLabel.toLowerCase()}). Suspiciously quiet.`}
        </p>
      )}
    </div>
  );
};
