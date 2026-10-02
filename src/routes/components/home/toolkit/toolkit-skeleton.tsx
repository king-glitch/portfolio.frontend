import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface ToolkitSkeletonProps {}

/** Circles in a wrapped grid inside the play box; no physics until data arrives. */
export const ToolkitSkeleton: React.FC<ToolkitSkeletonProps> = () => {
	return (
		<div className="flex flex-wrap content-start gap-3 p-6 pt-14">
			{Array.from(
				{ length: config.home.toolkit.skeletonCount },
				(_, i) => (
					<Skeleton
						key={i}
						className="rounded-full"
						style={{
							width: 84 + (i % 4) * 22,
							height: 84 + (i % 4) * 22,
						}}
					/>
				),
			)}
		</div>
	);
};

export default ToolkitSkeleton;
