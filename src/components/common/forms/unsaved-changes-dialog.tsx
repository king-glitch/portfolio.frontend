import React from "react";
import { useTranslation } from "react-i18next";
import type { Blocker } from "react-router";
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

interface UnsavedChangesDialogProps {
	/** From `useUnsavedGuard`. */
	blocker: Blocker;
}

/** "Discard changes?" step shown when navigation away from a dirty form is blocked. It holds no state of its own: the blocker is the state. */
export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
	blocker,
}) => {
	const { t } = useTranslation();
	return (
		<AlertDialog
			open={blocker.state === "blocked"}
			onOpenChange={(open) => {
				if (!open && blocker.state === "blocked") blocker.reset();
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("components.common.forms.unsaved.title")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("components.common.forms.unsaved.description")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						{t("components.common.forms.unsaved.stay")}
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={() => {
							if (blocker.state === "blocked") blocker.proceed();
						}}
					>
						{t("components.common.forms.unsaved.discard")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default UnsavedChangesDialog;
