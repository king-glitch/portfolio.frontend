import React from "react";
import {
	RiDeleteBinLine,
	RiEditLine,
	RiExternalLinkLine,
	RiEyeLine,
	RiFileCopyLine,
	RiMoreLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFile } from "@/api/types/admin/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { formatBytes } from "@/lib/storage/files";
import { FileThumb } from "@/routes/dashboard/components/storage/file/file-thumb";

interface FilesTableProps {
	files: AdminFile[];
	onInspect: (file: AdminFile) => void;
	onEdit: (file: AdminFile) => void;
	onDelete: (file: AdminFile) => void;
}

interface ColumnDef {
	id: string;
	label: string;
	className?: string;
}

/** Structured table list of stored files with sortable metadata. */
export const FilesTable: React.FC<FilesTableProps> = ({
	files,
	onInspect,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();

	const copyUrl = async (file: AdminFile) => {
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

	const columns: ColumnDef[] = [
		{
			id: "preview",
			label: t("dashboard.files.table.columns.file"),
			className: "w-12",
		},
		{
			id: "name",
			label: t("dashboard.files.form.name.label"),
		},
		{
			id: "kind",
			label: t("dashboard.files.table.columns.kind"),
		},
		{
			id: "dimensions",
			label: t("dashboard.files.table.columns.dimensions"),
		},
		{
			id: "size",
			label: t("dashboard.files.table.columns.size"),
		},
		{
			id: "date",
			label: t("dashboard.files.table.columns.date"),
		},
		{
			id: "actions",
			label: t("dashboard.files.table.columns.actions"),
			className: "w-16 text-right",
		},
	];

	return (
		<div className="w-full overflow-hidden rounded-xl border bg-card/60 shadow-xs">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.id}
								className={column.className}
							>
								{column.label}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{files.map((file) => {
						const hasDimensions = file.width > 0 && file.height > 0;
						const cellData = [
							{
								id: "kind",
								node: (
									<Badge variant="secondary">
										{t(
											`dashboard.storage.kinds.${file.kind}`,
										)}
									</Badge>
								),
								className: "",
							},
							{
								id: "dimensions",
								node: (
									<span className="font-mono text-xs text-muted-foreground">
										{hasDimensions
											? `${file.width} × ${file.height}`
											: "—"}
									</span>
								),
								className: "",
							},
							{
								id: "size",
								node: (
									<span className="text-xs text-muted-foreground">
										{formatBytes(file.size)}
									</span>
								),
								className: "",
							},
							{
								id: "date",
								node: (
									<span className="text-xs text-muted-foreground">
										{file.createdAt
											? new Date(
													file.createdAt,
												).toLocaleDateString()
											: "—"}
									</span>
								),
								className: "",
							},
						];

						return (
							<TableRow
								key={file.id}
								className="group cursor-pointer hover:bg-muted/40"
								onClick={() => onInspect(file)}
							>
								<TableCell className="p-2">
									<FileThumb
										file={file}
										className="size-10 rounded-md border"
									/>
								</TableCell>
								<TableCell className="font-medium">
									<div className="flex flex-col">
										<span className="truncate font-medium text-foreground">
											{file.name}
										</span>
										{file.alt ? (
											<span className="truncate text-xs text-muted-foreground">
												{file.alt}
											</span>
										) : null}
									</div>
								</TableCell>
								{cellData.map((cell) => (
									<TableCell
										key={cell.id}
										className={cell.className}
									>
										{cell.node}
									</TableCell>
								))}
								<TableCell
									className="text-right"
									onClick={(event) => event.stopPropagation()}
								>
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													variant="ghost"
													size="icon-xs"
													aria-label={t(
														"dashboard.row.edit.aria-label",
														{ name: file.name },
													)}
												/>
											}
										>
											<RiMoreLine />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => onInspect(file)}
											>
												<RiEyeLine />
												{t(
													"dashboard.files.detail.inspect",
													{ name: file.name },
												)}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													void copyUrl(file)
												}
											>
												<RiFileCopyLine />
												{t(
													"dashboard.files.copy.aria-label",
													{ name: file.name },
												)}
											</DropdownMenuItem>
											<DropdownMenuItem
												render={
													<a
														href={file.url}
														target="_blank"
														rel="noreferrer"
													/>
												}
											>
												<RiExternalLinkLine />
												{t(
													"dashboard.files.open.aria-label",
													{ name: file.name },
												)}
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => onEdit(file)}
											>
												<RiEditLine />
												{t(
													"dashboard.files.edit.aria-label",
													{ name: file.name },
												)}
											</DropdownMenuItem>
											<DropdownMenuItem
												variant="destructive"
												onClick={() => onDelete(file)}
											>
												<RiDeleteBinLine />
												{t(
													"dashboard.files.delete.aria-label",
													{ name: file.name },
												)}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default FilesTable;
