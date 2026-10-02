import React from "react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/common/layout/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { PanelTone } from "@/types/work";

/** Loading shell with the same box as the page: top bar plus three full-height panels (header, quote, mock). */
interface ProjectPageSkeletonProps {}

export const ProjectPageSkeleton: React.FC<ProjectPageSkeletonProps> = () => {
	const { t } = useTranslation();
	return (
		<div
			role="status"
			aria-busy="true"
			aria-label={t("common.loading.title")}
			className="fixed inset-0 overflow-hidden bg-background"
		>
			<div className="absolute inset-x-0 top-0 z-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b border-border bg-background px-[clamp(16px,4vw,56px)] py-5.5">
				<Skeleton className="h-11 w-28 rounded-pill" />
				<Skeleton className="h-4 w-36 max-desk:hidden" />
				<Skeleton className="h-11 w-40 justify-self-end rounded-pill" />
			</div>
			<div className="flex h-full w-max">
				<Panel className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-[4vw] max-desk:grid-cols-1">
					<div className="flex flex-col justify-between gap-8">
						<Skeleton className="h-7 w-2/3" />
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-16 w-full" />
					</div>
					<Skeleton className="min-h-50 rounded-[28px]" />
				</Panel>
				<Panel className="flex w-[min(82vw,1240px)] flex-col justify-center gap-8">
					<Skeleton className="h-14 w-18" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-4 w-40" />
				</Panel>
				<Panel tone={PanelTone.Card} className="flex flex-col gap-6">
					<Skeleton className="h-4 w-56" />
					<Skeleton className="min-h-0 grow rounded-3xl" />
				</Panel>
			</div>
		</div>
	);
};

export default ProjectPageSkeleton;
