import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BubbleSide } from "@/types/ui";

const tailVariants = cva("absolute size-3 rotate-45 bg-foreground", {
	variants: {
		side: {
			[BubbleSide.Left]: "top-1/2 -left-1 -translate-y-1/2",
			[BubbleSide.Right]: "top-1/2 -right-1 -translate-y-1/2",
			[BubbleSide.Top]: "-top-1 right-6",
		},
	},
});

interface MascotBubbleProps {
	children: string;
	/** Side of the tail (it points at the mascot). */
	side: BubbleSide;
	className?: string;
}

/** Speech bubble next to a mascot. Keyed by its text, so each new line pops in. */
export const MascotBubble: React.FC<MascotBubbleProps> = ({
	children,
	side,
	className,
}) => {
	return (
		<span
			key={children}
			role="status"
			className={cn(
				"relative inline-block rounded-pill bg-foreground px-4 py-2 text-sm leading-normal font-bold tracking-normal whitespace-nowrap text-background normal-case shadow-[0_14px_30px_-12px_rgb(0_0_0/0.5)] transition-[scale,opacity] duration-300 ease-(--ease-out-expo) starting:scale-50 starting:opacity-0",
				className,
			)}
		>
			{children}
			<span aria-hidden="true" className={tailVariants({ side })} />
		</span>
	);
};

export default MascotBubble;
