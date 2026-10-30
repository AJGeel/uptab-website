"use server";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { askOllama } from "@/features/admin/api/ollama";
import { NOT_LOCAL } from "@/features/admin/api/run-action";
import { buildBlurbPrompt, cleanBlurb } from "@/features/admin/utils/blurb-prompt";

/** Asks a local Ollama model for a theme's blurb. The caller reviews it before saving. */
export const generateBlurbAction = async (
  name: string
): Promise<{ blurb: string; error: null } | { blurb: null; error: string }> => {
  if (!(await isLocalRequest())) {
    return { blurb: null, error: NOT_LOCAL.error as string };
  }

  const { text, error } = await askOllama(buildBlurbPrompt(name));

  if (error !== null) {
    return { blurb: null, error };
  }

  const blurb = cleanBlurb(text, name);

  return blurb ? { blurb, error: null } : { blurb: null, error: "The model returned nothing." };
};
