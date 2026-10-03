import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectFormSkeletonProps {}

/** Same outer size as the project form: two columns of fields, a tall JSON box, the buttons. */
export const ProjectFormSkeleton: React.FC<ProjectFormSkeletonProps> = () => {
	return (
		<div className="flex max-w-3xl flex-col gap-6">
			<div className="grid gap-6 md:grid-cols-2">
				{Array.from({ length: 5 }, (_, index) => (
					<Skeleton key={index} className="h-14 w-full" />
				))}
			</div>
			<Skeleton className="h-14 w-full" />
			<Skeleton className="h-14 w-full" />
			<Skeleton className="h-28 w-full" />
			<Skeleton className="h-96 w-full" />
			<Skeleton className="h-8 w-40" />
		</div>
	);
};

export default ProjectFormSkeleton;
