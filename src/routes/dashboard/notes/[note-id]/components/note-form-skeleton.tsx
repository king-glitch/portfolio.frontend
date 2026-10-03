import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteFormSkeletonProps {}

/** Same outer size as the note form. */
export const NoteFormSkeleton: React.FC<NoteFormSkeletonProps> = () => {
	return (
		<div className="flex max-w-3xl flex-col gap-6">
			<Skeleton className="h-14 w-full" />
			<div className="grid gap-6 md:grid-cols-2">
				{Array.from({ length: 4 }, (_, index) => (
					<Skeleton key={index} className="h-14 w-full" />
				))}
			</div>
			<Skeleton className="h-14 w-full" />
			<Skeleton className="h-24 w-full" />
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-96 w-full" />
			<Skeleton className="h-8 w-40" />
		</div>
	);
};

export default NoteFormSkeleton;
