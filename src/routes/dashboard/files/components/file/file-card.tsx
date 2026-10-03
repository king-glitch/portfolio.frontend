import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatBytes } from "@/lib/storage/files";
import { FileActions } from "@/routes/dashboard/files/components/file/file-actions";
import { FileThumb } from "@/routes/dashboard/components/storage/file/file-thumb";

interface FileCardProps {
	file: AdminFile;
	onEdit: (file: AdminFile) => void;
	onDelete: (file: AdminFile) => void;
}

/** A picture or video with its name, size and actions. */
export const FileCard: React.FC<FileCardProps> = ({
	file,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();
	return (
		<Card size="sm" className="overflow-hidden pt-0">
			<FileThumb file={file} className="aspect-4/3 w-full" />
			<CardContent className="flex flex-col gap-1">
				<span className="truncate text-sm font-medium">
					{file.name}
				</span>
				<span className="truncate text-xs text-muted-foreground">
					{t("dashboard.files.details", {
						kind: t(`dashboard.storage.kinds.${file.kind}`),
						size: formatBytes(file.size),
					})}
				</span>
			</CardContent>
			<CardFooter className="justify-end">
				<FileActions file={file} onEdit={onEdit} onDelete={onDelete} />
			</CardFooter>
		</Card>
	);
};

export default FileCard;
