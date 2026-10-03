import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
	rows?: number;
}

/** Placeholder rows of a dashboard table: same row height as the loaded list. */
export const ListSkeleton: React.FC<ListSkeletonProps> = ({ rows = 6 }) => {
	return (
		<div className="flex flex-col gap-2">
			{Array.from({ length: rows }, (_, index) => (
				<Skeleton key={index} className="h-12 w-full" />
			))}
		</div>
	);
};

export default ListSkeleton;
