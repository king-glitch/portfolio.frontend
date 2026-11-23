import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineSkeletonProps {}

/** Ruler line, three bars and the detail block matching the open editorial timeline. */
export const TimelineSkeleton: React.FC<TimelineSkeletonProps> = () => {
	return (
		<>
			<Skeleton className="h-8 w-full" />
			<div className="divide-y divide-border/50 border-b">
				{[0, 1, 2].map((i) => (
					<div key={i} className="flex h-14 items-center">
						<Skeleton
							className="h-10 rounded-sm"
							style={{ marginLeft: `${i * 12}%`, width: "55%" }}
						/>
					</div>
				))}
			</div>
			<div className="mt-10 grid gap-8 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] desk:gap-16">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
		</>
	);
};

export default TimelineSkeleton;
