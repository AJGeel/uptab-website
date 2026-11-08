import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { listFeedback } from "@/features/feedback/api/db";
import { isAdminKey } from "@/features/feedback/utils/admin-auth";
import { CATEGORIES, CATEGORY_LABELS, RATING_LABELS } from "@/features/feedback/utils/schema";

export const metadata: Metadata = { title: "The Complaints Department", robots: { index: false, follow: false } };

const LIMIT = 200;

const filters = z.object({
  category: z.enum(CATEGORIES).optional().catch(undefined),
  rating: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
});

const select =
  "rounded-xl bg-dark-surface px-3 py-2.5 text-[15px] text-dark-text ring-1 ring-dark-line ring-inset";

type Props = {
  params: Promise<{ key: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

const Page = async ({ params, searchParams }: Props) => {
  // The proxy asks for the password; this makes a wrong key a 404 even if the proxy is bypassed
  if (!isAdminKey((await params).key)) {
    notFound();
  }

  const { category, rating } = filters.parse(await searchParams);
  const entries = await listFeedback({ category, rating, limit: LIMIT });

  return (
    <div className="mx-auto max-w-260 px-[clamp(1rem,4vw,2rem)] pt-[clamp(3rem,6vw,5.5rem)]">
      <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-none font-extrabold tracking-[-0.045em] text-white">
        The Complaints Department
      </h1>

      <form className="mt-8 flex flex-wrap items-center gap-3">
        <select name="category" defaultValue={category ?? ""} aria-label="Category" className={select}>
          <option value="">All categories</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
        <select name="rating" defaultValue={rating ?? ""} aria-label="Rating" className={select}>
          <option value="">Any rating</option>
          {RATING_LABELS.map((label, index) => (
            <option key={label} value={index + 1}>{`${index + 1} · ${label}`}</option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-white px-5 py-2.5 text-[15px] font-bold text-black">
          Filter
        </button>
        <span className="text-[15px] text-dark-muted">
          {entries.length === LIMIT ? `Latest ${LIMIT}` : `${entries.length} found`}
        </span>
      </form>

      <ul className="mt-8 flex flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-2xl bg-dark-surface p-5 ring-1 ring-dark-line ring-inset">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-dark-muted">
              <span className="rounded-full bg-dark-pill px-2.5 py-0.5 font-bold text-dark-text">
                {CATEGORY_LABELS[entry.category]}
              </span>
              {entry.version && <span>{`v${entry.version}`}</span>}
              {entry.rating && <span>{`${entry.rating}/5 · ${RATING_LABELS[entry.rating - 1]}`}</span>}
              <time dateTime={entry.created_at}>{`${entry.created_at.slice(0, 16).replace("T", " ")} UTC`}</time>
              {entry.email && (
                <a href={`mailto:${entry.email}`} className="link-pill text-sky-400">
                  {entry.email}
                </a>
              )}
            </p>
            <p className="mt-3 text-base leading-prose wrap-break-word whitespace-pre-wrap text-dark-body">
              {entry.message}
            </p>
          </li>
        ))}
      </ul>
      {entries.length === 0 && <p className="mt-8 text-dark-muted">Nothing here. Suspiciously quiet.</p>}
    </div>
  );
};

export default Page;
