import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GH_ACCESS_TOKEN || "",
});
