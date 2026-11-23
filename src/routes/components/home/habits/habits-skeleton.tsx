import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface HabitsSkeletonProps {}

/** Placeholder rows matching HabitCard height so layout stays steady while loading. */
export const HabitsSkeleton: React.FC<HabitsSkeletonProps> = () => {
	return (
		<>
			{Array.from(
				{ length: config.home.habits.skeletonCount },
				(_, i) => (
					<div
						key={i}
						className="grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-4 border-b py-7 max-desk:grid-cols-1 max-desk:gap-2 desk:gap-8"
					>
						<Skeleton className="h-4 w-12" />
						<div className="flex flex-col gap-2.5">
							<Skeleton className="h-7 w-56" />
							<Skeleton className="h-5 w-full max-w-xl" />
						</div>
					</div>
				),
			)}
		</>
	);
};

export default HabitsSkeleton;
