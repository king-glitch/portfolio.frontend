import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import { ComboboxItem } from "@/components/ui/combobox";
import { formatBytes, isExternal } from "@/lib/storage/files";
import { FileThumb } from "@/routes/dashboard/components/storage/file/file-thumb";

interface FileSelectItemProps {
	file: AdminFile;
}

/** One option of the file picker: thumbnail, name and size (the URL for an external value). */
export const FileSelectItem: React.FC<FileSelectItemProps> = ({ file }) => {
	const { t } = useTranslation();
	const external = isExternal(file);
	return (
		<ComboboxItem value={file} className="py-1.5">
			<FileThumb file={file} className="size-8 rounded-sm" />
			<span className="flex min-w-0 flex-col">
				<span className="truncate">
					{external
						? t("dashboard.storage.select.external.label")
						: file.name}
				</span>
				<span className="truncate text-xs text-muted-foreground">
					{external ? file.url : formatBytes(file.size)}
				</span>
			</span>
		</ComboboxItem>
	);
};

export default FileSelectItem;
