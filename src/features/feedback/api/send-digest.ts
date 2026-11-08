import { getBaseUrl } from "@/features/backgrounds/utils/base-url";
import { ADMIN_BASE } from "@/features/feedback/utils/admin-auth";
import { buildDigest } from "@/features/feedback/utils/digest";
import type { Feedback } from "@/features/feedback/utils/schema";

/** Resend only delivers from this address to the account owner, which is enough for a note to yourself. */
const DEFAULT_FROM = "UpTab <onboarding@resend.dev>";

export const sendDigest = async (entries: Feedback[]) => {
  const { RESEND_API_KEY, FEEDBACK_EMAIL_TO, FEEDBACK_EMAIL_FROM, FEEDBACK_ADMIN_KEY } = process.env;

  if (!RESEND_API_KEY || !FEEDBACK_EMAIL_TO || !FEEDBACK_ADMIN_KEY) {
    throw new Error("RESEND_API_KEY, FEEDBACK_EMAIL_TO and FEEDBACK_ADMIN_KEY must be set");
  }

  const { subject, text } = buildDigest(entries, `${getBaseUrl()}${ADMIN_BASE}/${FEEDBACK_ADMIN_KEY}`);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FEEDBACK_EMAIL_FROM ?? DEFAULT_FROM, to: [FEEDBACK_EMAIL_TO], subject, text }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded with ${response.status}`);
  }
};
