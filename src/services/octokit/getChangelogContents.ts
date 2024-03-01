import { Octokit } from "@/services/octokit/init";

export const getChangelogContents = async () => {
  try {
    const response = await Octokit.rest.repos.getContent({
      owner: "ajgeel",
      repo: "uptab",
      path: "CHANGELOG.md",
    });

    if (!("content" in response.data)) {
      throw new Error("Error: unable to find the changelog file.");
    }

    const content = Buffer.from(response.data.content, "base64").toString();

    return content;
  } catch (error) {
    throw new Error(
      `Something went wrong trying to get the changelog contents: ${error}`
    );
  }
};
