import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Preloader } from "@/components/shared/shell/preloader";
import { SiteMenu } from "@/components/shared/shell/site-menu";
import { SiteNav } from "@/components/shared/shell/site-nav";
import { StickyCursor } from "@/components/shared/shell/sticky-cursor";
import { useShell } from "@/contexts/shell-context";
import { PillSize } from "@/types/ui";

interface LayoutProps {}

/** Shell: preloader, nav pill, menu, sticky cursor, terminal launcher, then the routed page. */
const Layout: React.FC<LayoutProps> = () => {
	const { t } = useTranslation();
	const { setTerminalOpen } = useShell();

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
				className="fixed top-2 left-2 z-600 -translate-y-20 rounded-pill bg-foreground px-4 py-2 text-sm font-semibold text-background focus:translate-y-0"
			>
				{t("shell.skip-link.label")}
			</a>
			<Preloader />
			<SiteNav />
			<SiteMenu />
			<Outlet />
			<PillButton
				size={PillSize.Lg}
				magnetic
				aria-label={t("shell.terminal.button.aria-label")}
				onClick={() => setTerminalOpen(true)}
				className="fixed bottom-5 left-5 z-98 font-mono text-[13px] font-bold shadow-[0_16px_40px_-16px_rgba(0,0,0,.6)] [view-transition-name:terminal-launcher]"
			>
				{t("shell.terminal.button.label")}
			</PillButton>
			{/* Wave 3 (plan 07): mount <TerminalDialog /> here; it reads `terminalOpen` from useShell(). */}
			<StickyCursor />
		</>
	);
};

export default Layout;
