import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys, TFunction } from "i18next";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useCreateFrame } from "@/api/hooks/admin/frames/use-create-frame";
import { useUpdateFrame } from "@/api/hooks/admin/frames/use-update-frame";
import type { AdminFrame } from "@/api/types/admin/gallery";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { FormButton } from "@/components/common/buttons/form-button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { applyViolations, cleanList } from "@/lib/forms";
import { FormProjectSelectField } from "@/routes/dashboard/components/fields/form-project-select-field";
import { FormTagsField } from "@/routes/dashboard/components/fields/form-tags-field";
import { FileSelectField } from "@/routes/dashboard/components/storage/file/select/file-select-field";
import { FileValueKey } from "@/types/ui";

interface FrameFormProps {
	/** Undefined = add a new frame. */
	frame?: AdminFrame;
	onDone: () => void;
}

const frameSchema = (t: TFunction) =>
	z.object({
		fileId: z.string().min(1, t("dashboard.gallery.form.file.required")),
		tags: z.array(z.string()),
		projectId: z.string(),
	});

/** The file an existing frame shows, for the picker to display before the library has loaded. */
const fileOfFrame = (frame: AdminFrame): AdminFile => ({
	id: frame.fileId,
	kind: FileKind.Image,
	mime: "",
	size: 0,
	width: frame.width,
	height: frame.height,
	name: frame.alt,
	alt: frame.alt,
	url: frame.imageUrl,
	createdAt: "",
});

type FrameValues = z.infer<ReturnType<typeof frameSchema>>;

/** Add a frame (a stored picture, tags, project) or edit one, including which picture it shows. Mount it fresh per dialog opening. */
export const FrameForm: React.FC<FrameFormProps> = ({ frame, onDone }) => {
	const { t } = useTranslation();
	const create = useCreateFrame();
	const update = useUpdateFrame(frame?.id ?? "");
	const pending = create.isPending || update.isPending;
	const schema = useMemo(() => frameSchema(t), [t]);
	const form = useForm<FrameValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			fileId: frame?.fileId ?? "",
			tags: frame?.tags ?? [],
			projectId: frame?.project?.id ?? "",
		},
	});

	const done = (messageKey: ParseKeys) => {
		toast.add({ type: "success", title: t(messageKey) });
		onDone();
	};
	const onFailure = (error: unknown) =>
		applyViolations(error, form.setError, ["fileId", "tags", "projectId"]);

	const onSubmit = form.handleSubmit(({ fileId, tags, projectId }) => {
		const linked = projectId;
		if (frame)
			update.mutate(
				{ fileId, tags: cleanList(tags), projectId: linked },
				{
					onSuccess: () => done("dashboard.gallery.saved"),
					onError: onFailure,
				},
			);
		else
			create.mutate(
				{ fileId, tags: cleanList(tags), projectId: linked || null },
				{
					onSuccess: () => done("dashboard.gallery.created"),
					onError: onFailure,
				},
			);
	});

	return (
		<form noValidate onSubmit={onSubmit}>
			<FieldGroup>
				<Controller
					control={form.control}
					name="fileId"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								{t("dashboard.gallery.form.file.label")}
							</FieldLabel>
							<FileSelectField
								id={field.name}
								accept={[FileKind.Image]}
								by={FileValueKey.Id}
								value={field.value}
								onChange={field.onChange}
								current={frame ? fileOfFrame(frame) : undefined}
								invalid={fieldState.invalid}
							/>
							<FieldDescription>
								{t("dashboard.gallery.form.file.hint")}
							</FieldDescription>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				<FormTagsField
					control={form.control}
					name="tags"
					label={t("dashboard.gallery.form.tags.label")}
				/>
				<FormProjectSelectField
					control={form.control}
					name="projectId"
					label={t("dashboard.gallery.form.project.label")}
				/>
				<FormButton type="submit" disabled={pending}>
					{pending ? <Spinner data-icon="inline-start" /> : null}
					{t("dashboard.form.submit")}
				</FormButton>
			</FieldGroup>
		</form>
	);
};

export default FrameForm;
