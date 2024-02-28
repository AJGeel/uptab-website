import { octokit } from "@/services/octokit/init";

export const getLatestRelease = async () => {
  const result = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner: "ajgeel",
    repo: "uptab",
  });

  return {
    name: result.data[0].tag_name,
    date: result.data[0].published_at,
  };
};
