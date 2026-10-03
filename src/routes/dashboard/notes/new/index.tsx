import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { NoteForm } from "@/routes/dashboard/notes/components/note-form";

export function meta() {
	return [{ title: i18n.t("dashboard.notes.new.meta.title") }];
}

interface NoteNewProps {}

const NoteNew: React.FC<NoteNewProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			<PageHeader title={t("dashboard.notes.new.title")} />
			<NoteForm />
		</>
	);
};

export default NoteNew;
