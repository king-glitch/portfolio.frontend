import { UnsavedChangesDialog } from "@/components/common/forms/unsaved-changes-dialog";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAddLine } from "@remixicon/react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSaveSettings } from "@/api/hooks/admin/settings/use-save-settings";
import type { Setting } from "@/api/types/admin/setting";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { CategoryRow } from "@/routes/dashboard/settings/categories/components/category-row";
import {
	categoriesFormSchema,
	toCategoriesUpdates,
	toCategoriesValues,
	type CategoriesValues,
} from "@/routes/dashboard/settings/categories/components/categories-form-schema";
import { SettingsSaveButton } from "@/routes/dashboard/settings/components/settings-save-button";

interface CategoriesFormProps {
	settings: Setting[];
}

/** Project categories: slug (kept once saved) and label, in the order the site lists them. */
export const CategoriesForm: React.FC<CategoriesFormProps> = ({ settings }) => {
	const { t } = useTranslation();
	const save = useSaveSettings();
	const schema = useMemo(() => categoriesFormSchema(t), [t]);
	const form = useForm<CategoriesValues>({
		resolver: zodResolver(schema),
		defaultValues: toCategoriesValues(settings),
	});
	const { blocker } = useUnsavedGuard(form.formState.isDirty);
	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: "categories",
	});
	const listError =
		form.formState.errors.categories?.root?.message ??
		form.formState.errors.categories?.message;

	const onSubmit = form.handleSubmit((values) =>
		save.mutate(toCategoriesUpdates(values), {
			onSuccess: () => {
				// the saved slugs are read-only from now on
				form.reset({
					categories: values.categories.map((row) => ({
						...row,
						saved: true,
					})),
				});
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
					<Field data-invalid={Boolean(listError)}>
						<FieldLabel>
							{t("dashboard.settings.categories.label")}
						</FieldLabel>
						<FieldDescription>
							{t("dashboard.settings.categories.hint")}
						</FieldDescription>
						{fields.map((row, index) => (
							<CategoryRow
								key={row.id}
								control={form.control}
								setValue={form.setValue}
								index={index}
								total={fields.length}
								saved={row.saved}
								name={row.label}
								onMove={(delta) => move(index, index + delta)}
								onRemove={() => remove(index)}
							/>
						))}
						<Button
							variant="outline"
							className="self-start"
							onClick={() =>
								append({ slug: "", label: "", saved: false })
							}
						>
							<RiAddLine data-icon="inline-start" />
							{t("dashboard.settings.categories.add")}
						</Button>
						{listError ? (
							<FieldError>{listError}</FieldError>
						) : null}
					</Field>
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

export default CategoriesForm;
