/**
 * CLI helpers, following the same pattern as uptab's dev/commands/ui.ts.
 * Scripts here also run in Vercel builds, so nothing in this file prompts.
 */
import * as p from "@clack/prompts";
import pc from "picocolors";

export { p, pc };

/*
 * Clack only stops animating its spinner when CI is exactly "true". Without a
 * terminal, e.g. in Vercel's build log, use plain log lines instead.
 */
const isInteractive = process.stdout.isTTY === true;

export const header = (title: string) =>
  p.intro(pc.bgYellowBright(pc.black(pc.bold(` ⬆️  ${title} `))));

/** Shows a spinner while `task` runs, then a ✓ or ✗ line. */
export const step = async <T>(
  title: string,
  task: (update: (message: string) => void) => Promise<T>,
  done: string | ((result: T) => string) = title
) => {
  const getDone = (result: T) =>
    typeof done === "function" ? done(result) : done;

  if (!isInteractive) {
    p.log.step(title);

    try {
      const result = await task(() => {});

      p.log.success(getDone(result));

      return result;
    } catch (error) {
      p.log.error(pc.red(title));
      throw error;
    }
  }

  const spinner = p.spinner();

  spinner.start(title);

  try {
    const result = await task((message) => spinner.message(message));

    spinner.stop(getDone(result));

    return result;
  } catch (error) {
    spinner.error(pc.red(title));
    throw error;
  }
};

/** Runs a CLI entry point, ending with a red outro and exit code 1 on errors. */
export const runCli = (main: () => Promise<void>) =>
  main().catch((error: Error) => {
    p.log.error(error.message);
    p.outro(pc.red("Failed"));
    process.exit(1);
  });
