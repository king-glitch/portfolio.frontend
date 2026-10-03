import React from "react";
import { RiErrorWarningLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { isApiError } from "@/api/errors";
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
	/** The query's `error`: picks the message (offline, timeout, rate limit, server, ...). */
	error?: unknown;
	className?: string;
}

/** Error state of every query consumer: message plus a retry button. */
export const QueryErrorAlert: React.FC<QueryErrorAlertProps> = ({
	onRetry,
	error,
	className,
}) => {
	const { t } = useTranslation();
	const kind = isApiError(error) ? error.kind : undefined;
	const title = kind
		? t(`common.errors.kinds.${kind}.title`)
		: t("common.errors.load.title");
	const description = kind
		? t(`common.errors.kinds.${kind}.description`)
		: t("common.errors.load.description");
	return (
		<Alert variant="destructive" className={className}>
			<RiErrorWarningLine />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
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
