const HOST = process.env.OLLAMA_HOST ?? "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "gemma3:4b";

/**
 * Asks the local Ollama model, returning its reply text or an error to show.
 * `format: "json"` makes it answer in JSON; a higher `temperature` makes it
 * less predictable.
 */
export const askOllama = async (
  prompt: string,
  format?: "json",
  temperature?: number
): Promise<{ text: string; error: null } | { text: null; error: string }> => {
  try {
    const request = () =>
      fetch(`${HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          prompt,
          stream: false,
          ...(format ? { format } : {}),
          ...(temperature === undefined ? {} : { options: { temperature } }),
        }),
        // The first request also loads the model
        signal: AbortSignal.timeout(90_000),
      });
    let response = await request();

    /*
     * Small models sometimes loop on a token, which Ollama aborts with a 500.
     * It differs from run to run, so trying again usually works.
     */
    for (let retry = 0; retry < 2 && response.status === 500; retry += 1) {
      response = await request();
    }

    if (!response.ok) {
      throw new Error(`${response.status} ${await response.text()}`);
    }

    const { response: text = "" } = (await response.json()) as { response?: string };

    return { text, error: null };
  } catch (error) {
    return {
      text: null,
      error: `Couldn't get an answer from Ollama (${HOST}, model ${MODEL}). Is it running, and is the model pulled? ${error instanceof Error ? error.message : error}`,
    };
  }
};
