import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSaveSettings } from "@/api/hooks/admin/settings/use-save-settings";
import type { Setting } from "@/api/types/admin/setting";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form-textarea-field";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { SettingsSaveButton } from "@/routes/dashboard/settings/components/settings-save-button";
import {
	seoFormSchema,
	toSeoUpdates,
	toSeoValues,
	type SeoValues,
} from "@/routes/dashboard/settings/seo/components/seo-form-schema";

interface SeoFormProps {
	settings: Setting[];
}

/** Search and sharing: description, keywords, preview image. */
export const SeoForm: React.FC<SeoFormProps> = ({ settings }) => {
	const { t } = useTranslation();
	const save = useSaveSettings();
	const schema = useMemo(() => seoFormSchema(t), [t]);
	const form = useForm<SeoValues>({
		resolver: zodResolver(schema),
		defaultValues: toSeoValues(settings),
	});

	const onSubmit = form.handleSubmit((values) =>
		save.mutate(toSeoUpdates(values), {
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
				<FormTextareaField
					control={form.control}
					name="seoDescription"
					label={t("dashboard.settings.seo.description.label")}
					rows={3}
				/>
				<FormTextField
					control={form.control}
					name="seoKeywords"
					label={t("dashboard.settings.seo.keywords.label")}
					description={t("dashboard.form.list.hint")}
				/>
				<FormTextField
					control={form.control}
					name="socialPreviewImage"
					label={t("dashboard.settings.seo.image.label")}
					description={t("dashboard.settings.seo.image.hint")}
					type="url"
				/>
				<SettingsSaveButton
					pending={save.isPending}
					clean={!form.formState.isDirty}
				/>
			</FieldGroup>
		</form>
	);
};

export default SeoForm;
