import React from "react";
import type { MotifKind } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { cn } from "@/lib/utils";

interface ArtFrameProps extends React.ComponentProps<"div"> {
	kind: MotifKind;
}

/** Rounded, outlined box holding a project motif. */
export const ArtFrame: React.FC<ArtFrameProps> = ({
	kind,
	className,
	children,
	...props
}) => {
	return (
		<div
			className={cn(
				"relative min-h-55 overflow-hidden rounded-[28px] ring-1 ring-border",
				className,
			)}
			{...props}
		>
			<ProjectMotif kind={kind} />
			{children}
		</div>
	);
};

export default ArtFrame;
