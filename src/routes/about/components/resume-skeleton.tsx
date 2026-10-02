import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MAIN_BLOCKS = ["summary", "experience", "projects"];
const ASIDE_BLOCKS = ["a", "b", "c", "d", "e"];

interface ResumeSkeletonProps {}

/** A4-ratio sheet with the same two columns as the resume. */
export const ResumeSkeleton: React.FC<ResumeSkeletonProps> = () => {
	return (
		<div
			aria-hidden="true"
			className="px-[clamp(12px,4vw,40px)] pt-28 pb-30"
		>
			<div className="mx-auto flex aspect-210/297 max-w-220 flex-col gap-6 rounded-[20px] bg-card p-[clamp(24px,5vw,56px)] ring-1 ring-border">
				<Skeleton className="h-14 w-2/3" />
				<div className="grid flex-1 grid-cols-1 gap-9 sm:grid-cols-[minmax(0,1fr)_220px]">
					<div className="flex flex-col gap-6">
						{MAIN_BLOCKS.map((block) => (
							<Skeleton
								key={block}
								className="size-full max-h-48"
							/>
						))}
					</div>
					<div className="hidden flex-col gap-5 sm:flex">
						{ASIDE_BLOCKS.map((block) => (
							<Skeleton key={block} className="h-16 w-full" />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResumeSkeleton;
