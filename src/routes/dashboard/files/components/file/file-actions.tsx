import React from "react";
import {
	RiDeleteBinLine,
	RiEditLine,
	RiExternalLinkLine,
	RiFileCopyLine,
	type RemixiconComponentType,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface FileActionsProps {
	file: AdminFile;
	onEdit: (file: AdminFile) => void;
	onDelete: (file: AdminFile) => void;
}

interface FileAction {
	id: string;
	icon: RemixiconComponentType;
	label: string;
	href?: string;
	onClick?: () => void;
}

/** Copy URL, open, rename and delete buttons of one file. */
export const FileActions: React.FC<FileActionsProps> = ({
	file,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();
	const name = file.name;
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(file.url);
			toast.add({
				type: "success",
				title: t("dashboard.files.copy.success"),
			});
		} catch {
			toast.add({
				type: "error",
				title: t("dashboard.files.copy.error"),
			});
		}
	};
	const actions: FileAction[] = [
		{
			id: "copy",
			icon: RiFileCopyLine,
			label: t("dashboard.files.copy.aria-label", { name }),
			onClick: () => void copy(),
		},
		{
			id: "open",
			icon: RiExternalLinkLine,
			label: t("dashboard.files.open.aria-label", { name }),
			href: file.url,
		},
		{
			id: "edit",
			icon: RiEditLine,
			label: t("dashboard.files.edit.aria-label", { name }),
			onClick: () => onEdit(file),
		},
		{
			id: "delete",
			icon: RiDeleteBinLine,
			label: t("dashboard.files.delete.aria-label", { name }),
			onClick: () => onDelete(file),
		},
	];
	return (
		<div className="flex gap-1">
			{actions.map(({ id, icon: Icon, label, href, onClick }) => (
				<Button
					key={id}
					variant="ghost"
					size="icon"
					aria-label={label}
					nativeButton={href === undefined}
					render={
						href ? (
							<a href={href} target="_blank" rel="noreferrer" />
						) : undefined
					}
					onClick={onClick}
				>
					<Icon />
				</Button>
			))}
		</div>
	);
};

export default FileActions;
