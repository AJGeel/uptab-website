import { request } from "@/features/feedback/api/db";
import { hasBearer } from "@/features/feedback/utils/admin-auth";
import { nextDueAt } from "@/features/insomnia/utils/next-due";
import { countSheep, pickReason } from "@/features/insomnia/utils/reasons";

/*
 * Called hourly by .github/workflows/insomnia.yml. Reading the feedback table did
 * not stop Supabase from pausing the project, so this writes a fake sleepless
 * night instead. Each row says when the next one is due; every call in between
 * does nothing.
 */
export const GET = async (req: Request) => {
  if (!hasBearer(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const [latest]: { next_due_at: string }[] = await (
    await request("SUPABASE_SECRET_KEY", "insomnia?select=next_due_at&order=created_at.desc&limit=1")
  ).json();

  const now = new Date();

  if (latest && new Date(latest.next_due_at) > now) {
    return Response.json({ slept: true });
  }

  await request("SUPABASE_SECRET_KEY", "insomnia", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      reason: pickReason(),
      sheep_counted: countSheep(),
      next_due_at: nextDueAt(now).toISOString(),
    }),
  });

  return Response.json({ slept: false });
};
