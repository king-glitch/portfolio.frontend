import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = ["1", "2", "3", "4", "5"];

interface StackFlowSkeletonProps {}

/** Stop list + stage placeholders at the loaded layout's size (five 83px rows beside a 384px stage). */
export const StackFlowSkeleton: React.FC<StackFlowSkeletonProps> = () => (
	<div className="grid gap-10 desk:grid-cols-12 desk:gap-12">
		<div className="flex flex-col border-t pl-7 desk:col-span-5">
			{ROWS.map((row) => (
				<div key={row} className="border-b py-6">
					<Skeleton className="h-8 w-1/2" />
				</div>
			))}
		</div>
		<Skeleton className="min-h-96 rounded-none desk:col-span-7" />
	</div>
);

export default StackFlowSkeleton;
