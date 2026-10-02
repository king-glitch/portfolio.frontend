import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";

const HABITS: ParseKeys[] = [
	"about.explore.tile.habits.items.1",
	"about.explore.tile.habits.items.2",
	"about.explore.tile.habits.items.3",
	"about.explore.tile.habits.items.4",
	"about.explore.tile.habits.items.5",
];

interface TileHabitsProps {}

/** Five habits, fading down the list. */
export const TileHabits: React.FC<TileHabitsProps> = () => {
	const { t } = useTranslation();
	return (
		<div className="flex size-full flex-col justify-center gap-0.5 px-5.5 py-4.5">
			<span className="mb-2 text-(length:--wall-s) font-semibold opacity-60">
				{t("about.explore.tile.habits.title")}
			</span>
			{HABITS.map((key, i) => (
				<span
					key={key}
					className="text-(length:--wall-m) leading-[1.35] font-extrabold tracking-[-0.03em]"
					style={{ opacity: 1 - i * 0.12 }}
				>
					{t(key)}
				</span>
			))}
		</div>
	);
};

export default TileHabits;
