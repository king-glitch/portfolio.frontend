import React from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ContentStatus } from "@/api/types/admin/enums";
import { FormButton } from "@/components/common/buttons/form-button";
import { FormActions } from "@/components/common/forms/form-actions";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/routes/dashboard/components/status/status-badge";

interface StatusAction {
	/** Status the item is saved with when the button is pressed. */
	status: ContentStatus;
	labelKey: ParseKeys;
	outline: boolean;
}

/** A draft saves as a draft or goes live; a published item saves in place or goes back to draft. The primary action is last. */
const ACTIONS: Record<ContentStatus, StatusAction[]> = {
	[ContentStatus.Draft]: [
		{
			status: ContentStatus.Draft,
			labelKey: "dashboard.form.actions.save-draft",
			outline: true,
		},
		{
			status: ContentStatus.Published,
			labelKey: "dashboard.form.actions.publish",
			outline: false,
		},
	],
	[ContentStatus.Published]: [
		{
			status: ContentStatus.Draft,
			labelKey: "dashboard.form.actions.unpublish",
			outline: true,
		},
		{
			status: ContentStatus.Published,
			labelKey: "dashboard.form.actions.save",
			outline: false,
		},
	],
};

interface StatusActionsProps {
	/** Status the item has now (a new item is a draft). */
	status: ContentStatus;
	dirty: boolean;
	pending: boolean;
	/** The status being saved while `pending`: its button shows the spinner. */
	pendingStatus: ContentStatus | undefined;
	cancelTo: string;
	/** Public page of a published item. */
	viewTo?: string;
	onSave: (status: ContentStatus) => void;
}

/** Sticky action bar of the project and note forms: the status badge, then the save buttons that go with it. */
export const StatusActions: React.FC<StatusActionsProps> = ({
	status,
	dirty,
	pending,
	pendingStatus,
	cancelTo,
	viewTo,
	onSave,
}) => {
	const { t } = useTranslation();
	return (
		<FormActions dirty={dirty}>
			<StatusBadge status={status} />
			<FormButton
				variant="ghost"
				disabled={pending}
				nativeButton={false}
				render={<Link to={cancelTo} />}
			>
				{t("dashboard.form.cancel")}
			</FormButton>
			{status === ContentStatus.Published && viewTo ? (
				<FormButton
					variant="ghost"
					nativeButton={false}
					render={<Link to={viewTo} target="_blank" />}
				>
					{t("dashboard.form.actions.view")}
				</FormButton>
			) : null}
			<div className="ml-auto flex gap-2">
				{ACTIONS[status].map((action) => (
					<FormButton
						key={action.status}
						variant={action.outline ? "outline" : "default"}
						disabled={pending}
						onClick={() => onSave(action.status)}
					>
						{pending && pendingStatus === action.status ? (
							<Spinner data-icon="inline-start" />
						) : null}
						{t(action.labelKey)}
					</FormButton>
				))}
			</div>
		</FormActions>
	);
};

export default StatusActions;
