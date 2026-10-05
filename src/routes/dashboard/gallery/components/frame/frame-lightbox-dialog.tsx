import React from "react";
import {
	RiArrowLeftSLine,
	RiArrowRightSLine,
	RiCheckLine,
	RiDeleteBinLine,
	RiEditLine,
	RiExternalLinkLine,
	RiFileCopyLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { AdminFrame } from "@/api/types/admin/gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

interface FrameLightboxDialogProps {
	frame: AdminFrame | undefined;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onStep?: (delta: number) => void;
	onEdit: (frame: AdminFrame) => void;
	onDelete: (frame: AdminFrame) => void;
}

/** Full-resolution lightbox preview dialog for gallery frames with compact header actions. */
export const FrameLightboxDialog: React.FC<FrameLightboxDialogProps> = ({
	frame,
	open,
	onOpenChange,
	onStep,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();
	const [copied, setCopied] = React.useState(false);

	const name = frame?.project?.name ?? t("dashboard.gallery.card.untitled");

	const copyUrl = async () => {
		if (!frame) return;
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl p-0 sm:max-w-4xl">
				<DialogHeader className="p-3 pb-2">
					<div className="flex items-center justify-between gap-3 pr-7">
						<div className="flex min-w-0 flex-col gap-0.5">
							<DialogTitle className="truncate text-sm font-semibold">
								{name}
							</DialogTitle>
							<DialogDescription className="font-mono text-[11px]">
								{frame
									? t(
											"dashboard.gallery.lightbox.dimensions",
											{
												width: frame.width,
												height: frame.height,
											},
										)
									: ""}
							</DialogDescription>
						</div>
						{frame ? (
							<div className="flex shrink-0 items-center gap-1">
								<Button
									size="icon-sm"
									variant="outline"
									aria-label={t(
										"dashboard.files.copy.aria-label",
										{ name },
									)}
									onClick={() => void copyUrl()}
								>
									{copied ? (
										<RiCheckLine />
									) : (
										<RiFileCopyLine />
									)}
								</Button>
								<Button
									size="icon-sm"
									variant="outline"
									aria-label={t(
										"dashboard.files.open.aria-label",
										{ name },
									)}
									nativeButton={false}
									render={
										<a
											href={frame.imageUrl}
											target="_blank"
											rel="noreferrer"
										/>
									}
								>
									<RiExternalLinkLine />
								</Button>
								<Button
									size="icon-sm"
									variant="outline"
									aria-label={t(
										"dashboard.gallery.card.edit.aria-label",
										{ name },
									)}
									onClick={() => {
										onOpenChange(false);
										onEdit(frame);
									}}
								>
									<RiEditLine />
								</Button>
								<Button
									size="icon-sm"
									variant="outline"
									aria-label={t(
										"dashboard.gallery.card.delete.aria-label",
										{ name },
									)}
									onClick={() => {
										onOpenChange(false);
										onDelete(frame);
									}}
								>
									<RiDeleteBinLine />
								</Button>
							</div>
						) : null}
					</div>
				</DialogHeader>

				{frame ? (
					<div className="relative flex max-h-[75vh] items-center justify-center overflow-hidden bg-black/90 p-2">
						<img
							src={frame.imageUrl}
							alt={
								frame.alt ||
								t("dashboard.gallery.card.alt", { name })
							}
							width={frame.width}
							height={frame.height}
							className="max-h-[70vh] w-auto rounded-md object-contain"
						/>
						{onStep ? (
							<div className="pointer-events-none absolute inset-x-2 flex items-center justify-between">
								<Button
									variant="secondary"
									size="icon"
									aria-label={t("dashboard.form.cancel")}
									className="pointer-events-auto size-8 rounded-full bg-background/80 shadow-md backdrop-blur-xs"
									onClick={() => onStep(-1)}
								>
									<RiArrowLeftSLine />
								</Button>
								<Button
									variant="secondary"
									size="icon"
									aria-label={t("dashboard.form.cancel")}
									className="pointer-events-auto size-8 rounded-full bg-background/80 shadow-md backdrop-blur-xs"
									onClick={() => onStep(1)}
								>
									<RiArrowRightSLine />
								</Button>
							</div>
						) : null}
					</div>
				) : null}

				{frame && frame.tags.length > 0 ? (
					<div className="flex flex-wrap items-center gap-1 p-2.5 pt-2">
						{frame.tags.map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="text-[10px]"
							>
								{tag}
							</Badge>
						))}
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	);
};

export default FrameLightboxDialog;
