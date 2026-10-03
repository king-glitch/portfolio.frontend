import React from "react";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { FileKindIcon } from "@/routes/dashboard/components/storage/file/file-kind-icon";
import { cn } from "@/lib/utils";

interface FileThumbProps {
	file: AdminFile;
	/** Size and shape; the thumbnail fills it. */
	className?: string;
}

/** Picture or video poster of a file, else its kind icon, in a muted box. */
export const FileThumb: React.FC<FileThumbProps> = ({ file, className }) => {
	const frame = cn(
		"flex shrink-0 items-center justify-center overflow-hidden bg-muted text-muted-foreground",
		className,
	);
	if (file.kind === FileKind.Image)
		return (
			<span className={frame}>
				<img
					src={file.url}
					alt=""
					loading="lazy"
					decoding="async"
					className="size-full object-cover"
				/>
			</span>
		);
	if (file.kind === FileKind.Video)
		return (
			<span className={frame}>
				<video
					src={file.url}
					preload="metadata"
					muted
					aria-hidden
					className="size-full object-cover"
				/>
			</span>
		);
	return (
		<span className={frame}>
			<FileKindIcon kind={file.kind} className="size-1/2" />
		</span>
	);
};

export default FileThumb;
