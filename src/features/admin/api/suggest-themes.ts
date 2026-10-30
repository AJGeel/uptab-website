"use server";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { askOllama } from "@/features/admin/api/ollama";
import { loadState, NOT_LOCAL } from "@/features/admin/api/run-action";
import {
  buildSuggestionsPrompt,
  parseSuggestions,
  pickAngles,
  type ThemeSuggestion,
} from "@/features/admin/utils/theme-suggestions";

/** Asks a local Ollama model for themes the catalogue doesn't have yet. */
export const suggestThemesAction = async (): Promise<
  { suggestions: ThemeSuggestion[]; error: null } | { suggestions: null; error: string }
> => {
  if (!(await isLocalRequest())) {
    return { suggestions: null, error: NOT_LOCAL.error as string };
  }

  const { metadata } = await loadState();
  const { text, error } = await askOllama(buildSuggestionsPrompt(metadata.themes, pickAngles()), "json", 1.2);

  if (error !== null) {
    return { suggestions: null, error };
  }

  try {
    const suggestions = parseSuggestions(
      text,
      metadata.themes.map(({ name }) => name)
    );

    return suggestions.length > 0
      ? { suggestions, error: null }
      : { suggestions: null, error: "The model had nothing new to suggest. Try again." };
  } catch (parseError) {
    return { suggestions: null, error: `${parseError instanceof Error ? parseError.message : parseError} Try again.` };
  }
};
