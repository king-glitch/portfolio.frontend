// style-lint-ignore-file query-states -- the projects only fill a select; a failed load leaves "None"
import React from "react";
import { useTranslation } from "react-i18next";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { config } from "@/config";

interface DynamicProjectSelectProps {
	id: string;
	/** Document id of the chosen project, "" for none. */
	value: string;
	onChange: (value: string) => void;
}

/** Pick one of the dashboard's projects (or none). While they load, or if they fail to, only "None" is offered. */
export const DynamicProjectSelect: React.FC<DynamicProjectSelectProps> = ({
	id,
	value,
	onChange,
}) => {
	const { t } = useTranslation();
	const projects = useAdminProjects();
	const items = [
		{ value: config.dashboard.noValue, label: t("dashboard.dynamic.none") },
		...(projects.data ?? []).map((project) => ({
			value: project.id,
			label: project.name,
		})),
	];
	return (
		<Select
			items={items}
			disabled={projects.isPending}
			value={value || config.dashboard.noValue}
			onValueChange={(next) =>
				onChange(
					next === null || next === config.dashboard.noValue
						? ""
						: next,
				)
			}
		>
			<SelectTrigger id={id} className="w-full">
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

export default DynamicProjectSelect;
