import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUploadFile } from "@/api/hooks/admin/storage/use-upload-file";
import type { AdminFile, FileKind } from "@/api/types/admin/storage";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FileUploadForm } from "@/routes/dashboard/components/storage/file/upload/file-upload-form";

interface FileUploadDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Kinds the upload may hold; empty = every kind. */
	accept: FileKind[];
	/** Several files at once (the files page) or exactly one (a picker). */
	multiple?: boolean;
	/** Changes on every opening: the form remounts, so it always starts clean. */
	session: number;
	onUploaded?: (file: AdminFile) => void;
}

/** Upload dialog of the file library and of every file picker. It cannot be closed mid-upload. */
export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
	open,
	onOpenChange,
	accept,
	multiple = false,
	session,
	onUploaded,
}) => {
	const { t } = useTranslation();
	const upload = useUploadFile();
	// a batch is pending between its requests too, when the mutation itself is idle
	const [batch, setBatch] = useState(false);
	const pending = batch || upload.isPending;
	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!pending) onOpenChange(next);
			}}
			onOpenChangeComplete={(isOpen) => {
				if (!isOpen) upload.reset();
			}}
		>
			{/* the dialog sits inside the picker's form in the React tree (portalled in the DOM only): its submit must not reach that form */}
			<DialogContent onSubmit={(event) => event.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>
						{t("dashboard.storage.upload.title")}
					</DialogTitle>
					<DialogDescription>
						{t("dashboard.storage.upload.description")}
					</DialogDescription>
				</DialogHeader>
				<FileUploadForm
					key={session}
					accept={accept}
					multiple={multiple}
					pending={pending}
					onPendingChange={setBatch}
					upload={upload.mutateAsync}
					onUploaded={onUploaded}
					onDone={() => onOpenChange(false)}
					onCancel={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default FileUploadDialog;
