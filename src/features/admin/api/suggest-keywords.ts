"use server";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { askOllama } from "@/features/admin/api/ollama";
import { NOT_LOCAL } from "@/features/admin/api/run-action";
import { buildKeywordsPrompt, parseKeywords } from "@/features/admin/utils/keyword-suggestions";

/** Asks a local Ollama model for Unsplash searches that fit a theme. */
export const suggestKeywordsAction = async (
  name: string,
  blurb?: string
): Promise<{ keywords: string[]; error: null } | { keywords: null; error: string }> => {
  if (!(await isLocalRequest())) {
    return { keywords: null, error: NOT_LOCAL.error as string };
  }

  const { text, error } = await askOllama(buildKeywordsPrompt(name, blurb), "json", 1);

  if (error !== null) {
    return { keywords: null, error };
  }

  try {
    const keywords = parseKeywords(text);

    return keywords.length > 0
      ? { keywords, error: null }
      : { keywords: null, error: "The model had no keywords to suggest. Try again." };
  } catch (parseError) {
    return { keywords: null, error: `${parseError instanceof Error ? parseError.message : parseError} Try again.` };
  }
};
