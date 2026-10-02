import React from "react";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { Panel } from "@/components/common/layout/panel";
import { NextProjectCurtain } from "@/routes/projects/[project-id]/components/scroller/next-project-curtain";
import { NextProjectUnderlay } from "@/routes/projects/[project-id]/components/scroller/next-project-underlay";

interface NextProjectProps {
	next?: ProjectSummary;
	vertical: boolean;
	onNext: () => void;
	meterRef: React.Ref<HTMLDivElement>;
	curtainRef: React.Ref<HTMLDivElement>;
}

/**
 * Last panel: the next project's own first panel under a curtain. Pulling past the end slides the
 * curtain left; when it is gone the next page takes over with the same panel in place.
 */
export const NextProject: React.FC<NextProjectProps> = ({
	next,
	...curtain
}) => {
	return (
		<div className="relative h-full w-screen shrink-0 overflow-hidden in-data-[flow=vertical]:h-auto in-data-[flow=vertical]:min-h-svh in-data-[flow=vertical]:w-full">
			{next ? <NextProjectUnderlay id={next.id} /> : <Panel />}
			<NextProjectCurtain next={next} {...curtain} />
		</div>
	);
};

export default NextProject;
