import { Octokit } from "@/services/octokit/init";

export const getLatestRelease = async () => {
  try {
    const result = await Octokit.request("GET /repos/{owner}/{repo}/releases", {
      owner: "ajgeel",
      repo: "uptab",
    });

    return {
      name: result.data[0].tag_name,
      date: result.data[0].published_at,
    };
  } catch (error) {
    throw new Error(`Unable to get the latest release from Github: ${error}`);
  }
};
