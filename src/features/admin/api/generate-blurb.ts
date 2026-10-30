"use server";

import { isLocalRequest } from "@/features/admin/api/is-local-request";
import { NOT_LOCAL } from "@/features/admin/api/run-action";
import { buildBlurbPrompt, cleanBlurb } from "@/features/admin/utils/blurb-prompt";

const HOST = process.env.OLLAMA_HOST ?? "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "gemma3:4b";

/** Asks a local Ollama model for a theme's blurb. The caller reviews it before saving. */
export const generateBlurbAction = async (
  name: string
): Promise<{ blurb: string; error: null } | { blurb: null; error: string }> => {
  if (!(await isLocalRequest())) {
    return { blurb: null, error: NOT_LOCAL.error as string };
  }

  try {
    const response = await fetch(`${HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt: buildBlurbPrompt(name), stream: false }),
      // The first request also loads the model
      signal: AbortSignal.timeout(90_000),
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${await response.text()}`);
    }

    const blurb = cleanBlurb(((await response.json()) as { response?: string }).response ?? "", name);

    return blurb ? { blurb, error: null } : { blurb: null, error: "The model returned nothing." };
  } catch (error) {
    return {
      blurb: null,
      error: `Couldn't get a blurb from Ollama (${HOST}, model ${MODEL}). Is it running, and is the model pulled? ${error instanceof Error ? error.message : error}`,
    };
  }
};
