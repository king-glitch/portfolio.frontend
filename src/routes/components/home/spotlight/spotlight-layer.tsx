import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { SectionLabel } from "@/components/common/typography/section-label";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { cn } from "@/lib/utils";
import { SpotlightSide } from "@/types/home";

const layerVariants = cva(
	"absolute inset-0 flex flex-col justify-between px-[clamp(16px,4vw,48px)] py-[clamp(48px,7vw,96px)]",
	{
		variants: {
			side: {
				[SpotlightSide.See]: "",
				[SpotlightSide.Reveal]:
					"bg-foreground text-background [clip-path:circle(0px_at_50%_50%)]",
			},
		},
	},
);

const outlineVariants = cva("", {
	variants: {
		side: {
			[SpotlightSide.See]: "text-outline",
			[SpotlightSide.Reveal]: "text-outline-inverse",
		},
	},
});

const LINES = ["1", "2", "3"] as const;

interface SpotlightLayerProps {
	side: SpotlightSide;
	/** The reveal layer is driven by `useSpotlight` through this ref. */
	ref?: React.Ref<HTMLDivElement>;
}

/** One of the two stacked layers: "What you see" (visible) or "What I see" (clipped to the cursor circle). */
export const SpotlightLayer: React.FC<SpotlightLayerProps> = ({
	side,
	ref,
}) => {
	const { t } = useTranslation();
	const reveal = side === SpotlightSide.Reveal;
	return (
		<div
			ref={ref}
			aria-hidden={reveal ? true : undefined}
			className={layerVariants({ side })}
		>
			<SectionLabel
				index={2}
				className={cn(reveal && "text-inherit opacity-60")}
			>
				{t(`home.spotlight.${side}.eyebrow`)}
			</SectionLabel>
			<DisplayHeading render={<p />} className="leading-[0.92]">
				{LINES.map((n) => (
					<span
						key={n}
						className={cn(
							"block",
							n === "2" && outlineVariants({ side }),
						)}
					>
						{t(`home.spotlight.${side}.lines.${n}`)}
					</span>
				))}
			</DisplayHeading>
			<span
				className={cn(
					"text-sm text-muted-foreground",
					reveal && "text-inherit opacity-60",
				)}
			>
				{t(`home.spotlight.${side}.hint`)}
			</span>
		</div>
	);
};

export default SpotlightLayer;
