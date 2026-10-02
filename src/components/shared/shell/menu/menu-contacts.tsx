import React from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Skeleton } from "@/components/ui/skeleton";
import { PillSize, PillVariant } from "@/types/ui";

interface MenuContactsProps {}

/** Contact values as plain text in the menu footer (prototype). On error it offers a retry. */
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
				data.contact.email,
				data.contact.github,
				data.contact.linkedin,
			].map((value) => (
				<span key={value}>{value}</span>
			))}
		</div>
	);
};

export default MenuContacts;
