import type { PhotoFields, ThemeEdits } from "@/features/backgrounds/utils/edits";

/**
 * Turns the theme page's "<group>:<field>" form names back into edits, e.g.
 * "photo:koppelpoort:author" and "theme:name". The form only sends groups
 * that changed, see components/EditForm.tsx.
 */
export const readEdits = (form: FormData): ThemeEdits => {
  const groups = new Map<string, Record<string, string>>();

  for (const [name, value] of form.entries()) {
    const split = name.lastIndexOf(":");
    const group = name.slice(0, split);

    groups.set(group, { ...groups.get(group), [name.slice(split + 1)]: String(value) });
  }

  const theme = groups.get("theme");
  const photos = [...groups]
    .filter(([group]) => group.startsWith("photo:"))
    .map(([group, fields]) => ({
      originalId: group.slice("photo:".length),
      fields: {
        id: (fields.id ?? "").trim(),
        theme: fields.theme ?? "",
        author: fields.author ?? "",
        link: fields.link ?? "",
      } satisfies PhotoFields,
    }));

  return {
    theme: theme ? { id: theme.id ?? "", name: theme.name ?? "" } : undefined,
    photos,
  };
};
