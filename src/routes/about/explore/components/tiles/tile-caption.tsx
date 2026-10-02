import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { TileProps } from "@/types/about";

interface TileCaptionProps extends TileProps {
	className?: string;
}

/** Tile caption: an i18n key (with values) or raw data text such as a project name. */
export const TileCaption: React.FC<TileCaptionProps> = ({
	data,
	className,
}) => {
	const { t } = useTranslation();
	const text = data.captionKey
		? t(data.captionKey, data.captionValues)
		: data.caption;
	return (
		<span
			className={cn(
				"text-(length:--wall-s) leading-tight font-semibold",
				className,
			)}
		>
			{text}
		</span>
	);
};

export default TileCaption;
