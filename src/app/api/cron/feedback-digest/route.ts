import { listFeedback } from "@/features/feedback/api/db";
import { sendDigest } from "@/features/feedback/api/send-digest";
import { hasBearer } from "@/features/feedback/utils/admin-auth";

const DAY_MS = 24 * 60 * 60 * 1000;

/*
 * Runs daily (see vercel.json). Vercel sends CRON_SECRET as a bearer token.
 * Reading the entries also keeps the Supabase project from pausing.
 */
export const GET = async (request: Request) => {
  if (!hasBearer(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const entries = await listFeedback({ since: new Date(Date.now() - DAY_MS), limit: 100 });

  if (entries.length > 0) {
    await sendDigest(entries);
  }

  return Response.json({ entries: entries.length });
};
