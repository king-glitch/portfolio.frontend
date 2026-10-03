import React from "react";
import { useTranslation } from "react-i18next";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";

interface ProjectSelectProps {
	id?: string;
	/** Document id of the chosen project, "" for none. */
	value: string;
	onChange: (value: string) => void;
	invalid?: boolean;
}

/** Pick one of the dashboard's projects (or none). The one project picker of every form. */
export const ProjectSelect: React.FC<ProjectSelectProps> = ({
	id,
	value,
	onChange,
	invalid,
}) => {
	const { t } = useTranslation();
	const projects = useAdminProjects();
	if (projects.isPending) return <Skeleton className="h-9 w-full" />;
	if (projects.isError)
		return (
			<QueryErrorAlert
				onRetry={() => void projects.refetch()}
				error={projects.error}
			/>
		);
	const items = [
		{ value: config.dashboard.noValue, label: t("dashboard.dynamic.none") },
		...projects.data.map((project) => ({
			value: project.id,
			label: project.name,
		})),
	];
	return (
		<Select
			items={items}
			value={value || config.dashboard.noValue}
			onValueChange={(next) =>
				onChange(
					next === null || next === config.dashboard.noValue
						? ""
						: next,
				)
			}
		>
			<SelectTrigger id={id} aria-invalid={invalid} className="w-full">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{items.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ProjectSelect;
