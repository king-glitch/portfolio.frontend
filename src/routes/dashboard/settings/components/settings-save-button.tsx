import React from "react";
import { useTranslation } from "react-i18next";
import { FormActions } from "@/components/common/forms/form-actions";
import { FormButton } from "@/components/common/buttons/form-button";
import { Spinner } from "@/components/ui/spinner";

interface SettingsSaveButtonProps {
	pending: boolean;
	/** Nothing changed since the last save: nothing to send. */
	clean: boolean;
}

/** Submit button of every settings form. */
export const SettingsSaveButton: React.FC<SettingsSaveButtonProps> = ({
	pending,
	clean,
}) => {
	const { t } = useTranslation();
	return (
		<FormActions dirty={!clean}>
			<FormButton type="submit" disabled={pending || clean}>
				{pending ? <Spinner data-icon="inline-start" /> : null}
				{t("dashboard.settings.save")}
			</FormButton>
		</FormActions>
	);
};

export default SettingsSaveButton;
