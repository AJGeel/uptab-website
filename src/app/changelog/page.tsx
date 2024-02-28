import { ArrowPathIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { getChangelogContents } from "@/services/octokit/getChangelogContents";

const Page = async () => {
  const contents = await getChangelogContents();

  return (
    <>
      <div className="mx-auto my-32 w-full max-w-3xl px-4 md:px-6">
        <ReactMarkdown
          className="prose-sm"
          components={{
            h1: (props) => (
              <h1 className="text-2xl font-bold lg:text-3xl">
                <ArrowPathIcon className="-mt-1 mr-2 inline size-6 text-sky-500" />
                <span>{props.children}</span>
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
              <h3 className="font-semibold bg-clip-text text-transparent bg-black">
                {props.children}
              </h3>
            ),
            a: ({ ...props }) => (
              <a
                className="font-bold text-sky-500 no-underline duration-150 hover:text-black"
                target="_blank"
                rel="noopener noreferrer"
                href={props.href}
              >
                {props.children}
              </a>
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-8">{props.children}</ul>
            ),
          }}
        >
          {contents}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default Page;
