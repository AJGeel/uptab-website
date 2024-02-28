import { Octokit } from "@/services/octokit/init";

export const getChangelogContents = async () => {
  try {
    const response = await Octokit.rest.repos.getContent({
      owner: "ajgeel",
      repo: "uptab",
      path: "CHANGELOG.md",
    });

    if (Array.isArray(response.data)) {
      console.error("Error: expected file, but got a directory.");
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const content = Buffer.from(response.data.content, "base64").toString();

    return content;
  } catch (error) {
    console.error(
      `Something went wrong trying to get the changelog contents: ${error}`
    );
  }
};
