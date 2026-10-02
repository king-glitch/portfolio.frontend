import React from "react";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { NextProjectCover } from "@/routes/projects/[project-id]/components/scroller/next-project-cover";
import { NextProjectHead } from "@/routes/projects/[project-id]/components/scroller/next-project-head";

interface NextProjectProps {
	next?: ProjectSummary;
	vertical: boolean;
	onNext: () => void;
	nextRef: React.Ref<HTMLDivElement>;
}

/**
 * End of the track: a dark cover announcing the next project, then (desktop) the next project's
 * own first panel just past the end, which the scroller pushes in from the right.
 */
export const NextProject: React.FC<NextProjectProps> = ({
	next,
	vertical,
	onNext,
	nextRef,
}) => {
	return (
		<>
			<NextProjectCover next={next} vertical={vertical} onNext={onNext} />
			{next && !vertical ? (
				<div
					ref={nextRef}
					aria-hidden="true"
					inert
					className="relative h-full w-screen shrink-0 overflow-hidden"
				>
					<NextProjectHead id={next.id} />
				</div>
			) : null}
		</>
	);
};

export default NextProject;
