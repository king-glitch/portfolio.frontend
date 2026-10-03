import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import { formatBytes } from "@/lib/storage/files";
import { FileActions } from "@/routes/dashboard/files/components/file/file-actions";
import { FileThumb } from "@/routes/dashboard/components/storage/file/file-thumb";

interface FileRowProps {
	file: AdminFile;
	onEdit: (file: AdminFile) => void;
	onDelete: (file: AdminFile) => void;
}

/** A document, archive, audio clip or other file: kind icon, name, size and actions. */
export const FileRow: React.FC<FileRowProps> = ({ file, onEdit, onDelete }) => {
	const { t } = useTranslation();
	return (
		<li className="flex items-center gap-3 rounded-lg border p-2">
			<FileThumb file={file} className="size-10 rounded-md" />
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-sm font-medium">
					{file.name}
				</span>
				<span className="truncate text-xs text-muted-foreground">
					{t("dashboard.files.details", {
						kind: t(`dashboard.storage.kinds.${file.kind}`),
						size: formatBytes(file.size),
					})}
				</span>
			</span>
			<FileActions file={file} onEdit={onEdit} onDelete={onDelete} />
		</li>
	);
};

export default FileRow;
