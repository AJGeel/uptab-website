import { hint, legend } from "@/features/feedback/components/field-styles";
import { RatingFace } from "@/features/feedback/components/RatingFace";
import { RATING_LABELS } from "@/features/feedback/utils/schema";

const RATING_HINTS = [
  "Pick a face. Honesty welcome, no hard feelings.",
  "Oof. Tell me what broke your heart.",
  "Meh is fair. What would make it better?",
  "Okay is a start. What would make it great?",
  "Nice! What’s missing for a perfect score?",
  "Aww, stop it. (Don’t stop it.)",
];

export const RatingField = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => (
  <fieldset className="flex flex-col">
    <legend className={`${legend} mb-1`}>
      How’s UpTab treating you? <span className="font-medium text-dark-muted">(optional)</span>
    </legend>
    <p className={`${hint} mb-4`}>{RATING_HINTS[rating]}</p>
    <div data-any={rating > 0 || undefined} className="fb-rates grid max-w-110 grid-cols-5 gap-2">
      {RATING_LABELS.map((label, index) => {
        const value = index + 1;
        const on = rating === value;

        return (
          <label
            key={label}
            data-on={on || undefined}
            className="fb-rate flex min-w-0 cursor-pointer flex-col items-center gap-2"
          >
            <input
              type="radio"
              name="rating"
              value={value}
              checked={on}
              // Radios can't be unchecked by clicking, so a second click on the picked face clears it
              onChange={() => onChange(value)}
              onClick={() => on && onChange(0)}
              className="sr-only"
            />
            <RatingFace rating={value} />
            <span className={`text-[13px] whitespace-nowrap ${on ? "font-extrabold text-white" : "font-semibold text-dark-muted"}`}>
              {label}
            </span>
          </label>
        );
      })}
    </div>
  </fieldset>
);
