import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardSkeletonProps {}

/** Placeholder with the outer size and layout of `StatCard`. */
export const StatCardSkeleton: React.FC<StatCardSkeletonProps> = () => {
	return (
		<Card className="h-32 justify-between">
			<CardHeader>
				<Skeleton className="h-4 w-24" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-9 w-16" />
			</CardContent>
		</Card>
	);
};

export default StatCardSkeleton;
