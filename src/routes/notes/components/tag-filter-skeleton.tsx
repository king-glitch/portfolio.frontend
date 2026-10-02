import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const WIDTHS = ["w-12", "w-20", "w-24", "w-16", "w-20"];

interface TagFilterSkeletonProps {
	className?: string;
}

/** Chip row placeholder, same height as the loaded chips. */
export const TagFilterSkeleton: React.FC<TagFilterSkeletonProps> = ({
	className,
}) => {
	return (
		<div
			className={cn(
				"flex max-w-full gap-2 overflow-hidden md:max-w-115 md:flex-wrap md:justify-end",
				className,
			)}
		>
			{WIDTHS.map((width, i) => (
				<Skeleton
					key={i}
					className={cn("h-8 shrink-0 rounded-pill", width)}
				/>
			))}
		</div>
	);
};

export default TagFilterSkeleton;
