import React from "react";
import { useTranslation } from "react-i18next";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface DeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** What is being deleted; the caller keeps it after close so the exit animation still reads it. */
	name: string | undefined;
	pending: boolean;
	onConfirm: () => void;
}

/** Confirm step of every delete. It stays open while the request is pending. */
export const DeleteDialog: React.FC<DeleteDialogProps> = ({
	open,
	onOpenChange,
	name,
	pending,
	onConfirm,
}) => {
	const { t } = useTranslation();
	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				if (!pending) onOpenChange(next);
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("dashboard.delete.title", { name })}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("dashboard.delete.description")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>
						{t("dashboard.delete.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={pending}
						onClick={onConfirm}
					>
						{pending ? <Spinner data-icon="inline-start" /> : null}
						{t("dashboard.delete.confirm")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteDialog;
