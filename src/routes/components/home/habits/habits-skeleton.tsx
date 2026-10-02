import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface HabitsSkeletonProps {
	pinned: boolean;
}

/** Same card boxes as HabitCard so the pinned height does not change when data arrives. */
export const HabitsSkeleton: React.FC<HabitsSkeletonProps> = ({ pinned }) => {
	return (
		<>
			{Array.from(
				{ length: config.home.habits.skeletonCount },
				(_, i) => (
					<Skeleton
						key={i}
						className={
							pinned
								? "h-[min(68vh,600px)] w-[min(440px,82vw)] shrink-0 rounded-[28px]"
								: "min-h-80 w-full rounded-[28px]"
						}
					/>
				),
			)}
		</>
	);
};

export default HabitsSkeleton;
