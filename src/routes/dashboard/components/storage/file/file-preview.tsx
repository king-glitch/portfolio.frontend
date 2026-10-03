import React from "react";
import { RiCloseLine, RiExternalLinkLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { Button } from "@/components/ui/button";
import { formatBytes, isExternal } from "@/lib/storage/files";
import { FileKindIcon } from "@/routes/dashboard/components/storage/file/file-kind-icon";

interface FilePreviewProps {
	file: AdminFile;
	onClear: () => void;
}

/** What a file field currently holds: the picture, player or name, with open and remove buttons. */
export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClear }) => {
	const { t } = useTranslation();
	const name = isExternal(file)
		? t("dashboard.storage.select.external.label")
		: file.name;

	const renderMedia = () => {
		switch (file.kind) {
			case FileKind.Image:
				return (
					<img
						src={file.url}
						alt={file.alt}
						className="max-h-48 rounded-md bg-muted object-contain"
					/>
				);
			case FileKind.Video:
				return (
					<video
						src={file.url}
						controls
						preload="metadata"
						className="max-h-48 rounded-md bg-muted"
					/>
				);
			case FileKind.Audio:
				return <audio src={file.url} controls className="w-full" />;
			default:
				return (
					<span className="flex items-center gap-2 text-sm">
						<FileKindIcon kind={file.kind} className="size-4" />
						<span className="truncate">{name}</span>
					</span>
				);
		}
	};

	return (
		<div className="flex items-start justify-between gap-2 rounded-lg border p-2">
			<div className="flex min-w-0 flex-col gap-1">
				{renderMedia()}
				<span className="truncate text-xs text-muted-foreground">
					{isExternal(file) ? file.url : formatBytes(file.size)}
				</span>
			</div>
			<div className="flex shrink-0 gap-1">
				<Button
					variant="ghost"
					size="icon"
					aria-label={t("dashboard.storage.preview.open.aria-label", {
						name,
					})}
					nativeButton={false}
					render={
						<a href={file.url} target="_blank" rel="noreferrer" />
					}
				>
					<RiExternalLinkLine />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					aria-label={t(
						"dashboard.storage.preview.clear.aria-label",
						{ name },
					)}
					onClick={onClear}
				>
					<RiCloseLine />
				</Button>
			</div>
		</div>
	);
};

export default FilePreview;
