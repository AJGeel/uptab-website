import { Octokit as OctokitSDK } from "octokit";

export const Octokit = new OctokitSDK({
  auth: process.env.GH_ACCESS_TOKEN || "",
});
