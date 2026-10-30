import { cache } from "react";

import { parseChangelog } from "@/features/changelog/utils/parse-changelog";
import { getChangelogContents } from "@/services/octokit/getChangelogContents";

/** The releases in the repo's CHANGELOG.md, newest first. Fetched once per request. */
export const getReleases = cache(async () => parseChangelog(await getChangelogContents()));
