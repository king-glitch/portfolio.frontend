import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import type { Contact } from "@/api/types/portfolio/profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { ContactLinksSkeleton } from "@/components/shared/contact/contact-links-skeleton";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { PillVariant } from "@/types/ui";

interface Channel {
	key: keyof Contact;
	labelKey: ParseKeys;
	hrefPrefix: string;
}

const CHANNELS: Channel[] = [
	{
		key: "email",
		labelKey: "common.contact.email.label",
		hrefPrefix: "mailto:",
	},
	{ key: "github", labelKey: "common.contact.github.label", hrefPrefix: "" },
	{
		key: "linkedin",
		labelKey: "common.contact.linkedin.label",
		hrefPrefix: "",
	},
];

interface ContactLinksProps {
	className?: string;
}

/** Contact pills. A value starting with `[` is a placeholder and renders as plain text; real values become links. */
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
			{CHANNELS.map(({ key, labelKey, hrefPrefix }) => {
				const value = data.contact[key];
				const label = t(labelKey);
				if (value.startsWith(config.portfolio.placeholderPrefix))
					return (
						<PillButton
							key={key}
							variant={PillVariant.Outline}
							nativeButton={false}
							render={<span title={t("common.contact.hint")} />}
						>
							{value}
						</PillButton>
					);
				return (
					<PillButton
						key={key}
						variant={PillVariant.Outline}
						nativeButton={false}
						aria-label={`${label}: ${value}`}
						render={
							<a
								href={`${hrefPrefix}${value}`}
								target="_blank"
								rel="noreferrer"
							/>
						}
					>
						{label}
					</PillButton>
				);
			})}
		</div>
	);
};

export default ContactLinks;
