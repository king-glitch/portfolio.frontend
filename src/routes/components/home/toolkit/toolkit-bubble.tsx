import React from "react";
import { cva } from "class-variance-authority";
import { BubbleGroup } from "@/types/home";

const bubbleVariants = cva(
	"box-border flex items-center justify-center rounded-full p-2 text-center leading-[1.05] font-bold tracking-[-0.02em] select-none",
	{
		variants: {
			group: {
				[BubbleGroup.Solid]:
					"bg-foreground text-background shadow-[inset_0_0_0_1px_var(--border)]",
				[BubbleGroup.Outline]:
					"bg-background text-foreground shadow-[inset_0_0_0_1px_var(--border)]",
				[BubbleGroup.Muted]:
					"bg-muted text-foreground shadow-[inset_0_0_0_1px_var(--border)]",
				[BubbleGroup.Ringed]:
					"bg-transparent text-foreground shadow-[inset_0_0_0_1.5px_var(--foreground)]",
			},
			physics: {
				true: "absolute top-0 left-0 cursor-grab touch-none will-change-transform active:cursor-grabbing",
				false: "",
			},
		},
	},
);

interface ToolkitBubbleProps {
	label: string;
	group: BubbleGroup;
	diameter: number;
	fontSize: number;
	physics: boolean;
}

/** One draggable skill bubble. `data-ball` is the hook the physics engine queries. */
export const ToolkitBubble: React.FC<ToolkitBubbleProps> = ({
	label,
	group,
	diameter,
	fontSize,
	physics,
}) => {
	return (
		<div
			data-ball=""
			style={{
				width: diameter,
				height: diameter,
				fontSize,
				// the engine owns `transform` afterwards; park the bubble off-box until it drops
				transform: physics ? "translate3d(-999px,-999px,0)" : undefined,
			}}
			className={bubbleVariants({ group, physics })}
		>
			{label}
		</div>
	);
};

export default ToolkitBubble;
