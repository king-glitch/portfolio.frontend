import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PostCardSkeletonProps {
	className?: string;
}

/** Same outer box as the teaser PostCard (4:3 cover, meta row, two title lines). */
export const PostCardSkeleton: React.FC<PostCardSkeletonProps> = ({
	className,
}) => {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<Skeleton className="aspect-4/3 w-full rounded-2xl" />
			<Skeleton className="h-3.5 w-1/2" />
			<Skeleton className="h-7 w-5/6" />
		</div>
	);
};

export default PostCardSkeleton;
