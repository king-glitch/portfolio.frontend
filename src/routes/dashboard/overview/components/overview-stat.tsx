import React from "react";
import {
	RiFolderLine,
	RiFolderUploadLine,
	RiImageLine,
	RiStickyNoteLine,
	type RemixiconComponentType,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { OverviewStat as OverviewStatData } from "@/api/hooks/admin/use-overview-stats";
import { StatCard } from "@/routes/dashboard/overview/components/stat-card";
import { StatCardSkeleton } from "@/routes/dashboard/overview/components/stat-card-skeleton";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { DashboardSection } from "@/types/ui";

interface StatSource {
	to: string;
	icon: RemixiconComponentType;
}

/** Where each counted section leads and its icon. */
const SOURCES: Partial<Record<DashboardSection, StatSource>> = {
	[DashboardSection.Projects]: {
		to: config.routes.dashboardProjects,
		icon: RiFolderLine,
	},
	[DashboardSection.Notes]: {
		to: config.routes.dashboardNotes,
		icon: RiStickyNoteLine,
	},
	[DashboardSection.Gallery]: {
		to: config.routes.dashboardGallery,
		icon: RiImageLine,
	},
	[DashboardSection.Files]: {
		to: config.routes.dashboardFiles,
		icon: RiFolderUploadLine,
	},
};

interface OverviewStatProps {
	stat: OverviewStatData;
}

/** One overview card: skeleton while loading, an alert with retry on failure, an empty note at zero, else the figure. */
export const OverviewStat: React.FC<OverviewStatProps> = ({ stat }) => {
	const { t } = useTranslation();
	const source = SOURCES[stat.section];
	if (!source) return null;
	if (stat.isPending) return <StatCardSkeleton />;
	if (stat.isError)
		return (
			<QueryErrorAlert
				onRetry={() => void stat.refetch()}
				error={stat.error}
			/>
		);
	const total = stat.count + (stat.drafts ?? 0);
	if (!total)
		return (
			<QueryEmpty
				titleKey="dashboard.overview.empty.title"
				descriptionKey="dashboard.overview.empty.description"
				action={{
					to: source.to,
					labelKey: "dashboard.overview.empty.action",
				}}
			/>
		);
	return (
		<StatCard
			label={t(`dashboard.nav.items.${stat.section}`)}
			value={`${stat.count}${stat.more ? "+" : ""}`}
			hint={
				stat.drafts
					? t("dashboard.overview.drafts.count", {
							count: stat.drafts,
						})
					: undefined
			}
			to={source.to}
			icon={source.icon}
		/>
	);
};

export default OverviewStat;
