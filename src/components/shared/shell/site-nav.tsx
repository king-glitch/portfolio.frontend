import React, { useRef } from "react";
import type { ParseKeys } from "i18next";
import { RiMenuLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { NavLink, useMatch } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { useGoSection } from "@/components/shared/shell/use-go-section";
import { usePreloader } from "@/contexts/preloader-context";
import { useShell } from "@/contexts/shell-context";
import { useScramble } from "@/hooks/motion/use-scramble";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { CursorLabel } from "@/types/cursor";
import { PillSize, PillVariant } from "@/types/ui";

interface NavItem {
	to: string;
	labelKey: ParseKeys;
}

const NAV_ITEMS: NavItem[] = [
	{ to: config.routes.about, labelKey: "shell.nav.about.label" },
	{ to: config.routes.notes, labelKey: "shell.nav.notes.label" },
];

interface SiteNavProps {}

/** Primary nav pill (prototype NAV PILL). Hidden on project pages and until the preloader is done. */
export const SiteNav: React.FC<SiteNavProps> = () => {
	const { t } = useTranslation();
	const { loaded } = usePreloader();
	const { setMenuOpen } = useShell();
	const goSection = useGoSection();
	const onWork = useMatch(config.routes.work) !== null;
	const brandRef = useRef<HTMLButtonElement>(null);
	useScramble(brandRef);
	const visible = loaded && !onWork;

	return (
		<header
			inert={!visible}
			style={{
				transitionDelay: visible
					? `${config.shell.nav.revealDelayMs}ms`
					: "0ms",
			}}
			className={cn(
				"pointer-events-none fixed inset-x-0 top-5 z-100 flex justify-center px-4 transition-opacity duration-500 ease-out invert-scope [view-transition-name:site-nav]",
				visible ? "opacity-100" : "opacity-0",
			)}
		>
			<nav
				aria-label={t("shell.nav.label")}
				className="pointer-events-auto grid h-16 w-full max-w-225 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center rounded-pill bg-background pr-2.5 pl-5.5 text-foreground shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)] invert-surface"
			>
				<PillButton
					variant={PillVariant.Ghost}
					size={PillSize.Lg}
					magnetic
					aria-label={t("shell.nav.menu.aria-label")}
					onClick={() => setMenuOpen(true)}
					className="gap-3 justify-self-start px-2 tracking-[0.02em] uppercase"
				>
					<RiMenuLine data-icon="inline-start" />
					{t("common.menu.label")}
				</PillButton>
				<PillButton
					ref={brandRef}
					variant={PillVariant.Ghost}
					size={PillSize.Lg}
					aria-label={t("shell.brand.aria-label")}
					onClick={() => goSection(config.sections.top)}
					className="px-2 text-xl font-extrabold tracking-[-0.04em] whitespace-nowrap max-[760px]:hidden"
				>
					{t("shell.brand.label")}
				</PillButton>
				<div className="flex items-center gap-1 justify-self-end">
					{NAV_ITEMS.map(({ to, labelKey }) => (
						<NavLink
							key={to}
							to={to}
							viewTransition
							className="inline-flex h-11 items-center px-3 text-sm underline-offset-6 aria-[current=page]:font-bold aria-[current=page]:underline max-[760px]:hidden"
						>
							{t(labelKey)}
						</NavLink>
					))}
					<PillButton
						size={PillSize.Lg}
						magnetic
						cursor={CursorLabel.SayHi}
						onClick={() => goSection(config.sections.contact)}
						className="whitespace-nowrap"
					>
						{t("shell.nav.contact.label")}
					</PillButton>
				</div>
			</nav>
		</header>
	);
};

export default SiteNav;
