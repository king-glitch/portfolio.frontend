import React from "react";
import { RiFocus3Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/common/buttons/icon-button";

interface WallRecenterProps {
	onRecenter: () => void;
}

/** Back to the hero tile (also the Home key). */
export const WallRecenter: React.FC<WallRecenterProps> = ({ onRecenter }) => {
	const { t } = useTranslation();
	return (
		<IconButton
			label={t("about.explore.recenter.label")}
			icon={RiFocus3Line}
			onClick={onRecenter}
			className="bg-card"
		/>
	);
};

export default WallRecenter;
