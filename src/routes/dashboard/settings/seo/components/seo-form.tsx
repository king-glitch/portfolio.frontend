import { UnsavedChangesDialog } from "@/components/common/forms/unsaved-changes-dialog";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FileKind } from "@/api/types/admin/storage";
import { useSaveSettings } from "@/api/hooks/admin/settings/use-save-settings";
import type { Setting } from "@/api/types/admin/setting";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { FormTextareaField } from "@/components/common/fields/form/form-textarea-field";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { FileSelectField } from "@/routes/dashboard/components/storage/file/select/file-select-field";
import { SettingsSaveButton } from "@/routes/dashboard/settings/components/settings-save-button";
import {
	seoFormSchema,
	toSeoUpdates,
	toSeoValues,
	type SeoValues,
} from "@/routes/dashboard/settings/seo/components/seo-form-schema";
import { FileValueKey } from "@/types/ui";

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
	const { blocker } = useUnsavedGuard(form.formState.isDirty);

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
		<>
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
					<Controller
						control={form.control}
						name="socialPreviewImage"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									{t("dashboard.settings.seo.image.label")}
								</FieldLabel>
								<FileSelectField
									id={field.name}
									accept={[FileKind.Image]}
									by={FileValueKey.Url}
									value={field.value}
									onChange={field.onChange}
									invalid={fieldState.invalid}
								/>
								<FieldDescription>
									{t("dashboard.settings.seo.image.hint")}
								</FieldDescription>
								{fieldState.invalid ? (
									<FieldError errors={[fieldState.error]} />
								) : null}
							</Field>
						)}
					/>
					<SettingsSaveButton
						pending={save.isPending}
						clean={!form.formState.isDirty}
					/>
				</FieldGroup>
			</form>
			<UnsavedChangesDialog blocker={blocker} />
		</>
	);
};

export default SeoForm;
