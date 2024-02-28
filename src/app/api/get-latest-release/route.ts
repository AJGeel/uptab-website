import { getLatestRelease } from "@/services/octokit/getLatestRelease";

export const GET = async () => {
  const data = await getLatestRelease();

  return Response.json(data);
};
