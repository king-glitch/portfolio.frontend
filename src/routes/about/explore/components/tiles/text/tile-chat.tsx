import React from "react";
import { useTranslation } from "react-i18next";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

interface TileChatProps extends TileProps {}

/** Two chat bubbles and a caption. */
export const TileChat: React.FC<TileChatProps> = ({ data }) => {
	const { t } = useTranslation();
	return (
		<div className="relative flex size-full flex-col justify-center gap-2 px-4.5 pt-3.5 pb-(--wall-cap-h) text-(length:--wall-m)">
			<span className="self-start rounded-[18px_18px_18px_4px] bg-muted px-3.5 py-2 font-semibold">
				{t("about.explore.tile.chat.question")}
			</span>
			<span className="self-end rounded-[18px_18px_4px_18px] bg-foreground px-3.5 py-2 font-bold text-background">
				{t("about.explore.tile.chat.answer")}
			</span>
			<TileCaption
				data={data}
				className="absolute inset-x-0 bottom-0 flex h-(--wall-cap-h) items-center justify-center"
			/>
		</div>
	);
};

export default TileChat;
