import React from "react";
import {
	RiCheckLine,
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

interface FrameCardProps {
	frame: AdminFrame;
	onZoom?: (frame: AdminFrame) => void;
	onEdit: (frame: AdminFrame) => void;
	onDelete: (frame: AdminFrame) => void;
}

/** One picture with its project, tags, zoom preview and action dropdown. */
export const FrameCard: React.FC<FrameCardProps> = ({
	frame,
	onZoom,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();
	const [copied, setCopied] = React.useState(false);

	const name = frame.project?.name ?? t("dashboard.gallery.card.untitled");

	const copyUrl = async (event: React.MouseEvent) => {
		event.stopPropagation();
		try {
			await navigator.clipboard.writeText(frame.imageUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
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

	const hasDimensions = frame.width > 0 && frame.height > 0;

	return (
		<Card
			size="sm"
			className="group relative overflow-hidden pt-0 transition-all hover:border-foreground/25 hover:shadow-md"
			onClick={() => onZoom?.(frame)}
		>
			<div className="relative aspect-4/3 w-full cursor-pointer overflow-hidden bg-muted/40">
				<img
					src={frame.imageUrl}
					alt={frame.alt || t("dashboard.gallery.card.alt", { name })}
					width={frame.width}
					height={frame.height}
					loading="lazy"
					decoding="async"
					className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<div className="absolute top-2 left-2 flex flex-wrap gap-1">
					<Badge
						variant="secondary"
						className="bg-background/80 text-[10px] backdrop-blur-xs"
					>
						<RiFolderLine data-icon="inline-start" />
						{name}
					</Badge>
					{hasDimensions ? (
						<span className="rounded-sm bg-background/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-xs">
							{frame.width}×{frame.height}
						</span>
					) : null}
				</div>
				<div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
					<Button
						variant="secondary"
						size="icon-xs"
						aria-label={t("dashboard.files.copy.aria-label", {
							name,
						})}
						className="size-7 shadow-xs backdrop-blur-xs"
						onClick={(event) => void copyUrl(event)}
					>
						{copied ? <RiCheckLine /> : <RiFileCopyLine />}
					</Button>
					{onZoom ? (
						<Button
							variant="secondary"
							size="icon-xs"
							aria-label={t("dashboard.gallery.lightbox.zoom", {
								name,
							})}
							className="size-7 shadow-xs backdrop-blur-xs"
							onClick={(event) => {
								event.stopPropagation();
								onZoom(frame);
							}}
						>
							<RiZoomInLine />
						</Button>
					) : null}
				</div>
			</div>
			<CardContent className="flex flex-col gap-2 p-3">
				<div className="flex items-center justify-between gap-1">
					<span className="truncate font-heading text-sm font-medium text-foreground">
						{name}
					</span>
				</div>
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
			</CardContent>
			<CardFooter
				className="justify-end border-t p-2"
				onClick={(event) => event.stopPropagation()}
			>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon-xs"
								aria-label={t("dashboard.row.edit.aria-label", {
									name,
								})}
								className="size-7"
							/>
						}
					>
						<RiMoreLine />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{onZoom ? (
							<DropdownMenuItem onClick={() => onZoom(frame)}>
								<RiZoomInLine />
								{t("dashboard.gallery.lightbox.zoom", { name })}
							</DropdownMenuItem>
						) : null}
						<DropdownMenuItem
							onClick={(event) => void copyUrl(event)}
						>
							<RiFileCopyLine />
							{t("dashboard.files.copy.aria-label", { name })}
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
							{t("dashboard.files.open.aria-label", { name })}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => onEdit(frame)}>
							<RiEditLine />
							{t("dashboard.gallery.card.edit.aria-label", {
								name,
							})}
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => onDelete(frame)}
						>
							<RiDeleteBinLine />
							{t("dashboard.gallery.card.delete.aria-label", {
								name,
							})}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardFooter>
		</Card>
	);
};

export default FrameCard;
