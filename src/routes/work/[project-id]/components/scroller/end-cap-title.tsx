import React from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Skeleton } from "@/components/ui/skeleton";

interface EndCapTitleProps {
	/** Next project's name; undefined while the project list loads. */
	name?: string;
	/** The scroller writes `clip-path` here: the filled title wipes in left to right. */
	fillRef: React.Ref<HTMLDivElement>;
}

/** Outlined next-project title with a solid copy clipped over it. */
export const EndCapTitle: React.FC<EndCapTitleProps> = ({ name, fillRef }) => {
	if (name === undefined)
		return <Skeleton className="h-[clamp(56px,11vw,210px)] w-3/4" />;
	return (
		<div className="relative">
			<DisplayHeading className="text-[clamp(56px,11vw,210px)] leading-[0.88] text-outline">
				{name}
			</DisplayHeading>
			<DisplayHeading
				ref={fillRef}
				render={<div aria-hidden="true" />}
				className="absolute inset-0 text-[clamp(56px,11vw,210px)] leading-[0.88] text-foreground"
				style={{ clipPath: "inset(0 100% 0 0)" }}
			>
				{name}
			</DisplayHeading>
		</div>
	);
};

export default EndCapTitle;
