import React from "react";
import { RiErrorWarningLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { PillButton } from "@/components/common/buttons/pill-button";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";
import { PillSize, PillVariant } from "@/types/ui";

interface QueryErrorAlertProps {
	/** Usually the query's `refetch`. */
	onRetry: () => void;
	className?: string;
}

/** Error state of every query consumer: message plus a retry button. */
export const QueryErrorAlert: React.FC<QueryErrorAlertProps> = ({
	onRetry,
	className,
}) => {
	const { t } = useTranslation();
	return (
		<Alert variant="destructive" className={className}>
			<RiErrorWarningLine />
			<AlertTitle>{t("common.errors.load.title")}</AlertTitle>
			<AlertDescription>
				{t("common.errors.load.description")}
			</AlertDescription>
			<AlertAction>
				<PillButton
					variant={PillVariant.Outline}
					size={PillSize.Sm}
					onClick={onRetry}
				>
					{t("common.errors.retry")}
				</PillButton>
			</AlertAction>
		</Alert>
	);
};

export default QueryErrorAlert;
