// style-lint-ignore-file query-states -- each card (OverviewStat) renders its own loading, error and empty state

import React from "react";
import { useTranslation } from "react-i18next";
import { useOverviewStats } from "@/api/hooks/admin/use-overview-stats";
import i18n from "@/lib/i18n";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { OverviewStat } from "@/routes/dashboard/overview/components/overview-stat";

export function meta() {
	return [{ title: i18n.t("dashboard.overview.meta.title") }];
}

interface OverviewProps {}

/** Landing page of the dashboard: how much of each kind of content exists. */
const Overview: React.FC<OverviewProps> = () => {
	const { t } = useTranslation();
	const stats = useOverviewStats();
	return (
		<>
			<PageHeader
				title={t("dashboard.overview.title")}
				description={t("dashboard.overview.description")}
			/>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<OverviewStat key={stat.section} stat={stat} />
				))}
			</div>
		</>
	);
};

export default Overview;
