import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineSkeletonProps {}

/** Ruler line, three bars and the detail block, same boxes as the loaded timeline. */
export const TimelineSkeleton: React.FC<TimelineSkeletonProps> = () => {
	return (
		<>
			<Skeleton className="h-7 w-full" />
			<div className="mt-4.5 flex flex-col gap-2.5">
				{[0, 1, 2].map((i) => (
					<Skeleton
						key={i}
						className="h-14 rounded-pill"
						style={{ marginLeft: `${i * 12}%`, width: "55%" }}
					/>
				))}
			</div>
			<div className="mt-12 grid gap-12 border-t pt-8 desk:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-24 w-full" />
			</div>
		</>
	);
};

export default TimelineSkeleton;
