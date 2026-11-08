import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

import { RatingFace } from "@/features/feedback/components/RatingFace";
import { CATEGORY_COLORS } from "@/features/feedback/utils/category-colors";
import { describeSetup } from "@/features/feedback/utils/describe-setup";
import { formatWhen } from "@/features/feedback/utils/format-when";
import { CATEGORY_LABELS, type Feedback, RATING_LABELS } from "@/features/feedback/utils/schema";
import { cn } from "@/utils/cn";

const WIPE =
  "button-wipe [--wipe:linear-gradient(rgb(255_255_255/0.12),rgb(255_255_255/0.12))] active:scale-[.97]";

const button = "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[15px] font-bold";

// The address is only ever put in a mailto: link when it looks like one
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  entry: Feedback;
  read: boolean;
  /** Null until the viewer's timezone is known, so the server and the browser agree. */
  now: number | null;
  onToggleRead: () => void;
};

export const FeedbackCard = ({ entry, read, now, onToggleRead }: Props) => {
  const setup = describeSetup(entry);
  const email = entry.email && EMAIL_PATTERN.test(entry.email) ? entry.email : null;

  return (
    <article
      className={cn(
        "flex flex-col gap-3.5 rounded-[20px] bg-dark-surface p-5 ring-inset",
        read ? "ring-1 ring-dark-line" : "ring-2 ring-sky-400"
      )}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span className={cn("rounded-full px-3 py-1 text-sm font-bold", CATEGORY_COLORS[entry.category].tag)}>
          {CATEGORY_LABELS[entry.category]}
        </span>
        {entry.rating && (
          <span className="fb-rate flex items-center gap-2 text-sm font-semibold text-dark-body" data-on>
            <span className="w-7 [&_.fb-face]:animate-none">
              <RatingFace rating={entry.rating} />
            </span>
            {RATING_LABELS[entry.rating - 1]}
          </span>
        )}
        <time dateTime={entry.created_at} className="ml-auto flex items-center gap-2 text-sm text-dark-muted">
          {now === null ? <span className="invisible">Yesterday 00:00</span> : formatWhen(entry.created_at, now)}
          {!read && (
            <>
              <span aria-hidden="true" className="size-2.5 rounded-full bg-sky-400" />
              <span className="sr-only">Unread</span>
            </>
          )}
        </time>
      </header>

      <p
        className={cn(
          "text-base leading-prose wrap-break-word whitespace-pre-wrap",
          read ? "text-dark-body" : "text-white"
        )}
      >
        {entry.message}
      </p>

      <p className="text-sm text-dark-muted">
        {entry.email && <>{entry.email} · </>}
        {[setup.version, setup.browser].map(({ text, missing }, index) => (
          <Fragment key={text}>
            {index > 0 && " · "}
            <span className={missing ? "italic" : undefined}>{text}</span>
          </Fragment>
        ))}
      </p>

      <div className="flex flex-wrap gap-2.5">
        {email && (
          <a
            href={`mailto:${encodeURIComponent(email).replace("%40", "@")}?subject=${encodeURIComponent("Re: your UpTab feedback")}`}
            className={cn(button, WIPE, "bg-sky-400 text-black [--wipe-text:var(--color-black)]")}
          >
            <EnvelopeIcon className="size-4.5" aria-hidden="true" />
            Reply
          </a>
        )}
        <button
          type="button"
          onClick={onToggleRead}
          className={cn(button, WIPE, "text-dark-text ring-1 ring-[#3c5070] [--wipe-text:var(--color-dark-text)] ring-inset")}
        >
          {read ? "Mark as unread" : "Mark as read"}
        </button>
      </div>
    </article>
  );
};
