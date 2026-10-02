import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PillButton } from "@/components/common/buttons/pill-button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { PillVariant } from "@/types/ui";

interface QueryEmptyProps {
	titleKey: ParseKeys;
	descriptionKey?: ParseKeys;
	/** Optional way out, e.g. back home from a not-found state. */
	action?: { to: string; labelKey: ParseKeys };
	className?: string;
}

/** Empty / not-found state of every query consumer. */
export const QueryEmpty: React.FC<QueryEmptyProps> = ({
	titleKey,
	descriptionKey,
	action,
	className,
}) => {
	const { t } = useTranslation();
	return (
		<Empty className={className}>
			<EmptyHeader>
				<EmptyTitle>{t(titleKey)}</EmptyTitle>
				{descriptionKey ? (
					<EmptyDescription>{t(descriptionKey)}</EmptyDescription>
				) : null}
			</EmptyHeader>
			{action ? (
				<EmptyContent>
					<PillButton
						variant={PillVariant.Outline}
						nativeButton={false}
						render={<Link to={action.to} viewTransition />}
					>
						{t(action.labelKey)}
					</PillButton>
				</EmptyContent>
			) : null}
		</Empty>
	);
};

export default QueryEmpty;
