import React from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Skeleton } from "@/components/ui/skeleton";
import { PillSize, PillVariant } from "@/types/ui";

interface MenuContactsProps {}

/** Contact links in the menu footer: email, GitHub, LinkedIn. On error it offers a retry. */
export const MenuContacts: React.FC<MenuContactsProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProfile();
	if (isError)
		return (
			<PillButton
				variant={PillVariant.Ghost}
				size={PillSize.Sm}
				onClick={() => void refetch()}
			>
				{t("common.errors.retry")}
			</PillButton>
		);
	if (isPending) return <Skeleton className="h-4 w-72 bg-current/10" />;
	return (
		<div className="flex flex-wrap gap-4.5 text-[13px] font-semibold">
			{[
				{
					id: "email",
					href: `mailto:${data.contact.email}`,
					label: data.contact.email,
				},
				{
					id: "github",
					href: data.contact.github,
					label: t("common.contact.github.label"),
				},
				{
					id: "linkedin",
					href: data.contact.linkedin,
					label: t("common.contact.linkedin.label"),
				},
			].map((item) => (
				<a
					key={item.id}
					href={item.href}
					target="_blank"
					rel="noreferrer"
					className="underline-offset-4 hover:underline"
				>
					{item.label}
				</a>
			))}
		</div>
	);
};

export default MenuContacts;
