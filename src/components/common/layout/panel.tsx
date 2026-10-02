import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PanelTone, PanelWidth } from "@/types/work";

const panelVariants = cva(
	"relative box-border h-full shrink-0 border-r border-border px-[clamp(16px,5vw,80px)] pt-30 pb-18 max-desk:w-screen max-desk:max-w-screen max-desk:min-w-screen max-desk:px-4 max-desk:pt-23 max-desk:pb-20",
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
