import React from "react";
import { cn } from "@/lib/utils";

/** Endpoints of the four strokes of the cross glyph. */
const CROSS = [
	[14, 0, 14, 28],
	[0, 14, 28, 14],
	[4, 4, 24, 24],
	[24, 4, 4, 24],
];

interface MarqueeItemProps {
	children: string;
	/** Applied to the phrase (e.g. the hollow treatment on alternate items). */
	className?: string;
}

/** One marquee phrase followed by the cross glyph. */
export const MarqueeItem: React.FC<MarqueeItemProps> = ({
	children,
	className,
}) => {
	return (
		<span className="inline-flex items-center gap-9 pr-9 text-[clamp(40px,6vw,96px)] leading-none font-extrabold tracking-tighter whitespace-nowrap">
			<span className={cn(className)}>{children}</span>
			<svg
				className="size-7"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
			>
				{CROSS.map(([x1, y1, x2, y2]) => (
					<line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
				))}
			</svg>
		</span>
	);
};

export default MarqueeItem;
