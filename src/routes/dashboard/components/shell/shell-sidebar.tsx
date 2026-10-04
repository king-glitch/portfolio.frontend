// style-lint-ignore-file query-states -- the counts are decoration on the nav items; they appear once the lists load

import React from "react";
import {
	RiDashboardLine,
	RiFolderLine,
	RiFolderUploadLine,
	RiImageLine,
	RiSettings3Line,
	RiStickyNoteLine,
	RiUserLine,
	type RemixiconComponentType,
} from "@remixicon/react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { useOverviewStats } from "@/api/hooks/admin/use-overview-stats";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { config } from "@/config";
import { ShellUserMenu } from "@/routes/dashboard/components/shell/shell-user-menu";
import { DashboardSection } from "@/types/ui";

interface NavItem {
	section: DashboardSection;
	to: string;
	icon: RemixiconComponentType;
}

interface NavGroup {
	id: string;
	labelKey: ParseKeys;
	items: NavItem[];
}

const groups: NavGroup[] = [
	{
		id: "content",
		labelKey: "dashboard.nav.groups.content",
		items: [
			{
				section: DashboardSection.Overview,
				to: config.routes.dashboardOverview,
				icon: RiDashboardLine,
			},
			{
				section: DashboardSection.Projects,
				to: config.routes.dashboardProjects,
				icon: RiFolderLine,
			},
			{
				section: DashboardSection.Notes,
				to: config.routes.dashboardNotes,
				icon: RiStickyNoteLine,
			},
			{
				section: DashboardSection.Gallery,
				to: config.routes.dashboardGallery,
				icon: RiImageLine,
			},
			{
				section: DashboardSection.Files,
				to: config.routes.dashboardFiles,
				icon: RiFolderUploadLine,
			},
		],
	},
	{
		id: "site",
		labelKey: "dashboard.nav.groups.site",
		items: [
			{
				section: DashboardSection.Settings,
				to: config.routes.dashboardSettings,
				icon: RiSettings3Line,
			},
			{
				section: DashboardSection.Account,
				to: config.routes.dashboardAccount,
				icon: RiUserLine,
			},
		],
	},
];

interface ShellSidebarProps {}

/** Left navigation: one link per dashboard section, active from the current path. Collapses to icons. */
export const ShellSidebar: React.FC<ShellSidebarProps> = () => {
	const { t } = useTranslation();
	const { pathname } = useLocation();
	const stats = useOverviewStats();
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							render={
								<Link
									to={config.routes.dashboard}
									viewTransition
								/>
							}
						>
							<span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
								{t("dashboard.nav.logo")}
							</span>
							<span className="truncate font-semibold">
								{t("dashboard.brand")}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{groups.map((group) => (
					<SidebarGroup key={group.id}>
						<SidebarGroupLabel>
							{t(group.labelKey)}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map(
									({ section, to, icon: Icon }) => {
										const stat = stats.find(
											(item) => item.section === section,
										);
										const ready =
											stat &&
											!stat.isPending &&
											!stat.isError;
										return (
											<SidebarMenuItem key={section}>
												<SidebarMenuButton
													isActive={pathname.startsWith(
														to,
													)}
													tooltip={t(
														`dashboard.nav.items.${section}`,
													)}
													render={
														<Link
															to={to}
															viewTransition
														/>
													}
												>
													<Icon />
													<span>
														{t(
															`dashboard.nav.items.${section}`,
														)}
													</span>
												</SidebarMenuButton>
												{ready ? (
													<SidebarMenuBadge>
														{stat.count +
															(stat.drafts ?? 0)}
														{stat.more ? "+" : null}
													</SidebarMenuBadge>
												) : null}
											</SidebarMenuItem>
										);
									},
								)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				<ShellUserMenu />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};

export default ShellSidebar;
