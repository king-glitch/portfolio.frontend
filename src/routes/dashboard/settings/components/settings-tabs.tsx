import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from "@/config";
import { SettingsTab } from "@/types/ui";

interface SettingsTabsProps {}

/** Tab bar driven by the URL: each tab is a route, so refresh and shared links land on it. */
export const SettingsTabs: React.FC<SettingsTabsProps> = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const current = Object.values(SettingsTab).find(
		(tab) => pathname === `${config.routes.dashboardSettings}/${tab}`,
	);
	return (
		<Tabs value={current ?? SettingsTab.General}>
			<TabsList>
				{Object.values(SettingsTab).map((tab) => (
					<TabsTrigger
						key={tab}
						value={tab}
						nativeButton={false}
						render={
							<Link
								to={`${config.routes.dashboardSettings}/${tab}`}
							/>
						}
					>
						{t(`dashboard.settings.tabs.${tab}`)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
};

export default SettingsTabs;
