"use server";

import { headers } from "next/headers";

import { insertFeedback } from "@/features/feedback/api/db";
import { isRateLimited } from "@/features/feedback/utils/rate-limit";
import { feedbackSchema } from "@/features/feedback/utils/schema";

export type SubmitPayload = {
  category: string;
  rating: number | null;
  message: string;
  email: string;
  /** The extension's version, prefilled from the ?v= its "Got feedback?" link adds. */
  version: string;
  /** What the visitor says they browse with, prefilled from their user agent. */
  browser: string;
  website: string;
  elapsedMs: number;
};

/** Nobody types a message in less than this. The form measures it in the browser. */
const MIN_FILL_MS = 3000;

export const submitFeedback = async (payload: SubmitPayload): Promise<{ ok: boolean }> => {
  const isBot = Boolean(payload.website) || !(payload.elapsedMs >= MIN_FILL_MS);

  // Bots get the same answer as everyone else, so they learn nothing
  if (isBot) {
    return { ok: true };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const parsed = feedbackSchema.safeParse({
    category: payload.category,
    rating: payload.rating ?? undefined,
    message: payload.message,
    email: payload.email || undefined,
    version: payload.version?.trim().replace(/^v/i, "") || undefined,
    browser: payload.browser || undefined,
    user_agent: requestHeaders.get("user-agent")?.slice(0, 300),
  });

  if (!parsed.success || isRateLimited(ip)) {
    return { ok: false };
  }

  try {
    await insertFeedback(parsed.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Saving feedback failed", error);

    return { ok: false };
  }

  return { ok: true };
};
