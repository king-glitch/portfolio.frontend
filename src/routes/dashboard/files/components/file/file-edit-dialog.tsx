import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FileEditForm } from "@/routes/dashboard/files/components/file/file-edit-form";

interface FileEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** The file being edited; the caller keeps it after close so the exit animation still reads it. */
	file: AdminFile | undefined;
	/** Changes on every opening: the form remounts, so it always starts clean. */
	session: number;
}

/** Rename / alt text dialog of the files page. */
export const FileEditDialog: React.FC<FileEditDialogProps> = ({
	open,
	onOpenChange,
	file,
	session,
}) => {
	const { t } = useTranslation();
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("dashboard.files.edit.title")}</DialogTitle>
					<DialogDescription>
						{t("dashboard.files.edit.description")}
					</DialogDescription>
				</DialogHeader>
				{file ? (
					<FileEditForm
						key={session}
						file={file}
						onDone={() => onOpenChange(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default FileEditDialog;
