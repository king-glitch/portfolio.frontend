import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { TimelineEntry } from "@/lib/portfolio/timeline";

const barVariants = cva(
	"absolute inset-y-2 flex h-auto min-w-30 items-center justify-between gap-3 overflow-hidden rounded-sm border-0 px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
	{
		variants: {
			selected: {
				true: "bg-foreground text-background hover:bg-foreground hover:text-background dark:hover:bg-foreground",
				false: "bg-transparent text-foreground ring-1 ring-border hover:bg-muted/50 hover:text-foreground hover:ring-foreground/50 dark:hover:bg-muted/40",
			},
		},
	},
);

interface TimelineBarProps {
	entry: TimelineEntry;
	selected: boolean;
	onPick: () => void;
}

/** One positioned architectural track bar; hover, focus and click all select it. */
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
				variant="ghost"
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
				<span className="font-mono text-xs font-normal opacity-60 max-desk:hidden">
					{t(`home.timeline.kinds.${entry.kind}`)}
				</span>
			</Button>
		</div>
	);
};

export default TimelineBar;
