import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminNote } from "@/api/types/admin/content";
import { TableCell, TableRow } from "@/components/ui/table";
import { config } from "@/config";
import { dashboardNotePath } from "@/lib/routes";
import { RowActions } from "@/routes/dashboard/components/row-actions";
import { StatusBadge } from "@/routes/dashboard/components/status-badge";

interface NoteRowProps {
	note: AdminNote;
	onDelete: (note: AdminNote) => void;
}

/** One note: number, title, status, project, date, edit/delete. */
export const NoteRow: React.FC<NoteRowProps> = ({ note, onDelete }) => {
	const { t } = useTranslation();
	const published = note.publishedAt
		? new Date(note.publishedAt).toLocaleDateString(
				config.i18n.defaultLocale,
				config.dateFormat,
			)
		: t("dashboard.notes.list.unpublished");
	return (
		<TableRow>
			<TableCell className="w-16 text-muted-foreground tabular-nums">
				{note.num}
			</TableCell>
			<TableCell>
				<div className="flex flex-col">
					<span className="font-medium">{note.title}</span>
					<span className="text-xs text-muted-foreground">
						{note.slug}
					</span>
				</div>
			</TableCell>
			<TableCell>
				<StatusBadge status={note.status} />
			</TableCell>
			<TableCell className="text-muted-foreground max-md:hidden">
				{note.project?.name ?? t("dashboard.notes.list.no-project")}
			</TableCell>
			<TableCell className="text-muted-foreground max-md:hidden">
				{published}
			</TableCell>
			<TableCell>
				<RowActions
					name={note.title}
					editTo={dashboardNotePath(note.id)}
					onDelete={() => onDelete(note)}
				/>
			</TableCell>
		</TableRow>
	);
};

export default NoteRow;
