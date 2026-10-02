import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { Mascot } from "@/components/common/mascot/mascot";
import { MascotBubble } from "@/components/common/mascot/mascot-bubble";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BubbleSide, MascotDesign, type MascotOptions } from "@/types/ui";

/** Bubble placement by tail side (tail Left = bubble right of the head); absolute, so text never reflows. */
const bubbleVariants = cva("pointer-events-none absolute z-10 flex", {
	variants: {
		side: {
			[BubbleSide.Left]: "top-1/2 left-full ml-3 -translate-y-1/2",
			[BubbleSide.Right]: "top-1/2 right-full mr-3 -translate-y-1/2",
			[BubbleSide.Top]: "top-full right-0 mt-3",
		},
	},
});

interface MascotBuddyProps {
	/** Lines it says, one per click, in order (already translated). */
	quips: string[];
	label: string;
	design?: MascotDesign;
	options?: Partial<MascotOptions>;
	/** Side of the bubble's tail (it points at the head). */
	side?: BubbleSide;
	/** Show the first line before any click. */
	greet?: boolean;
	/** Head size (on the wrapper, so `em` sizes follow the surrounding text). */
	className?: string;
}

/** Mascot plus speech bubble: each click squashes it (engine) and says the next line. */
export const MascotBuddy: React.FC<MascotBuddyProps> = ({
	quips,
	label,
	design = MascotDesign.Brackets,
	options,
	side = BubbleSide.Left,
	greet = false,
	className,
}) => {
	const [line, setLine] = useState(greet ? 0 : -1);
	const quip = quips[line];
	return (
		<span
			className={cn(
				"relative inline-flex align-middle leading-none",
				className,
			)}
		>
			<Button
				variant="ghost"
				aria-label={label}
				onClick={() => setLine((i) => (i + 1) % quips.length)}
				className="h-auto w-full rounded-full p-0 hover:bg-transparent dark:hover:bg-transparent"
			>
				<Mascot
					design={design}
					options={options}
					className="size-full"
				/>
			</Button>
			{quip ? (
				<span className={bubbleVariants({ side })}>
					<MascotBubble side={side}>{quip}</MascotBubble>
				</span>
			) : null}
		</span>
	);
};

export default MascotBuddy;
