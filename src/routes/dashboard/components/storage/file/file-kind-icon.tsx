import React from "react";
import {
	RiFileLine,
	RiFileTextLine,
	RiFileZipLine,
	RiImageLine,
	RiMusicLine,
	RiVideoLine,
	type RemixiconComponentType,
} from "@remixicon/react";
import { FileKind } from "@/api/types/admin/storage";

const icons: Record<FileKind, RemixiconComponentType> = {
	[FileKind.Image]: RiImageLine,
	[FileKind.Video]: RiVideoLine,
	[FileKind.Audio]: RiMusicLine,
	[FileKind.Document]: RiFileTextLine,
	[FileKind.Archive]: RiFileZipLine,
	[FileKind.Other]: RiFileLine,
};

interface FileKindIconProps {
	kind: FileKind;
	className?: string;
}

/** The icon of a file kind. */
export const FileKindIcon: React.FC<FileKindIconProps> = ({
	kind,
	className,
}) => {
	const Icon = icons[kind];
	return <Icon aria-hidden className={className} />;
};

export default FileKindIcon;
