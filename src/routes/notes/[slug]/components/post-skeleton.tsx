import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LINES = [
	"w-full",
	"w-11/12",
	"w-full",
	"w-10/12",
	"w-full",
	"w-9/12",
	"w-full",
	"w-8/12",
];

/** Header, 8 text lines and a code block, same column widths as the loaded post. */
interface PostSkeletonProps {}

export const PostSkeleton: React.FC<PostSkeletonProps> = () => {
	return (
		<div className="px-[clamp(16px,4vw,48px)] pt-18 pb-24">
			<div className="mx-auto max-w-275">
				<Skeleton className="h-7 w-40 rounded-pill" />
				<Skeleton className="mt-7 h-28 w-full" />
				<Skeleton className="mt-7 h-4 w-72" />
				<Skeleton className="mt-14 aspect-21/9 w-full rounded-[28px]" />
			</div>
			<div className="mx-auto mt-18 flex max-w-180 flex-col gap-4">
				{LINES.map((width, i) => (
					<Skeleton key={i} className={`h-5 ${width}`} />
				))}
				<Skeleton className="my-2 h-48 w-full rounded-[22px]" />
			</div>
		</div>
	);
};

export default PostSkeleton;
