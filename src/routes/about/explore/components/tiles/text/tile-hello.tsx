import React from "react";
import { useTranslation } from "react-i18next";
import type { TileProps } from "@/types/about";

interface TileHelloProps extends TileProps {}

/** "Say hello." with the contact placeholders from the profile. */
export const TileHello: React.FC<TileHelloProps> = ({ data }) => {
	const { t } = useTranslation();
	return (
		<div className="flex size-full items-center justify-between gap-4 px-7">
			<span className="text-(length:--wall-big) leading-none font-extrabold tracking-[-0.06em]">
				{t("about.explore.tile.hello.title")}
			</span>
			<span className="text-right text-(length:--wall-s) leading-normal font-bold">
				{data.contact?.email}
				<br />
				{data.contact?.github} · {data.contact?.linkedin}
			</span>
		</div>
	);
};

export default TileHello;
