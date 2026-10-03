import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FileSelectSkeletonProps {
	count?: number;
}

/** Placeholder rows with the loaded option's thumbnail and two text lines. */
export const FileSelectSkeleton: React.FC<FileSelectSkeletonProps> = ({
	count = 4,
}) => {
	return (
		<div className="flex flex-col gap-2 p-2" aria-hidden>
			{Array.from({ length: count }, (_, index) => (
				<div key={index} className="flex items-center gap-2">
					<Skeleton className="size-8 rounded-sm" />
					<div className="flex flex-1 flex-col gap-1">
						<Skeleton className="h-3 w-2/3" />
						<Skeleton className="h-3 w-1/4" />
					</div>
				</div>
			))}
		</div>
	);
};

export default FileSelectSkeleton;
