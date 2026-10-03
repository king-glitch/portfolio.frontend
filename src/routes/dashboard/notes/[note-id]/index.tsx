import React from "react";
import { useTranslation } from "react-i18next";
import { isNotFound } from "@/api/errors";
import { useAdminNote } from "@/api/hooks/admin/notes/use-admin-note";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import i18n from "@/lib/i18n";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { NoteForm } from "@/routes/dashboard/notes/components/note-form";
import { NoteFormSkeleton } from "@/routes/dashboard/notes/[note-id]/components/note-form-skeleton";
import type { Route } from "./+types/index";

export function meta() {
	return [{ title: i18n.t("dashboard.notes.edit.meta.title") }];
}

interface NoteEditProps extends Route.ComponentProps {}

const NoteEdit: React.FC<NoteEditProps> = ({ params }) => {
	const { t } = useTranslation();
	const note = useAdminNote(params.noteId);

	const renderBody = () => {
		if (note.isPending) return <NoteFormSkeleton />;
		if (isNotFound(note.error))
			return (
				<QueryEmpty
					titleKey="dashboard.notes.not-found.title"
					action={{
						to: config.routes.dashboardNotes,
						labelKey: "dashboard.notes.not-found.action",
					}}
				/>
			);
		if (note.isError)
			return (
				<QueryErrorAlert
					onRetry={() => void note.refetch()}
					error={note.error}
				/>
			);
		return <NoteForm key={note.data.id} note={note.data} />;
	};

	return (
		<>
			<PageHeader
				title={note.data?.title ?? t("dashboard.notes.edit.title")}
			/>
			{renderBody()}
		</>
	);
};

export default NoteEdit;
