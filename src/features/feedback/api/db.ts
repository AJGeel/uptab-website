import type { Feedback, FeedbackInput } from "@/features/feedback/utils/schema";

/*
 * Plain PostgREST over fetch. Sending feedback uses the publishable key, which
 * RLS limits to inserting. Reading uses the secret key, which bypasses RLS, so
 * those calls must only ever happen on the server.
 */
const request = async (keyName: "SUPABASE_PUBLISHABLE_KEY" | "SUPABASE_SECRET_KEY", path: string, init: RequestInit = {}) => {
  const { SUPABASE_URL } = process.env;
  const key = process.env[keyName];

  if (!SUPABASE_URL || !key) {
    throw new Error(`SUPABASE_URL and ${keyName} must be set`);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase responded with ${response.status}`);
  }

  return response;
};

export const insertFeedback = async (entry: FeedbackInput) => {
  await request("SUPABASE_PUBLISHABLE_KEY", "feedback", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(entry),
  });
};

type ListOptions = {
  category?: Feedback["category"];
  rating?: number;
  since?: Date;
  limit: number;
};

/** Newest first. Any call also counts as database activity, which keeps the project from pausing. */
export const listFeedback = async ({ category, rating, since, limit }: ListOptions): Promise<Feedback[]> => {
  const params = new URLSearchParams({ select: "*", order: "created_at.desc", limit: String(limit) });

  if (category) {
    params.set("category", `eq.${category}`);
  }

  if (rating) {
    params.set("rating", `eq.${rating}`);
  }

  if (since) {
    params.set("created_at", `gte.${since.toISOString()}`);
  }

  return (await request("SUPABASE_SECRET_KEY", `feedback?${params}`)).json();
};
