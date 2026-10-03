import React, { useState } from "react";
import { RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useAdminNotes } from "@/api/hooks/admin/notes/use-admin-notes";
import { useDeleteNote } from "@/api/hooks/admin/notes/use-delete-note";
import type { AdminNote } from "@/api/types/admin/content";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { useRetainedValue } from "@/hooks/use-retained-value";
import i18n from "@/lib/i18n";
import { DeleteDialog } from "@/routes/dashboard/components/delete-dialog";
import { ListSkeleton } from "@/routes/dashboard/components/list-skeleton";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { NotesTable } from "@/routes/dashboard/notes/components/notes-table";

export function meta() {
	return [{ title: i18n.t("dashboard.notes.list.meta.title") }];
}

interface NotesProps {}

const Notes: React.FC<NotesProps> = () => {
	const { t } = useTranslation();
	const notes = useAdminNotes();
	const remove = useDeleteNote();
	const [target, setTarget] = useState<AdminNote>();
	const [open, setOpen] = useState(false);
	const retained = useRetainedValue(target);

	const askDelete = (note: AdminNote) => {
		setTarget(note);
		setOpen(true);
	};
	const confirmDelete = () => {
		if (!target) return;
		remove.mutate(target.id, {
			onSuccess: () => {
				setOpen(false);
				toast.add({
					type: "success",
					title: t("dashboard.notes.list.deleted"),
				});
			},
		});
	};

	const renderBody = () => {
		if (notes.isPending) return <ListSkeleton />;
		if (notes.isError)
			return (
				<QueryErrorAlert
					onRetry={() => void notes.refetch()}
					error={notes.error}
				/>
			);
		if (!notes.data.length)
			return (
				<QueryEmpty
					titleKey="dashboard.notes.list.empty.title"
					descriptionKey="dashboard.notes.list.empty.description"
					action={{
						to: config.routes.dashboardNoteNew,
						labelKey: "dashboard.notes.list.empty.action",
					}}
				/>
			);
		return <NotesTable notes={notes.data} onDelete={askDelete} />;
	};

	return (
		<>
			<PageHeader
				title={t("dashboard.notes.list.title")}
				description={t("dashboard.notes.list.description")}
				action={
					<Button
						nativeButton={false}
						render={<Link to={config.routes.dashboardNoteNew} />}
					>
						<RiAddLine data-icon="inline-start" />
						{t("dashboard.notes.list.new")}
					</Button>
				}
			/>
			{renderBody()}
			<DeleteDialog
				open={open}
				onOpenChange={setOpen}
				name={retained?.title}
				pending={remove.isPending}
				onConfirm={confirmDelete}
			/>
		</>
	);
};

export default Notes;
