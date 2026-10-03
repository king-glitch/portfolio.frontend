import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { useSettings } from "@/api/hooks/admin/settings/use-settings";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import i18n from "@/lib/i18n";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { SettingsSkeleton } from "@/routes/dashboard/settings/components/settings-skeleton";
import { SettingsTabs } from "@/routes/dashboard/settings/components/settings-tabs";

export function meta() {
	return [{ title: i18n.t("dashboard.settings.meta.title") }];
}

interface SettingsLayoutProps {}

/** Shared shell of the settings tabs: header, tab bar and the settings query's loading, error and empty states. */
const SettingsLayout: React.FC<SettingsLayoutProps> = () => {
	const { t } = useTranslation();
	const settings = useSettings();

	const renderBody = () => {
		if (settings.isPending) return <SettingsSkeleton />;
		if (settings.isError)
			return (
				<QueryErrorAlert
					onRetry={() => void settings.refetch()}
					error={settings.error}
				/>
			);
		if (!settings.data.length)
			return <QueryEmpty titleKey="dashboard.settings.empty.title" />;
		return <Outlet />;
	};

	return (
		<>
			<PageHeader
				title={t("dashboard.settings.title")}
				description={t("dashboard.settings.description")}
			/>
			<div className="flex flex-col gap-6">
				<SettingsTabs />
				{renderBody()}
			</div>
		</>
	);
};

export default SettingsLayout;
