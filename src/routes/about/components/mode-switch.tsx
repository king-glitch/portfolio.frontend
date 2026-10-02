import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import { config } from "@/config";
import { PillVariant } from "@/types/ui";

const MODES: { to: string; labelKey: ParseKeys }[] = [
	{ to: config.routes.aboutExplore, labelKey: "about.switch.explore.label" },
	{ to: config.routes.aboutResume, labelKey: "about.switch.resume.label" },
];

interface ModeSwitchProps {}

/** Explore / Resume toggle: two route links, `aria-current` from the router. */
export const ModeSwitch: React.FC<ModeSwitchProps> = () => {
	const { t } = useTranslation();
	return (
		<div
			role="group"
			aria-label={t("about.switch.group.label")}
			className="fixed bottom-5.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-pill bg-card p-1 shadow-xl ring-1 ring-border print:hidden"
		>
			{MODES.map(({ to, labelKey }) => (
				<PillButton
					key={to}
					nativeButton={false}
					render={<NavLink to={to} viewTransition />}
					className="aria-[current=page]:bg-foreground aria-[current=page]:text-background"
					variant={PillVariant.Ghost}
				>
					{t(labelKey)}
				</PillButton>
			))}
		</div>
	);
};

export default ModeSwitch;
