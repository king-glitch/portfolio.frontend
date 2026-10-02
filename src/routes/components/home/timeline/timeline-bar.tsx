import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { TimelineEntry } from "@/lib/portfolio/timeline";

const barVariants = cva(
	"absolute inset-y-0 flex h-auto min-w-30 items-center justify-between gap-3 overflow-hidden rounded-pill border-0 px-5 text-sm font-bold whitespace-nowrap shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
	{
		variants: {
			selected: {
				true: "bg-foreground text-background",
				false: "bg-card text-foreground",
			},
		},
	},
);

interface TimelineBarProps {
	entry: TimelineEntry;
	selected: boolean;
	onPick: () => void;
}

/** One positioned bar of the ruler; hover, focus and click all select it. */
export const TimelineBar: React.FC<TimelineBarProps> = ({
	entry,
	selected,
	onPick,
}) => {
	const { t } = useTranslation();
	return (
		<div className="relative h-14">
			<Button
				type="button"
				aria-pressed={selected}
				onClick={onPick}
				onMouseEnter={onPick}
				onFocus={onPick}
				style={{
					left: `${entry.leftPct}%`,
					width: `${entry.widthPct}%`,
				}}
				className={barVariants({ selected })}
			>
				<span className="truncate">{entry.shortTitle}</span>
				<span className="font-medium opacity-60 max-desk:hidden">
					{t(`home.timeline.kinds.${entry.kind}`)}
				</span>
			</Button>
		</div>
	);
};

export default TimelineBar;
