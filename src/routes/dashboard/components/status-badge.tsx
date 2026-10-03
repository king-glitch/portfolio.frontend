import React from "react";
import { useTranslation } from "react-i18next";
import { ContentStatus } from "@/api/types/admin/enums";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
	status: ContentStatus;
}

/** Draft = outline, published = filled: monochrome, readable without color. */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const { t } = useTranslation();
	return (
		<Badge
			variant={status === ContentStatus.Published ? "default" : "outline"}
		>
			{t(`dashboard.statuses.${status}`)}
		</Badge>
	);
};

export default StatusBadge;
