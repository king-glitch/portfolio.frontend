import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedPostSkeletonProps {
	className?: string;
}

/** Same grid and cover box as FeaturedPost. */
export const FeaturedPostSkeleton: React.FC<FeaturedPostSkeletonProps> = ({
	className,
}) => {
	return (
		<div
			className={cn(
				"grid items-end gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-[4vw]",
				className,
			)}
		>
			<Skeleton className="aspect-4/3 w-full rounded-[28px]" />
			<div className="flex flex-col gap-5 pb-2">
				<Skeleton className="h-3.5 w-1/2" />
				<Skeleton className="h-16 w-full" />
				<Skeleton className="h-14 w-5/6" />
				<Skeleton className="h-4 w-28" />
			</div>
		</div>
	);
};

export default FeaturedPostSkeleton;
