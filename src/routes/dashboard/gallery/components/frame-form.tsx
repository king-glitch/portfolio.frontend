// style-lint-ignore-file query-states -- projects only fill a select; a failed load leaves "No project" and says so
import React, { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ParseKeys, TFunction } from "i18next";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useAdminProjects } from "@/api/hooks/admin/projects/use-admin-projects";
import { useUpdateFrame } from "@/api/hooks/admin/frames/use-update-frame";
import { useUploadFrame } from "@/api/hooks/admin/frames/use-upload-frame";
import type { AdminFrame } from "@/api/types/admin/gallery";
import { FormSelectField } from "@/components/common/fields/form-select-field";
import { FormTextField } from "@/components/common/fields/form-text-field";
import { FormButton } from "@/components/common/buttons/form-button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { applyViolations, joinList, splitList } from "@/lib/forms";

interface FrameFormProps {
	/** Undefined = upload a new picture. */
	frame?: AdminFrame;
	onDone: () => void;
}

const frameSchema = (t: TFunction, uploading: boolean) =>
	z.object({
		file: z
			.instanceof(File)
			.nullable()
			.refine(
				(file) => !uploading || file !== null,
				t("dashboard.gallery.form.file.required"),
			),
		tags: z.string(),
		projectId: z.string(),
	});

type FrameValues = z.infer<ReturnType<typeof frameSchema>>;

/** Upload a picture (file, tags, project) or edit a frame's tags and project. Mount it fresh per dialog opening. */
export const FrameForm: React.FC<FrameFormProps> = ({ frame, onDone }) => {
	const { t } = useTranslation();
	const projects = useAdminProjects();
	const upload = useUploadFrame();
	const update = useUpdateFrame(frame?.id ?? "");
	const pending = upload.isPending || update.isPending;
	const schema = useMemo(() => frameSchema(t, !frame), [t, frame]);
	const form = useForm<FrameValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			file: null,
			tags: joinList(frame?.tags ?? []),
			projectId: frame?.project?.id ?? config.dashboard.noValue,
		},
	});

	const projectOptions = [
		{
			value: config.dashboard.noValue,
			label: t("dashboard.gallery.form.project.none"),
		},
		...(projects.data ?? []).map((project) => ({
			value: project.id,
			label: project.name,
		})),
	];

	const done = (messageKey: ParseKeys) => {
		toast.add({ type: "success", title: t(messageKey) });
		onDone();
	};
	const onFailure = (error: unknown) =>
		applyViolations(error, form.setError, ["file", "tags", "projectId"]);

	const onSubmit = form.handleSubmit(({ file, tags, projectId }) => {
		const linked = projectId === config.dashboard.noValue ? "" : projectId;
		if (frame)
			update.mutate(
				{ tags: splitList(tags), projectId: linked },
				{
					onSuccess: () => done("dashboard.gallery.saved"),
					onError: onFailure,
				},
			);
		else if (file)
			upload.mutate(
				{ file, tags: splitList(tags), projectId: linked || null },
				{
					onSuccess: () => done("dashboard.gallery.uploaded"),
					onError: onFailure,
				},
			);
	});

	return (
		<form noValidate onSubmit={onSubmit}>
			<FieldGroup>
				{frame ? null : (
					<Controller
						control={form.control}
						name="file"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									{t("dashboard.gallery.form.file.label")}
								</FieldLabel>
								<Input
									id={field.name}
									name={field.name}
									type="file"
									accept={config.dashboard.imageAccept}
									aria-invalid={fieldState.invalid}
									onBlur={field.onBlur}
									onChange={(event) =>
										field.onChange(
											event.target.files?.[0] ?? null,
										)
									}
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
				)}
				<FormTextField
					control={form.control}
					name="tags"
					label={t("dashboard.gallery.form.tags.label")}
					description={t("dashboard.form.list.hint")}
				/>
				<FormSelectField
					control={form.control}
					name="projectId"
					label={t("dashboard.gallery.form.project.label")}
					options={projectOptions}
					disabled={projects.isPending}
					description={
						projects.isError
							? t("dashboard.gallery.form.project.error")
							: undefined
					}
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
