import React from "react";
import { cn } from "@/lib/utils";

interface HomeTitleProps {
	/** Translated heading lines; with 2+ lines the last one is hollow. */
	lines: string[];
}

/** Stacked display-heading lines with a hollow last line ("How a tap / becomes a thing."). */
export const HomeTitle: React.FC<HomeTitleProps> = ({ lines }) => {
	return (
		<>
			{lines.map((line, i) => (
				<span
					key={line}
					className={cn(
						"block",
						i > 0 && i === lines.length - 1 && "text-outline",
					)}
				>
					{line}
				</span>
			))}
		</>
	);
};

export default HomeTitle;
