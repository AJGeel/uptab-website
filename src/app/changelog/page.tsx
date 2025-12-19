import { ArrowPathIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { cache } from "react";
import ReactMarkdown from "react-markdown";

import { getChangelogContents } from "@/services/octokit/getChangelogContents";
import { targetBlank } from "@/utils/targetBlank";

export const revalidate = 3600; // Revalidate at most every hour

const getCachedData = cache(async () => await getChangelogContents());

const Page = async () => {
  const contents = await getCachedData();

  return (
    <>
      <div className="mx-auto my-32 w-full max-w-3xl px-4 md:px-6">
        {contents ? (
          <div className="prose-sm text-slate-700">
            <ReactMarkdown
              components={{
                h1: (props) => (
                  <h1 className="text-2xl font-bold lg:text-3xl">
                    <ArrowPathIcon className="-mt-1 mr-2 inline size-6 text-sky-500" />
                    <span>UpTab {props.children}</span>
                  </h1>
                ),
                h2: ({ ...props }) => (
                  <h2 className="mt-40 flex items-center gap-2">
                    <Image
                      src="/images/icon.svg"
                      width="20"
                      height="20"
                      alt="UpTab Logo"
                      className="m-0"
                    />
                    {props.children}
                  </h2>
                ),
                h3: ({ ...props }) => (
                  <h3 className="bg-black bg-clip-text font-semibold text-transparent">
                    {props.children}
                  </h3>
                ),
                a: ({ ...props }) => (
                  <a
                    className="font-bold text-sky-500 no-underline duration-150 hover:text-black"
                    {...targetBlank}
                    href={props.href}
                  >
                    {props.children}
                  </a>
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-8">{props.children}</ul>
                ),
                code: ({ ...props }) => (
                  <code className="rounded-md border border-black/20 bg-white px-1.5 py-1 shadow-[0px_2px_rgba(0,0,0,.1)]">
                    {props.children}
                  </code>
                ),
              }}
            >
              {contents}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-center">
            The changelog could not be retrieved. Perhaps the Github API is
            down.
          </p>
        )}
      </div>
    </>
  );
};

export default Page;
