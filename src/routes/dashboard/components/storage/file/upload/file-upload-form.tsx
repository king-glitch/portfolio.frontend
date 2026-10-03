import React, { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { isApiError } from "@/api/errors";
import {
	FileKind,
	type AdminFile,
	type FileUploadInput,
} from "@/api/types/admin/storage";
import { FormButton } from "@/components/common/buttons/form-button";
import { FormTextField } from "@/components/common/fields/form/form-text-field";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { config } from "@/config";
import {
	FileProblem,
	acceptOf,
	checkFile,
	formatBytes,
	kindOfMime,
} from "@/lib/storage/files";
import { FileUploadRow } from "@/routes/dashboard/components/storage/file/upload/file-upload-row";
import { UploadStatus } from "@/types/ui";

const uploadSchema = (t: TFunction, accept: FileKind[]) =>
	z.object({
		files: z
			.array(z.instanceof(File))
			.min(1, t("dashboard.storage.upload.required"))
			.superRefine((files, ctx) => {
				for (const file of files) {
					const problem = checkFile(file, accept);
					if (problem === FileProblem.Type)
						ctx.addIssue({
							code: "custom",
							message: t(
								"dashboard.storage.upload.problems.type",
								{
									name: file.name,
								},
							),
						});
					if (problem === FileProblem.Size)
						ctx.addIssue({
							code: "custom",
							message: t(
								"dashboard.storage.upload.problems.size",
								{
									name: file.name,
									limit: formatBytes(
										config.dashboard.fileMaxBytes[
											kindOfMime(file.type) ??
												FileKind.Other
										],
									),
								},
							),
						});
				}
			}),
		alt: z.string(),
	});

type UploadValues = z.infer<ReturnType<typeof uploadSchema>>;

interface RowState {
	status: UploadStatus;
	error?: string;
}

interface FileUploadFormProps {
	accept: FileKind[];
	multiple: boolean;
	/** A request is running, or the batch is between two requests. */
	pending: boolean;
	onPendingChange: (pending: boolean) => void;
	upload: (input: FileUploadInput) => Promise<AdminFile>;
	/** Called with each file the server stored. */
	onUploaded?: (file: AdminFile) => void;
	/** Every chosen file is stored. */
	onDone: () => void;
	onCancel: () => void;
}

/** Choose files, check them here, send one request per file; each row shows its own result. Mount fresh per opening. */
export const FileUploadForm: React.FC<FileUploadFormProps> = ({
	accept,
	multiple,
	pending,
	onPendingChange,
	upload,
	onUploaded,
	onDone,
	onCancel,
}) => {
	const { t } = useTranslation();
	const schema = useMemo(() => uploadSchema(t, accept), [t, accept]);
	const form = useForm<UploadValues>({
		resolver: zodResolver(schema),
		defaultValues: { files: [], alt: "" },
	});
	const [rows, setRows] = useState<Record<number, RowState>>({});
	const files = form.watch("files");
	const onlyImage =
		files.length === 1 &&
		kindOfMime(files[0]?.type ?? "") === FileKind.Image;

	const send = async ({ files: chosen, alt }: UploadValues) => {
		let failed = false;
		onPendingChange(true);
		for (const [index, file] of chosen.entries()) {
			if (rows[index]?.status === UploadStatus.Done) continue;
			setRows((current) => ({
				...current,
				[index]: { status: UploadStatus.Pending },
			}));
			try {
				const stored = await upload({
					file,
					alt: onlyImage ? alt : "",
				});
				setRows((current) => ({
					...current,
					[index]: { status: UploadStatus.Done },
				}));
				onUploaded?.(stored);
			} catch (error) {
				failed = true;
				setRows((current) => ({
					...current,
					[index]: {
						status: UploadStatus.Failed,
						error: isApiError(error)
							? t(`common.errors.kinds.${error.kind}.title`)
							: t("common.errors.load.title"),
					},
				}));
			}
		}
		onPendingChange(false);
		if (!failed) onDone();
	};

	const onSubmit = form.handleSubmit(send);

	return (
		<form noValidate onSubmit={onSubmit}>
			<FieldGroup>
				<Controller
					control={form.control}
					name="files"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								{multiple
									? t(
											"dashboard.storage.upload.file.multiple.label",
										)
									: t(
											"dashboard.storage.upload.file.single.label",
										)}
							</FieldLabel>
							<Input
								id={field.name}
								name={field.name}
								type="file"
								multiple={multiple}
								accept={acceptOf(accept)}
								disabled={pending}
								aria-invalid={fieldState.invalid}
								onBlur={field.onBlur}
								onChange={(event) => {
									setRows({});
									field.onChange(
										Array.from(event.target.files ?? []),
									);
								}}
							/>
							<FieldDescription>
								{t("dashboard.storage.upload.file.hint", {
									kinds: new Intl.ListFormat().format(
										(accept.length
											? accept
											: Object.values(FileKind)
										).map((kind) =>
											t(
												`dashboard.storage.kinds.${kind}`,
											),
										),
									),
								})}
							</FieldDescription>
							{fieldState.invalid ? (
								<FieldError errors={[fieldState.error]} />
							) : null}
						</Field>
					)}
				/>
				{files.length ? (
					<ul className="flex flex-col gap-2">
						{files.map((file, index) => (
							<FileUploadRow
								key={`${file.name}-${file.size}-${file.lastModified}`}
								file={file}
								status={
									rows[index]?.status ?? UploadStatus.Idle
								}
								error={rows[index]?.error}
							/>
						))}
					</ul>
				) : null}
				{onlyImage ? (
					<FormTextField
						control={form.control}
						name="alt"
						label={t("dashboard.storage.upload.alt.label")}
						description={t("dashboard.storage.upload.alt.hint")}
						disabled={pending}
					/>
				) : null}
				<div className="flex justify-end gap-2">
					<FormButton
						variant="outline"
						disabled={pending}
						onClick={onCancel}
					>
						{t("dashboard.form.cancel")}
					</FormButton>
					<FormButton type="submit" disabled={pending}>
						{pending ? <Spinner data-icon="inline-start" /> : null}
						{t("dashboard.storage.upload.submit")}
					</FormButton>
				</div>
			</FieldGroup>
		</form>
	);
};

export default FileUploadForm;
