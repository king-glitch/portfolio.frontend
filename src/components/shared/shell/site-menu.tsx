import React, { useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { ContactLinks } from "@/components/shared/contact/contact-links";
import { MenuJumps } from "@/components/shared/shell/menu/menu-jumps";
import { MenuPageLink } from "@/components/shared/shell/menu/menu-page-link";
import { MenuPreview } from "@/components/shared/shell/menu/menu-preview";
import { MenuProjects } from "@/components/shared/shell/menu/menu-projects";
import {
	MENU_PAGES,
	type MenuPage,
} from "@/components/shared/shell/menu/pages";
import { useGoSection } from "@/components/shared/shell/use-go-section";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { useShell } from "@/contexts/shell-context";
import { config } from "@/config";
import { PillSize, PillVariant } from "@/types/ui";

const DEFAULT_HOVER = MENU_PAGES[0]?.id ?? "";

interface SiteMenuProps {}

/** Full-screen menu (prototype MENU) on the shadcn Dialog: modal, always mounted, Esc/close button close it. */
export const SiteMenu: React.FC<SiteMenuProps> = () => {
	const { t } = useTranslation();
	const { menuOpen, setMenuOpen, setTerminalOpen } = useShell();
	const { pathname } = useLocation();
	const goSection = useGoSection();
	const [hoverId, setHoverId] = useState(DEFAULT_HOVER);

	const close = () => setMenuOpen(false);
	const selectPage = (page: MenuPage) => {
		close();
		if (page.section) goSection(page.section);
	};
	const jump = (section: string) => {
		close();
		goSection(section);
	};
	const openTerminal = () => {
		close();
		setTerminalOpen(true);
	};

	return (
		<Dialog
			open={menuOpen}
			onOpenChange={setMenuOpen}
			onOpenChangeComplete={(open) => {
				if (!open) setHoverId(DEFAULT_HOVER);
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="inset-0 z-150 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none bg-transparent p-0 ring-0 transition-[clip-path] duration-900 ease-[cubic-bezier(.87,0,.13,1)] invert-scope [clip-path:inset(0)] data-ending-style:duration-600 data-ending-style:[clip-path:inset(0_0_100%_0)] data-starting-style:[clip-path:inset(0_0_100%_0)] motion-reduce:duration-1 sm:max-w-none data-open:animate-none! data-closed:animate-none!"
			>
				<div className="flex h-full flex-col overflow-y-auto bg-background text-foreground invert-surface">
					<DialogTitle className="sr-only">
						{t("common.menu.label")}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{t("shell.menu.description")}
					</DialogDescription>
					<div className="flex items-center justify-between gap-4 px-[clamp(16px,5vw,64px)] py-5.5">
						<span className="text-xl font-extrabold tracking-[-0.04em]">
							{t("shell.brand.label")}
						</span>
						<PillButton
							variant={PillVariant.Invert}
							size={PillSize.Xl}
							magnetic
							onClick={close}
						>
							<RiCloseLine data-icon="inline-start" />
							{t("common.close")}
						</PillButton>
					</div>

					<div className="grid grow grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-[5vw] px-[clamp(16px,5vw,64px)] pt-3 pb-7 max-desk:grid-cols-[minmax(0,1fr)]">
						<nav
							aria-label={t("shell.menu.nav.label")}
							className="flex flex-col justify-center border-t border-current/30 [&:hover_a:not(:hover):not(:focus-visible)]:opacity-30 [&:hover_button:not(:hover):not(:focus-visible)]:opacity-30"
						>
							{MENU_PAGES.map((page, index) => (
								<MenuPageLink
									key={page.id}
									index={index}
									titleKey={page.titleKey}
									subKey={page.subKey}
									current={page.isCurrent(pathname)}
									delayS={0.12 + index * 0.06}
									to={page.to}
									onSelect={() => selectPage(page)}
									onHover={() => setHoverId(page.id)}
								/>
							))}
						</nav>
						<div className="flex flex-col justify-center gap-5.5">
							<MenuPreview activeId={hoverId} />
							<MenuProjects
								onHover={setHoverId}
								onSelect={close}
							/>
							<MenuJumps onJump={jump} />
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-between gap-4 border-t border-current/30 px-[clamp(16px,5vw,64px)] pt-4.5 pb-6">
						<ContactLinks />
						<PillButton
							variant={PillVariant.Ghost}
							size={PillSize.Lg}
							onClick={openTerminal}
							className="font-mono text-[13px] font-bold"
						>
							{t("shell.menu.terminal.label")}
						</PillButton>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SiteMenu;
