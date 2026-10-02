import React from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";
import { DisplayVariant } from "@/types/ui";
import { PanelLabel } from "@/routes/work/[project-id]/components/blocks/panel-label";

interface PanelHeadingProps {
	index: number;
	children: string;
	variant?: DisplayVariant;
	className?: string;
}

/** "(01)" plus a big section title; the row drifts slower than the track (`data-speed`). */
export const PanelHeading: React.FC<PanelHeadingProps> = ({
	index,
	children,
	variant = DisplayVariant.PanelSm,
	className,
}) => {
	return (
		<div
			data-speed="0.88"
			className={cn("flex flex-wrap items-baseline gap-5", className)}
		>
			<PanelLabel>({padCount(index)})</PanelLabel>
			<DisplayHeading variant={variant}>{children}</DisplayHeading>
		</div>
	);
};

export default PanelHeading;
