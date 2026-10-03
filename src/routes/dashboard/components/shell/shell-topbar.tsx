import React from "react";
import { RiExternalLinkLine, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { config } from "@/config";
import { useTheme } from "@/hooks/use-theme";
import { ShellBreadcrumbs } from "@/routes/dashboard/components/shell/shell-breadcrumbs";
import { Theme } from "@/types/ui";

interface ShellTopbarProps {}

/** Top bar: sidebar toggle, where you are, theme switch, link back to the site. */
export const ShellTopbar: React.FC<ShellTopbarProps> = () => {
	const { t } = useTranslation();
	const { theme, toggle } = useTheme();
	const ThemeIcon = theme === Theme.Dark ? RiSunLine : RiMoonLine;
	return (
		<header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
			<SidebarTrigger />
			<Separator orientation="vertical" className="mr-2 h-4" />
			<ShellBreadcrumbs />
			<div className="ml-auto flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					aria-label={t("dashboard.topbar.theme.aria-label")}
					onClick={() => toggle()}
				>
					<ThemeIcon />
				</Button>
				<Button
					variant="outline"
					nativeButton={false}
					render={<Link to={config.routes.home} />}
				>
					{t("dashboard.topbar.site")}
					<RiExternalLinkLine data-icon="inline-end" />
				</Button>
			</div>
		</header>
	);
};

export default ShellTopbar;
