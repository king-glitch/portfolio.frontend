import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PanelTone, PanelWidth } from "@/types/work";

const panelVariants = cva(
	"relative box-border h-full shrink-0 border-r border-border px-[clamp(16px,5vw,80px)] pt-30 pb-18 mob:w-screen mob:max-w-screen mob:min-w-screen mob:px-4 mob:pt-23 mob:pb-20",
	{
		variants: {
			width: {
				[PanelWidth.Full]: "w-screen",
				[PanelWidth.Wide]: "w-[120vw]",
				[PanelWidth.Card]: "w-[min(82vw,1240px)]",
				[PanelWidth.Auto]: "w-auto min-w-[70vw]",
			},
			tone: {
				[PanelTone.Default]: "",
				[PanelTone.Invert]: "bg-foreground text-background",
				[PanelTone.Card]: "bg-card",
			},
		},
		defaultVariants: { width: PanelWidth.Full, tone: PanelTone.Default },
	},
);

interface PanelProps
	extends
		React.ComponentProps<"section">,
		VariantProps<typeof panelVariants> {}

/** One full-height horizontal-scroller panel (`data-panel`; the engine reads its `data-speed` layers). */
export const Panel: React.FC<PanelProps> = ({
	width,
	tone,
	className,
	...props
}) => {
	return (
		<section
			data-panel=""
			className={cn(panelVariants({ width, tone }), className)}
			{...props}
		/>
	);
};

export default Panel;
