import { cn } from "@/utils/cn";

type PillTabsProps = {
  label: string;
  tabs: string[];
  selected: number;
  onSelect: (index: number) => void;
  /** While set, the selected tab fills left to right over the autoplay duration. Change it to restart the fill. */
  progressKey?: string;
};

/** Rounded tabs in a white tray. The selected tab is navy, with a sky-blue fill sweeping across it. */
export const PillTabs = ({ label, tabs, selected, onSelect, progressKey }: PillTabsProps) => (
  <div
    role="tablist"
    aria-label={label}
    className="flex w-fit max-w-full flex-wrap gap-1 rounded-[26px] bg-white p-1.25 shadow-[inset_0_0_0_1px_#e2e8ef,0_10px_30px_-20px_rgba(2,14,44,0.35)]"
  >
    {tabs.map((tab, index) => {
      const isSelected = index === selected;

      return (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={isSelected}
          onClick={() => onSelect(index)}
          className={cn(
            "relative min-h-11 overflow-hidden rounded-full px-4.5 text-[15px] transition duration-200 active:scale-[.97]",
            isSelected ? "bg-black font-bold text-white" : "font-semibold text-body hover:bg-[#eaf5fc]"
          )}
        >
          {isSelected && progressKey && (
            <span key={progressKey} aria-hidden="true" className="ut-prog absolute inset-0 rounded-[inherit] bg-sky-500" />
          )}
          <span className="relative">{tab}</span>
        </button>
      );
    })}
  </div>
);
