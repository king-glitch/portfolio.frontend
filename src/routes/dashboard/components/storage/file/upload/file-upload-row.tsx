import React from "react";
import { RiCheckLine, RiErrorWarningLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { useObjectUrl } from "@/hooks/use-object-url";
import { formatBytes } from "@/lib/storage/files";
import { UploadStatus } from "@/types/ui";

interface FileUploadRowProps {
	file: File;
	status: UploadStatus;
	/** Translated reason when `status` is failed. */
	error?: string;
}

/** One chosen file: preview (pictures), name, size and where its upload stands. */
export const FileUploadRow: React.FC<FileUploadRowProps> = ({
	file,
	status,
	error,
}) => {
	const { t } = useTranslation();
	const url = useObjectUrl(file.type.startsWith("image/") ? file : undefined);
	return (
		<li className="flex items-center gap-2 rounded-lg border p-2">
			<span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted">
				{url ? (
					<img src={url} alt="" className="size-full object-cover" />
				) : null}
			</span>
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-sm">{file.name}</span>
				<span className="truncate text-xs text-muted-foreground">
					{status === UploadStatus.Failed
						? error
						: formatBytes(file.size)}
				</span>
			</span>
			{status === UploadStatus.Pending ? (
				<Spinner
					aria-label={t("dashboard.storage.upload.rows.pending")}
				/>
			) : null}
			{status === UploadStatus.Done ? (
				<RiCheckLine
					aria-label={t("dashboard.storage.upload.rows.done")}
					className="size-4 text-muted-foreground"
				/>
			) : null}
			{status === UploadStatus.Failed ? (
				<RiErrorWarningLine
					aria-label={t("dashboard.storage.upload.rows.failed")}
					className="size-4 text-destructive"
				/>
			) : null}
		</li>
	);
};

export default FileUploadRow;
