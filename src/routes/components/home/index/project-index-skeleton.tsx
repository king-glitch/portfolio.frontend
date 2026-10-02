import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface ProjectIndexSkeletonProps {}

/** Six rows with the loaded row's height (name line + 2 x 30px padding + border), no layout shift. */
export const ProjectIndexSkeleton: React.FC<ProjectIndexSkeletonProps> = () => {
	return (
		<>
			{Array.from({ length: config.home.index.skeletonRows }, (_, i) => (
				<div
					key={i}
					className="flex h-[calc(clamp(26px,3.6vw,56px)+61px)] items-center gap-6 border-b px-1"
				>
					<Skeleton className="h-3.5 w-12 shrink-0" />
					<Skeleton className="h-[clamp(26px,3.6vw,56px)] w-1/2" />
					<Skeleton className="ml-auto h-3.5 w-1/4 max-desk:hidden" />
				</div>
			))}
		</>
	);
};

export default ProjectIndexSkeleton;
