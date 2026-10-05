import React from "react";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";

interface ItemNumberProps {
	/** 1-based position, shown zero-padded ("01"). */
	n: number;
	className?: string;
}

/** Small muted "01" that leads an item of a numbered list. */
export const ItemNumber: React.FC<ItemNumberProps> = ({ n, className }) => {
	return (
		<span
			className={cn(
				"text-[13px] font-semibold text-muted-foreground tabular-nums",
				className,
			)}
		>
			{padCount(n)}
		</span>
	);
};

export default ItemNumber;
