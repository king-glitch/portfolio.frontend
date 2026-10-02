import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { config } from "@/config";
import { PillSize, PillVariant } from "@/types/ui";

const MODES: { to: string; labelKey: ParseKeys }[] = [
	{ to: config.routes.aboutExplore, labelKey: "about.switch.explore.label" },
	{ to: config.routes.aboutResume, labelKey: "about.switch.resume.label" },
];

interface ModeSwitchProps {
	/** The current view's own action (recenter on Explore, print on Resume). */
	children?: React.ReactNode;
}

/** Explore / Resume toggle (route links, `aria-current` from the router) plus the current view's action. */
export const ModeSwitch: React.FC<ModeSwitchProps> = ({ children }) => {
	const { t } = useTranslation();
	return (
		<div
			role="group"
			aria-label={t("about.switch.group.label")}
			className="fixed bottom-[max(22px,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-pill bg-card p-1 shadow-[0_0_0_1px_var(--border),0_20px_40px_-16px_rgb(0_0_0/0.6)] print:hidden"
		>
			{MODES.map(({ to, labelKey }) => (
				<PillButton
					key={to}
					nativeButton={false}
					render={<NavLink to={to} viewTransition />}
					variant={PillVariant.Ghost}
					size={PillSize.Sm}
					className="px-4.5 text-sm font-bold aria-[current=page]:bg-foreground aria-[current=page]:text-background aria-[current=page]:hover:bg-foreground aria-[current=page]:hover:text-background"
				>
					{t(labelKey)}
				</PillButton>
			))}
			{children}
		</div>
	);
};

export default ModeSwitch;
