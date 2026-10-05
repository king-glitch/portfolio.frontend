import React from "react";
import { useTranslation } from "react-i18next";
import type { AdminFrame } from "@/api/types/admin/gallery";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FrameForm } from "@/routes/dashboard/gallery/components/frame/frame-form";

interface FrameDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Undefined = add. */
	frame: AdminFrame | undefined;
	/** Changes on every opening: the form remounts, so it always starts clean. */
	session: number;
}

/** Add or edit dialog of the gallery. */
export const FrameDialog: React.FC<FrameDialogProps> = ({
	open,
	onOpenChange,
	frame,
	session,
}) => {
	const { t } = useTranslation();
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{frame
							? t("dashboard.gallery.edit.title")
							: t("dashboard.gallery.upload.title")}
					</DialogTitle>
					<DialogDescription>
						{frame
							? t("dashboard.gallery.edit.description")
							: t("dashboard.gallery.upload.description")}
					</DialogDescription>
				</DialogHeader>
				<FrameForm
					key={session}
					frame={frame}
					onDone={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default FrameDialog;
