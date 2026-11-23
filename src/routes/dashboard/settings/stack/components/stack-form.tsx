// style-lint-ignore-file query-states -- useProjects only feeds optional keyword suggestions; the settings layout owns this page's query states
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAddLine } from "@remixicon/react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSaveSettings } from "@/api/hooks/admin/settings/use-save-settings";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import type { Setting } from "@/api/types/admin/setting";
import { UnsavedChangesDialog } from "@/components/common/forms/unsaved-changes-dialog";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useUnsavedGuard } from "@/hooks/use-unsaved-guard";
import { SettingsSaveButton } from "@/routes/dashboard/settings/components/settings-save-button";
import {
	stackFormSchema,
	toStackUpdates,
	toStackValues,
	type StackValues,
} from "@/routes/dashboard/settings/stack/components/stack-form-schema";
import { StackStopRow } from "@/routes/dashboard/settings/stack/components/stack-stop-row";

interface StackFormProps {
	settings: Setting[];
}

/** Home section 04 stops: name, id (kept once saved), description and the stack keywords each one matches. */
export const StackForm: React.FC<StackFormProps> = ({ settings }) => {
	const { t } = useTranslation();
	const save = useSaveSettings();
	// Keyword suggestions only: while projects load or fail, none are offered and the form still works.
	const { data: projects = [] } = useProjects();
	const suggestions = [...new Set(projects.flatMap((p) => p.stack))];
	const schema = useMemo(() => stackFormSchema(t), [t]);
	const form = useForm<StackValues>({
		resolver: zodResolver(schema),
		defaultValues: toStackValues(settings),
	});
	const { blocker } = useUnsavedGuard(form.formState.isDirty);
	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: "stops",
	});
	const listError =
		form.formState.errors.stops?.root?.message ??
		form.formState.errors.stops?.message;

	const onSubmit = form.handleSubmit((values) =>
		save.mutate(toStackUpdates(values), {
			onSuccess: () => {
				// the saved ids are read-only from now on
				form.reset({
					stops: values.stops.map((row) => ({ ...row, saved: true })),
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
							{t("dashboard.settings.stack.label")}
						</FieldLabel>
						<FieldDescription>
							{t("dashboard.settings.stack.hint")}
						</FieldDescription>
						{fields.map((row, index) => (
							<StackStopRow
								key={row.id}
								control={form.control}
								setValue={form.setValue}
								index={index}
								total={fields.length}
								saved={row.saved}
								name={row.name}
								suggestions={suggestions}
								onMove={(delta) => move(index, index + delta)}
								onRemove={() => remove(index)}
							/>
						))}
						<Button
							type="button"
							variant="outline"
							className="self-start"
							onClick={() =>
								append({
									id: "",
									name: "",
									description: "",
									keywords: [],
									saved: false,
								})
							}
						>
							<RiAddLine data-icon="inline-start" />
							{t("dashboard.settings.stack.add")}
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

export default StackForm;
