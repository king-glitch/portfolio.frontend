import React from "react";
import {
	RiFolderLine,
	RiImageLine,
	RiPriceTag3Line,
	type RemixiconComponentType,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFrame } from "@/api/types/admin/gallery";
import { Card, CardContent } from "@/components/ui/card";

interface GalleryMetricsProps {
	frames: AdminFrame[];
}

interface MetricSummary {
	id: string;
	label: string;
	value: number;
	icon: RemixiconComponentType;
}

/** Gallery overview ribbon: total frames, linked project count and unique tags count. */
export const GalleryMetrics: React.FC<GalleryMetricsProps> = ({ frames }) => {
	const { t } = useTranslation();

	const totalFrames = frames.length;
	const linkedProjectsCount = new Set(
		frames
			.map((frame) => frame.project?.id)
			.filter((id): id is string => Boolean(id)),
	).size;

	const uniqueTagsCount = new Set(frames.flatMap((frame) => frame.tags)).size;

	const items: MetricSummary[] = [
		{
			id: "frames",
			label: t("dashboard.gallery.metrics.total"),
			value: totalFrames,
			icon: RiImageLine,
		},
		{
			id: "projects",
			label: t("dashboard.gallery.metrics.projects"),
			value: linkedProjectsCount,
			icon: RiFolderLine,
		},
		{
			id: "tags",
			label: t("dashboard.gallery.metrics.tags"),
			value: uniqueTagsCount,
			icon: RiPriceTag3Line,
		},
	];

	return (
		<Card size="sm" className="mb-6 overflow-hidden">
			<CardContent className="p-4">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{items.map((item) => {
						const Icon = item.icon;
						return (
							<div
								key={item.id}
								className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3"
							>
								<div className="flex items-center justify-between gap-2 text-muted-foreground">
									<span className="truncate text-xs font-medium">
										{item.label}
									</span>
									<Icon className="size-4 shrink-0" />
								</div>
								<span className="pt-1 text-2xl font-semibold tracking-tight">
									{item.value}
								</span>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
};

export default GalleryMetrics;
