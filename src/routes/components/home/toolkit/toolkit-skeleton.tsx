import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface ToolkitSkeletonProps {}

/** Four discipline rows matching the loaded typographic matrix. */
export const ToolkitSkeleton: React.FC<ToolkitSkeletonProps> = () => {
	return (
		<div className="divide-y divide-border border-y">
			{Array.from({ length: config.home.toolkit.groups }, (_, i) => (
				<div
					key={i}
					className="grid gap-6 py-9 desk:grid-cols-[240px_minmax(0,1fr)] desk:gap-12"
				>
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-8" />
						<Skeleton className="h-6 w-36" />
					</div>
					<Skeleton className="h-10 w-full max-w-2xl" />
				</div>
			))}
		</div>
	);
};

export default ToolkitSkeleton;
