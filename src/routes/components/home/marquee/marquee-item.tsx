import React from "react";
import { cn } from "@/lib/utils";

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
		<span className="inline-flex items-center gap-9 pr-9 text-[clamp(40px,6vw,96px)] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap">
			<span className={cn(className)}>{children}</span>
			<svg
				className="size-7"
				viewBox="0 0 28 28"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
			>
				<line x1="14" y1="0" x2="14" y2="28" />
				<line x1="0" y1="14" x2="28" y2="14" />
				<line x1="4" y1="4" x2="24" y2="24" />
				<line x1="24" y1="4" x2="4" y2="24" />
			</svg>
		</span>
	);
};

export default MarqueeItem;
