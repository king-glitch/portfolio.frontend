import React from "react";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import type { StackStop as StackStopModel } from "@/api/types/portfolio/project";

const stopVariants = cva(
	"group/stop flex h-auto w-full items-baseline justify-between gap-4 rounded-none border-0 border-b border-border bg-transparent px-1 py-6 text-left whitespace-normal transition-colors duration-200 hover:bg-transparent dark:hover:bg-transparent",
	{
		variants: {
			selected: {
				true: "border-foreground text-foreground hover:text-foreground",
				false: "text-muted-foreground hover:text-foreground",
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
	/** Pointer hover; omitted while the section is scroll-pinned so hovering never scrolls the page. */
	onHover?: () => void;
}

/** One interactive layer row in the split-stage inspector. */
export const StackStop: React.FC<StackStopProps> = ({
	stop,
	index,
	count,
	selected,
	onSelect,
	onHover,
}) => {
	const n = String(index + 1).padStart(2, "0");
	const used = count === undefined ? "--" : String(count).padStart(2, "0");
	return (
		<Button
			variant="ghost"
			aria-pressed={selected}
			onMouseEnter={onHover}
			onFocus={onSelect}
			onClick={onSelect}
			className={stopVariants({ selected })}
		>
			<span className="flex min-w-0 items-baseline gap-5">
				<span className="font-mono text-xs font-medium tabular-nums opacity-60">
					{n}
				</span>
				<span className="text-[clamp(20px,1.9vw,28px)] leading-tight font-semibold tracking-tight transition-transform duration-300 ease-(--ease-out-expo) group-hover/stop:translate-x-1.5">
					{stop.name}
				</span>
			</span>
			<span className="inline-flex shrink-0 items-center gap-3 font-mono text-xs tabular-nums">
				<span className="opacity-55">{used}</span>
				<span
					aria-hidden="true"
					className={
						selected
							? "translate-x-0 opacity-100 transition-all duration-300"
							: "-translate-x-1.5 opacity-0 transition-all duration-300 group-hover/stop:translate-x-0 group-hover/stop:opacity-60"
					}
				>
					→
				</span>
			</span>
		</Button>
	);
};

export default StackStop;
