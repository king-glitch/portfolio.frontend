import React from "react";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFrame } from "@/api/types/admin/gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface FrameCardProps {
	frame: AdminFrame;
	onEdit: (frame: AdminFrame) => void;
	onDelete: (frame: AdminFrame) => void;
}

/** One picture with its project, tags and edit/delete. */
export const FrameCard: React.FC<FrameCardProps> = ({
	frame,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();
	const name = frame.project?.name ?? t("dashboard.gallery.card.untitled");
	return (
		<Card size="sm" className="overflow-hidden pt-0">
			<img
				src={frame.imageUrl}
				alt={frame.alt || t("dashboard.gallery.card.alt", { name })}
				width={frame.width}
				height={frame.height}
				loading="lazy"
				decoding="async"
				className="aspect-4/3 w-full bg-muted object-cover"
			/>
			<CardContent className="flex flex-col gap-2">
				<span className="truncate text-sm font-medium">{name}</span>
				<div className="flex flex-wrap gap-1">
					{frame.tags.map((tag) => (
						<Badge key={tag} variant="secondary">
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="justify-end gap-1">
				<Button
					variant="ghost"
					size="icon"
					aria-label={t("dashboard.gallery.card.edit.aria-label", {
						name,
					})}
					onClick={() => onEdit(frame)}
				>
					<RiEditLine />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					aria-label={t("dashboard.gallery.card.delete.aria-label", {
						name,
					})}
					onClick={() => onDelete(frame)}
				>
					<RiDeleteBinLine />
				</Button>
			</CardFooter>
		</Card>
	);
};

export default FrameCard;
