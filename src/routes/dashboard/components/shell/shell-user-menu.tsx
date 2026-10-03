// style-lint-ignore-file query-states -- `me` only names the signed-in admin; a failure falls back to a generic label and a dead session redirects to the login
import React from "react";
import {
	RiExternalLinkLine,
	RiLogoutBoxRLine,
	RiUserLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useLogout } from "@/api/hooks/admin/auth/use-logout";
import { useMe } from "@/api/hooks/admin/auth/use-me";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { config } from "@/config";

interface ShellUserMenuProps {}

/** Signed-in admin at the foot of the sidebar: account, back to the site, sign out. */
export const ShellUserMenu: React.FC<ShellUserMenuProps> = () => {
	const { t } = useTranslation();
	const me = useMe();
	const logout = useLogout();
	const name = me.data?.username;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={<SidebarMenuButton size="lg" />}
					>
						<Avatar className="size-8 rounded-lg">
							<AvatarFallback className="rounded-lg">
								{name?.charAt(0).toUpperCase() ?? (
									<RiUserLine />
								)}
							</AvatarFallback>
						</Avatar>
						{me.isPending ? (
							<Skeleton className="h-4 w-24" />
						) : (
							<span className="truncate font-medium">
								{name ?? t("dashboard.user.unknown")}
							</span>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						align="start"
						className="min-w-56"
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel>
								{t("dashboard.user.menu.label")}
							</DropdownMenuLabel>
							<DropdownMenuItem
								render={
									<Link to={config.routes.dashboardAccount} />
								}
							>
								<RiUserLine />
								{t("dashboard.user.menu.account")}
							</DropdownMenuItem>
							<DropdownMenuItem
								render={<Link to={config.routes.home} />}
							>
								<RiExternalLinkLine />
								{t("dashboard.user.menu.site")}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={logout.isPending}
							onClick={() => logout.mutate()}
						>
							{logout.isPending ? (
								<Spinner data-icon="inline-start" />
							) : (
								<RiLogoutBoxRLine />
							)}
							{t("dashboard.user.menu.logout")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export default ShellUserMenu;
