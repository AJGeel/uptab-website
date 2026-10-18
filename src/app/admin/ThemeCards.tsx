import Image from "next/image";
import Link from "next/link";

import { ActionForm } from "./ActionForm";
import { createThemeAction } from "./actions";
import { countPending, thumbnailUrl } from "./data";
import { buttonClass, cardClass, Field, inputClass, ProgressBar } from "./ui";
import type { SourceEntry, SourceMetadata } from "../../../scripts/backgrounds";

type Theme = SourceMetadata["themes"][number];

/** Shows published photos first, so the preview looks like what users see. */
const previewOf = (entries: SourceEntry[]) =>
  [...entries]
    .sort((a, b) => Number(Boolean(a.creditPending)) - Number(Boolean(b.creditPending)))
    .slice(0, 4);

export const ThemeCard = ({ theme, entries }: { theme: Theme; entries: SourceEntry[] }) => {
  const pending = countPending(entries);
  const preview = previewOf(entries);

  return (
    <Link
      href={`/admin/themes/${theme.id}`}
      className={`${cardClass} group flex flex-col gap-3 duration-150 hover:shadow-md`}
    >
      <div className="grid aspect-video grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-sm bg-slate-100">
        {preview.map((entry) => (
          <Image
            key={entry.id}
            unoptimized
            src={thumbnailUrl(entry.file)}
            width={240}
            height={135}
            alt=""
            className="size-full object-cover"
          />
        ))}
      </div>
      <div>
        <h3 className="font-bold duration-150 group-hover:text-sky-500">{theme.name}</h3>
        <p className="text-xs text-slate-400">{theme.id}</p>
      </div>
      <ProgressBar published={entries.length - pending} pending={pending} />
    </Link>
  );
};

/** Creates a theme. Its ID comes from the name unless given, and is fixed afterwards. */
export const NewThemeCard = () => (
  <ActionForm
    action={createThemeAction}
    resetOnSuccess
    className={`${cardClass} flex flex-col gap-3 border-2 border-dashed border-slate-200 shadow-none`}
  >
    <div>
      <h3 className="font-bold">New theme</h3>
      <p className="text-xs text-slate-500">
        It joins the catalogue once it has a published photo. The ID is fixed
        once created.
      </p>
    </div>
    <Field label="Name">
      <input name="name" required placeholder="e.g. Mountains" className={inputClass} />
    </Field>
    <Field label="ID (optional)">
      <input name="id" placeholder="From the name" className={inputClass} />
    </Field>
    <button className={`${buttonClass} self-start`}>Create theme</button>
  </ActionForm>
);
