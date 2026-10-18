import { ActionForm } from "./ActionForm";
import { addPhotoAction } from "./actions";
import type { ThemeSummary } from "./data";
import { PhotoDrop } from "./PhotoDrop";
import { ThemeSelect } from "./ThemeSelect";
import { buttonClass, cardClass, Field, inputClass } from "./ui";

/**
 * Uploads a photo. With `theme`, it goes into that theme; otherwise a picker
 * shows every theme's photos. With an author, it's published straight away.
 */
export const AddPhotoForm = ({
  themes,
  theme,
}: {
  themes?: ThemeSummary[];
  theme?: string;
}) => (
  <ActionForm
    action={addPhotoAction}
    resetOnSuccess
    className={`${cardClass} grid gap-6 p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`}
  >
    <PhotoDrop />
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-bold">Add a photo</h2>
        <p className="text-sm text-slate-500">
          Give it an author to publish it right away.
        </p>
      </div>
      {theme ? (
        <input type="hidden" name="theme" value={theme} />
      ) : (
        // Not a <label>: clicking one would also click the picker's button
        <div className="flex flex-col gap-1 text-xs font-medium text-slate-500">
          Theme
          <ThemeSelect themes={themes ?? []} />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Author">
          <input name="author" placeholder="Required to publish" className={inputClass} />
        </Field>
        <Field label="Link (optional)">
          <input name="link" type="url" placeholder="https://" className={inputClass} />
        </Field>
        <Field label="ID (optional)">
          <input name="id" placeholder="From the file name" className={inputClass} />
        </Field>
      </div>
      <button className={`${buttonClass("primary")} mt-auto self-start`}>Upload</button>
    </div>
  </ActionForm>
);
