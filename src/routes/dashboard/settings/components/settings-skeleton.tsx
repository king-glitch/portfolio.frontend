import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsSkeletonProps {}

/** Field-sized placeholders in the loaded form's column. */
export const SettingsSkeleton: React.FC<SettingsSkeletonProps> = () => {
	return (
		<div className="flex max-w-3xl flex-col gap-6">
			{Array.from({ length: 5 }, (_, index) => (
				<Skeleton key={index} className="h-14 w-full" />
			))}
		</div>
	);
};

export default SettingsSkeleton;
