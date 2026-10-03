import React from "react";
import type { ParseKeys } from "i18next";
import { RiArrowRightUpLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import type { Contact } from "@/api/types/portfolio/profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { DiscordPill } from "@/components/shared/contact/discord-pill";
import { ContactLinksSkeleton } from "@/components/shared/contact/contact-links-skeleton";
import { cn } from "@/lib/utils";
import { PillSize, PillVariant } from "@/types/ui";

interface Channel {
	key: keyof Contact;
	labelKey: ParseKeys;
	hrefPrefix: string;
	/** Email leads (foreground ring + arrow); the rest are quieter. */
	primary: boolean;
}

const CHANNELS: Channel[] = [
	{
		key: "email",
		labelKey: "common.contact.email.label",
		hrefPrefix: "mailto:",
		primary: true,
	},
	{
		key: "github",
		labelKey: "common.contact.github.label",
		hrefPrefix: "",
		primary: false,
	},
	{
		key: "linkedin",
		labelKey: "common.contact.linkedin.label",
		hrefPrefix: "",
		primary: false,
	},
];

interface ContactLinksProps {
	className?: string;
}

/** Contact pills: the email address leads, GitHub, LinkedIn and Discord follow by name. */
export const ContactLinks: React.FC<ContactLinksProps> = ({ className }) => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProfile();

	if (isPending) return <ContactLinksSkeleton className={className} />;
	if (isError || !data)
		return (
			<QueryErrorAlert
				onRetry={() => void refetch()}
				className={className}
			/>
		);

	return (
		<div className={cn("flex flex-wrap gap-3", className)}>
			{CHANNELS.map(({ key, labelKey, hrefPrefix, primary }) => {
				const value = data.contact[key];
				return (
					<PillButton
						key={key}
						variant={
							primary ? PillVariant.Strong : PillVariant.Outline
						}
						size={PillSize.Xl}
						magnetic
						nativeButton={false}
						aria-label={t("common.contact.aria-label", {
							channel: t(labelKey),
							value,
						})}
						render={
							<a
								href={`${hrefPrefix}${value}`}
								target="_blank"
								rel="noreferrer"
							/>
						}
						className={cn(
							"gap-3.5",
							!primary && "px-6.5 text-base font-medium",
						)}
					>
						{primary ? value : t(labelKey)}
						<RiArrowRightUpLine data-icon="inline-end" />
					</PillButton>
				);
			})}
			<DiscordPill handle={data.contact.discord} />
		</div>
	);
};

export default ContactLinks;
