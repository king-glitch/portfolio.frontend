import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { StackStop as StackStopModel } from "@/types/home";

const stopVariants = cva(
	"h-auto min-h-45 w-[clamp(136px,12.5vw,184px)] flex-none flex-col items-start justify-between gap-4 rounded-[22px] border-0 p-4.5 text-left whitespace-normal transition-[background-color,color,translate,opacity] duration-600 ease-(--ease-out-expo) max-desk:min-h-0 max-desk:w-auto max-desk:translate-y-0 max-desk:items-stretch",
	{
		variants: {
			selected: {
				true: "-translate-y-3 bg-foreground text-background hover:bg-foreground hover:text-background dark:hover:bg-foreground",
				false: "bg-card text-foreground opacity-70 ring-1 ring-border hover:bg-card hover:text-foreground dark:hover:bg-card",
			},
		},
	},
);

interface StackStopProps {
	stop: StackStopModel;
	/** 0-based position, shown as 01..05. */
	index: number;
	/** Projects that went through this stop; undefined while loading. */
	count?: number;
	selected: boolean;
	onSelect: () => void;
}

/** One stop of the flow. Hover, focus and click all select it (same behaviour for keyboard). */
export const StackStop: React.FC<StackStopProps> = ({
	stop,
	index,
	count,
	selected,
	onSelect,
}) => {
	const { t } = useTranslation();
	const n = String(index + 1).padStart(2, "0");
	const used = count === undefined ? "--" : String(count).padStart(2, "0");
	return (
		<Button
			variant="ghost"
			aria-pressed={selected}
			onMouseEnter={onSelect}
			onFocus={onSelect}
			onClick={onSelect}
			className={stopVariants({ selected })}
		>
			<span className="text-xs font-bold tabular-nums opacity-60">{`${n} · ${used}`}</span>
			<span className="text-xl leading-[1.05] font-extrabold tracking-[-0.03em]">
				{t(stop.nameKey)}
			</span>
			<span className="text-[13px] leading-[1.4] font-normal opacity-70">
				{t(stop.descriptionKey)}
			</span>
		</Button>
	);
};

export default StackStop;
