import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";

const WORDS: ParseKeys[] = [
	"about.explore.tile.words.items.1",
	"about.explore.tile.words.items.2",
	"about.explore.tile.words.items.3",
];

interface TileWordsProps {}

/** Three pill-shaped text effects: outline, solid, light italic. */
export const TileWords: React.FC<TileWordsProps> = () => {
	const { t } = useTranslation();
	const [outline, solid, light] = WORDS;
	return (
		<div className="flex size-full flex-col justify-center gap-2 px-5 py-4 text-(length:--wall-m)">
			{outline ? (
				<span className="self-start rounded-full px-3.5 py-1.5 font-extrabold tracking-[-0.03em] text-transparent ring-1 ring-current/20 [-webkit-text-stroke:1px_currentColor] ring-inset">
					{t(outline)}
				</span>
			) : null}
			{solid ? (
				<span className="self-end rounded-full bg-foreground px-3.5 py-1.5 font-black tracking-tighter text-background">
					{t(solid)}
				</span>
			) : null}
			{light ? (
				<span className="self-start rounded-full bg-muted px-3.5 py-1.5 font-light tracking-[0.04em] italic">
					{t(light)}
				</span>
			) : null}
		</div>
	);
};

export default TileWords;
