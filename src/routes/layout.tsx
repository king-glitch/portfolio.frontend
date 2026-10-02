import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Preloader } from "@/components/shared/shell/preloader";
import { SiteMenu } from "@/components/shared/shell/site-menu";
import { SiteNav } from "@/components/shared/shell/site-nav";
import { TerminalDialog } from "@/components/shared/terminal/terminal-dialog";
import { StickyCursor } from "@/components/shared/shell/sticky-cursor";
import { usePreloader } from "@/contexts/preloader-context";
import { useShell } from "@/contexts/shell-context";
import { cn } from "@/lib/utils";
import { useChromeVisible } from "@/hooks/use-chrome-visible";
import { markInteractive, prefetchDetails } from "@/lib/route-data";

interface LayoutProps {}

/** Shell: preloader, nav pill, menu, sticky cursor, terminal launcher, then the routed page. */
const Layout: React.FC<LayoutProps> = () => {
	const { t } = useTranslation();
	const { setTerminalOpen } = useShell();
	const chrome = useChromeVisible();
	const { loaded } = usePreloader();
	// From now on route loaders wait for their data (client navigations).
	useEffect(markInteractive, []);
	// After the preloader, warm detail pages so clicks start their transition at once.
	useEffect(() => {
		if (loaded) void prefetchDetails().catch(() => undefined);
	}, [loaded]);

	return (
		<>
			<a
				href="#main"
				onClick={(e) => {
					e.preventDefault();
					const main = document.querySelector("main");
					main?.setAttribute("tabindex", "-1");
					main?.focus();
				}}
				className="sr-only rounded-pill bg-foreground px-4 py-2 text-sm font-semibold text-background focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-600"
			>
				{t("shell.skip-link.label")}
			</a>
			<Preloader />
			<SiteNav />
			<SiteMenu />
			<div className={cn(loaded && "motion-safe:animate-content-rise")}>
				<Outlet />
			</div>
			{chrome ? (
				<PillButton
					magnetic
					aria-label={t("shell.terminal.button.aria-label")}
					onClick={() => setTerminalOpen(true)}
					className="fixed bottom-5 left-5 z-98 font-mono text-[13px] font-bold shadow-[0_16px_40px_-16px_rgba(0,0,0,.6)] [view-transition-name:terminal-launcher] max-desk:hidden print:hidden"
				>
					{t("shell.terminal.button.label")}
				</PillButton>
			) : null}
			<TerminalDialog />
			<StickyCursor />
		</>
	);
};

export default Layout;
