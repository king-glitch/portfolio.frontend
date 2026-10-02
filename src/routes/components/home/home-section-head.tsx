import React from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { SectionLabel } from "@/components/common/typography/section-label";

interface HomeSectionHeadProps {
	/** 1-based section number for the eyebrow. */
	index: number;
	/** Translated eyebrow text. */
	label: string;
	title: React.ReactNode;
	/** Right-hand side content (blurb, filters, action). */
	aside?: React.ReactNode;
}

/** Eyebrow + display heading on the left, optional aside on the right. */
export const HomeSectionHead: React.FC<HomeSectionHeadProps> = ({
	index,
	label,
	title,
	aside,
}) => {
	return (
		<div className="flex flex-wrap items-end justify-between gap-6">
			<div>
				<SectionLabel index={index}>{label}</SectionLabel>
				<DisplayHeading className="mt-4">{title}</DisplayHeading>
			</div>
			{aside}
		</div>
	);
};

export default HomeSectionHead;
