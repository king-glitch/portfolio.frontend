import React from "react";
import {
	RiDeleteBinLine,
	RiEditLine,
	RiExternalLinkLine,
	RiFileCopyLine,
	RiFolderLine,
	RiMoreLine,
	RiZoomInLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFrame } from "@/api/types/admin/gallery";
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

interface GalleryTableProps {
	frames: AdminFrame[];
	onZoom?: (frame: AdminFrame) => void;
	onEdit: (frame: AdminFrame) => void;
	onDelete: (frame: AdminFrame) => void;
}

interface ColumnDef {
	id: string;
	label: string;
	className?: string;
}

/** Structured table list of gallery frames with project links and tags. */
export const GalleryTable: React.FC<GalleryTableProps> = ({
	frames,
	onZoom,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();

	const copyUrl = async (frame: AdminFrame) => {
		try {
			await navigator.clipboard.writeText(frame.imageUrl);
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
			label: t("dashboard.gallery.table.columns.preview"),
			className: "w-16",
		},
		{
			id: "project",
			label: t("dashboard.gallery.table.columns.project"),
		},
		{
			id: "tags",
			label: t("dashboard.gallery.table.columns.tags"),
		},
		{
			id: "dimensions",
			label: t("dashboard.gallery.table.columns.dimensions"),
		},
		{
			id: "actions",
			label: t("dashboard.gallery.table.columns.actions"),
			className: "w-16 text-right",
		},
	];

	return (
		<div className="w-full overflow-hidden rounded-xl border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((col) => (
							<TableHead key={col.id} className={col.className}>
								{col.label}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{frames.map((frame) => {
						const name =
							frame.project?.name ??
							t("dashboard.gallery.card.untitled");
						const hasDimensions =
							frame.width > 0 && frame.height > 0;

						const cells = [
							{
								id: "project",
								node: (
									<div className="flex items-center gap-2">
										<Badge
											variant="secondary"
											className="gap-1"
										>
											<RiFolderLine className="size-3" />
											{name}
										</Badge>
									</div>
								),
							},
							{
								id: "tags",
								node: (
									<div className="flex flex-wrap gap-1">
										{frame.tags.map((tag) => (
											<Badge
												key={tag}
												variant="outline"
												className="text-[10px]"
											>
												{tag}
											</Badge>
										))}
									</div>
								),
							},
							{
								id: "dimensions",
								node: (
									<span className="font-mono text-xs text-muted-foreground">
										{hasDimensions
											? `${frame.width} × ${frame.height}`
											: "—"}
									</span>
								),
							},
						];

						return (
							<TableRow
								key={frame.id}
								className="group cursor-pointer hover:bg-muted/40"
								onClick={() => onZoom?.(frame)}
							>
								<TableCell className="p-2">
									<div className="relative size-12 overflow-hidden rounded-md border bg-muted/40">
										<img
											src={frame.imageUrl}
											alt={
												frame.alt ||
												t(
													"dashboard.gallery.card.alt",
													{ name },
												)
											}
											width={frame.width}
											height={frame.height}
											className="size-full object-cover"
										/>
									</div>
								</TableCell>
								{cells.map((cell) => (
									<TableCell key={cell.id}>
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
														{ name },
													)}
													className="size-7"
												/>
											}
										>
											<RiMoreLine />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											{onZoom ? (
												<DropdownMenuItem
													onClick={() =>
														onZoom(frame)
													}
												>
													<RiZoomInLine />
													{t(
														"dashboard.gallery.lightbox.zoom",
														{ name },
													)}
												</DropdownMenuItem>
											) : null}
											<DropdownMenuItem
												onClick={() =>
													void copyUrl(frame)
												}
											>
												<RiFileCopyLine />
												{t(
													"dashboard.files.copy.aria-label",
													{ name },
												)}
											</DropdownMenuItem>
											<DropdownMenuItem
												render={
													<a
														href={frame.imageUrl}
														target="_blank"
														rel="noreferrer"
													/>
												}
											>
												<RiExternalLinkLine />
												{t(
													"dashboard.files.open.aria-label",
													{ name },
												)}
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => onEdit(frame)}
											>
												<RiEditLine />
												{t(
													"dashboard.gallery.card.edit.aria-label",
													{ name },
												)}
											</DropdownMenuItem>
											<DropdownMenuItem
												variant="destructive"
												onClick={() => onDelete(frame)}
											>
												<RiDeleteBinLine />
												{t(
													"dashboard.gallery.card.delete.aria-label",
													{ name },
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

export default GalleryTable;
