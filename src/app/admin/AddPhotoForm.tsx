import { BatchUpload } from "./BatchUpload";
import type { ThemeSummary } from "./data";
import { cardClass } from "./ui";

/**
 * Uploads one or more photos. With `theme`, they go into that theme;
 * otherwise a picker shows every theme's photos.
 */
export const AddPhotoForm = ({
  themes,
  theme,
  existingIds,
}: {
  themes?: ThemeSummary[];
  theme?: string;
  /** Every photo ID in use, so clashes show before uploading. */
  existingIds: string[];
}) => (
  <section className={`${cardClass} p-5`}>
    <BatchUpload themes={themes} theme={theme} existingIds={existingIds} />
  </section>
);
