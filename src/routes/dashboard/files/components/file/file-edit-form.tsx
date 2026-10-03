import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useUpdateFile } from "@/api/hooks/admin/storage/use-update-file";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { FormButton } from "@/components/common/buttons/form-button";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { applyViolations } from "@/lib/forms";

const editSchema = (required: string) =>
	z.object({ name: z.string().trim().min(1, required), alt: z.string() });

type EditValues = z.infer<ReturnType<typeof editSchema>>;

interface FileEditFormProps {
	file: AdminFile;
	onDone: () => void;
}

/** Rename a file and edit its alt text (pictures only). Mount fresh per opening. */
export const FileEditForm: React.FC<FileEditFormProps> = ({ file, onDone }) => {
	const { t } = useTranslation();
	const update = useUpdateFile(file.id);
	const schema = useMemo(
		() => editSchema(t("dashboard.errors.required")),
		[t],
	);
	const form = useForm<EditValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: file.name, alt: file.alt },
	});

	const onSubmit = form.handleSubmit((values) =>
		update.mutate(values, {
			onSuccess: () => {
				toast.add({
					type: "success",
					title: t("dashboard.files.saved"),
				});
				onDone();
			},
			onError: (error) =>
				applyViolations(error, form.setError, ["name", "alt"]),
		}),
	);

	return (
		<form noValidate onSubmit={onSubmit}>
			<FieldGroup>
				<FormTextField
					control={form.control}
					name="name"
					label={t("dashboard.files.form.name.label")}
				/>
				{file.kind === FileKind.Image ? (
					<FormTextField
						control={form.control}
						name="alt"
						label={t("dashboard.storage.upload.alt.label")}
						description={t("dashboard.storage.upload.alt.hint")}
					/>
				) : null}
				<FormButton type="submit" disabled={update.isPending}>
					{update.isPending ? (
						<Spinner data-icon="inline-start" />
					) : null}
					{t("dashboard.form.submit")}
				</FormButton>
			</FieldGroup>
		</form>
	);
};

export default FileEditForm;
