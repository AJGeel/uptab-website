import { getLatestRelease } from "@/services/octokit/getLatestRelease";

export const GET = async () => {
  const data = await getLatestRelease();

  if (!data) {
    return Response.json({ data: null });
  }

  return Response.json(data);
};
