import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminNote } from "@/api/types/admin/content";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { NoteRow } from "@/routes/dashboard/notes/components/note-row";

const columns = [
	"num",
	"title",
	"status",
	"project",
	"published",
	"actions",
] as const;
const hidden: string[] = ["project", "published"];

interface NotesTableProps {
	notes: AdminNote[];
	onDelete: (note: AdminNote) => void;
}

/** Notes as the backend lists them (newest first). */
export const NotesTable: React.FC<NotesTableProps> = ({ notes, onDelete }) => {
	const { t } = useTranslation();
	return (
		<Table>
			<TableHeader>
				<TableRow>
					{columns.map((column) => (
						<TableHead
							key={column}
							className={
								hidden.includes(column)
									? "max-md:hidden"
									: undefined
							}
						>
							{column === "actions" ? (
								<span className="sr-only">
									{t(
										`dashboard.notes.list.columns.${column}`,
									)}
								</span>
							) : (
								t(`dashboard.notes.list.columns.${column}`)
							)}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{notes.map((note) => (
					<NoteRow key={note.id} note={note} onDelete={onDelete} />
				))}
			</TableBody>
		</Table>
	);
};

export default NotesTable;
