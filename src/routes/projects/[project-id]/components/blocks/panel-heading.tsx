import React from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";
import { DisplayVariant } from "@/types/ui";
import { Eyebrow } from "@/components/common/typography/eyebrow";

interface PanelHeadingProps {
	index: number;
	children: string;
	variant?: DisplayVariant;
	className?: string;
}

/** "(01)" plus a big section title. */
export const PanelHeading: React.FC<PanelHeadingProps> = ({
	index,
	children,
	variant = DisplayVariant.PanelSm,
	className,
}) => {
	return (
		<div className={cn("flex flex-wrap items-baseline gap-5", className)}>
			<Eyebrow>({padCount(index)})</Eyebrow>
			<DisplayHeading variant={variant}>{children}</DisplayHeading>
		</div>
	);
};

export default PanelHeading;
