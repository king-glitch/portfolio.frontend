import React, { useState } from "react";
import { RiFileCopyLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { PillButton } from "@/components/common/buttons/pill-button";
import { PillSize, PillVariant } from "@/types/ui";

interface DiscordPillProps {
	handle: string;
}

/** Discord has no public profile URL from a handle, so the pill copies it. */
export const DiscordPill: React.FC<DiscordPillProps> = ({ handle }) => {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);

	const copy = () => {
		void navigator.clipboard.writeText(handle).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<PillButton
			variant={PillVariant.Outline}
			size={PillSize.Xl}
			magnetic
			aria-label={t("common.contact.aria-label", {
				channel: t("common.contact.discord.label"),
				value: handle,
			})}
			onClick={copy}
			className="gap-3.5 px-6.5 text-base font-medium"
		>
			{copied
				? t("common.contact.discord.copied", { handle })
				: t("common.contact.discord.label")}
			<RiFileCopyLine data-icon="inline-end" />
		</PillButton>
	);
};

export default DiscordPill;
