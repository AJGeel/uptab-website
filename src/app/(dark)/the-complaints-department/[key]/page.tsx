import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { listFeedback } from "@/features/feedback/api/db";
import { FeedbackInbox } from "@/features/feedback/components/FeedbackInbox";
import { dateRangeSince, parseDateRange } from "@/features/feedback/utils/date-range";
import { isAdminKey } from "@/features/feedback/utils/admin-auth";

export const metadata: Metadata = { title: "The Complaints Department", robots: { index: false, follow: false } };

/** Plenty for a feedback form. The inbox filters these in the browser. The date range is applied in the query. */
const LIMIT = 200;

type Props = { params: Promise<{ key: string }>; searchParams: Promise<{ date?: string }> };

const Page = async ({ params, searchParams }: Props) => {
  // The proxy asks for the password; this makes a wrong key a 404 even if the proxy is bypassed
  if (!isAdminKey((await params).key)) {
    notFound();
  }

  const range = parseDateRange((await searchParams).date);

  return (
    <div className="mx-auto max-w-170 px-[clamp(1rem,4vw,2rem)] pt-[clamp(3rem,6vw,5.5rem)] pb-24">
      <FeedbackInbox entries={await listFeedback({ limit: LIMIT, since: dateRangeSince(range) })} range={range} />
    </div>
  );
};

export default Page;
