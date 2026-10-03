import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSaveSettings } from "@/api/hooks/admin/settings/use-save-settings";
import { ThemeDefault, type Setting } from "@/api/types/admin/setting";
import { FormSelectField } from "@/components/common/fields/form-select-field";
import { FormSwitchField } from "@/components/common/fields/form-switch-field";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { SettingsSaveButton } from "@/routes/dashboard/settings/components/settings-save-button";
import { FeatureToggles } from "@/routes/dashboard/settings/general/components/feature-toggles";
import {
	generalFormSchema,
	toGeneralUpdates,
	toGeneralValues,
	type GeneralValues,
} from "@/routes/dashboard/settings/general/components/general-form-schema";

interface GeneralFormProps {
	settings: Setting[];
}

/** Site title, default theme, maintenance mode and feature flags: one save, one request. */
export const GeneralForm: React.FC<GeneralFormProps> = ({ settings }) => {
	const { t } = useTranslation();
	const save = useSaveSettings();
	const schema = useMemo(() => generalFormSchema(t), [t]);
	const form = useForm<GeneralValues>({
		resolver: zodResolver(schema),
		defaultValues: toGeneralValues(settings),
	});
	const themes = Object.values(ThemeDefault).map((value) => ({
		value,
		label: t(`dashboard.settings.general.theme.options.${value}`),
	}));

	const onSubmit = form.handleSubmit((values) =>
		save.mutate(toGeneralUpdates(values), {
			onSuccess: () => {
				form.reset(values);
				toast.add({
					type: "success",
					title: t("dashboard.settings.saved"),
				});
			},
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit} className="max-w-3xl">
			<FieldGroup>
				<FormTextField
					control={form.control}
					name="siteTitle"
					label={t("dashboard.settings.general.title.label")}
				/>
				<FormSelectField
					control={form.control}
					name="themeDefault"
					label={t("dashboard.settings.general.theme.label")}
					description={t("dashboard.settings.general.theme.hint")}
					options={themes}
				/>
				<FormSwitchField
					control={form.control}
					name="maintenanceMode"
					label={t("dashboard.settings.general.maintenance.label")}
					description={t(
						"dashboard.settings.general.maintenance.hint",
					)}
				/>
				<FeatureToggles control={form.control} />
				<SettingsSaveButton
					pending={save.isPending}
					clean={!form.formState.isDirty}
				/>
			</FieldGroup>
		</form>
	);
};

export default GeneralForm;
