import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { PillButton } from "@/components/common/buttons/pill-button";
import { config } from "@/config";
import { PillSize, PillVariant } from "@/types/ui";

interface Jump {
	section: string;
	labelKey: ParseKeys;
}

const JUMPS: Jump[] = [
	{
		section: config.sections.stack,
		labelKey: "shell.menu.jumps.stack.label",
	},
	{
		section: config.sections.process,
		labelKey: "shell.menu.jumps.process.label",
	},
	{
		section: config.sections.timeline,
		labelKey: "shell.menu.jumps.timeline.label",
	},
	{
		section: config.sections.skills,
		labelKey: "shell.menu.jumps.skills.label",
	},
	{
		section: config.sections.notes,
		labelKey: "shell.menu.jumps.notes.label",
	},
];

interface MenuJumpsProps {
	onJump: (section: string) => void;
}

/** Chips that jump to a home section. */
export const MenuJumps: React.FC<MenuJumpsProps> = ({ onJump }) => {
	const { t } = useTranslation();
	return (
		<div
			className="menu-in flex flex-wrap gap-2"
			style={{ animationDelay: "0.4s" }}
		>
			{JUMPS.map(({ section, labelKey }) => (
				<PillButton
					key={section}
					variant={PillVariant.Outline}
					size={PillSize.Lg}
					onClick={() => onJump(section)}
				>
					{t(labelKey)}
				</PillButton>
			))}
		</div>
	);
};

export default MenuJumps;
