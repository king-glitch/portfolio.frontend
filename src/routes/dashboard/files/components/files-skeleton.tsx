import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FilesSkeletonProps {
	count?: number;
}

/** Card-sized placeholders in the loaded grid's columns. */
export const FilesSkeleton: React.FC<FilesSkeletonProps> = ({ count = 8 }) => {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: count }, (_, index) => (
				<Skeleton key={index} className="h-60 w-full" />
			))}
		</div>
	);
};

export default FilesSkeleton;
