import { ActionForm } from "./ActionForm";
import { addPhotoAction } from "./actions";
import { buttonClass, cardClass, Field, inputClass } from "./ui";
import type { SourceMetadata } from "../../../scripts/backgrounds";

/**
 * Uploads a photo. With `theme`, it goes into that theme; otherwise the form
 * offers a choice. With an author, it's published straight away.
 */
export const AddPhotoForm = ({
  themes,
  theme,
}: {
  themes: SourceMetadata["themes"];
  theme?: string;
}) => (
  <section className={`${cardClass} flex flex-col gap-3`}>
    <div>
      <h2 className="font-bold">Add a photo</h2>
      <p className="text-sm text-slate-500">
        Photos with an author are published straight away. Without one, they
        stay pending until you add it.
      </p>
    </div>
    <ActionForm action={addPhotoAction} resetOnSuccess className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Photo">
          <input
            type="file"
            name="file"
            required
            accept="image/jpeg,image/png,image/webp,image/tiff"
            className="text-sm"
          />
        </Field>
        {theme ? (
          <input type="hidden" name="theme" value={theme} />
        ) : (
          <Field label="Theme">
            <select name="theme" className={inputClass}>
              {themes.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="ID (optional)">
          <input name="id" placeholder="From the file name" className={inputClass} />
        </Field>
        <Field label="Author">
          <input name="author" placeholder="Required to publish" className={inputClass} />
        </Field>
        <Field label="Link (optional)">
          <input name="link" type="url" placeholder="https://" className={inputClass} />
        </Field>
      </div>
      <button className={`${buttonClass} self-start`}>Upload</button>
    </ActionForm>
  </section>
);
