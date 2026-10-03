import React, { useDeferredValue, useState } from "react";
import { RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useAdminFiles } from "@/api/hooks/admin/storage/use-admin-files";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { isExternal, resolveFile, sameFile } from "@/lib/storage/files";
import { FilePreview } from "@/routes/dashboard/components/storage/file/file-preview";
import { FileSelectItem } from "@/routes/dashboard/components/storage/file/select/file-select-item";
import { FileSelectSkeleton } from "@/routes/dashboard/components/storage/file/select/file-select-skeleton";
import { FileUploadDialog } from "@/routes/dashboard/components/storage/file/upload/file-upload-dialog";
import type { FileValueKey } from "@/types/ui";

interface FileSelectFieldProps {
	id?: string;
	/** Kinds the field takes: the list is filtered to them and so is the upload. */
	accept: FileKind[];
	/** What the field stores: the file's URL or its id, per `by`. "" = none. */
	value: string;
	by: FileValueKey;
	onChange: (value: string) => void;
	/** The file `value` already points to, for when it is not on the loaded page (e.g. the frame being edited). */
	current?: AdminFile;
	invalid?: boolean;
}

/**
 * Pick a stored file (searchable list, newest first) or upload a new one with the plus button.
 * A value the library does not know (an old URL) shows as "External URL" and can be replaced.
 */
export const FileSelectField: React.FC<FileSelectFieldProps> = ({
	id,
	accept,
	value,
	by,
	onChange,
	current,
	invalid,
}) => {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const q = useDeferredValue(search.trim());
	const files = useAdminFiles({ kinds: accept, q });
	const [picked, setPicked] = useState<AdminFile>();
	const [uploadOpen, setUploadOpen] = useState(false);
	const [session, setSession] = useState(0);

	const loaded = files.data?.pages.flatMap((page) => page.files) ?? [];
	const selected = resolveFile(
		value,
		by,
		[current, picked, ...loaded],
		accept[0] ?? FileKind.Other,
	);
	// the chosen file stays an option even when the current search no longer lists it
	const items =
		selected && !loaded.some((file) => sameFile(file, selected))
			? [selected, ...loaded]
			: loaded;

	const choose = (file: AdminFile | null) => {
		setPicked(file ?? undefined);
		setSearch("");
		onChange(file ? file[by] : "");
	};

	return (
		<div className="flex flex-col gap-2">
			<Combobox
				items={items}
				value={selected}
				filter={null}
				itemToStringLabel={(file: AdminFile) =>
					isExternal(file)
						? t("dashboard.storage.select.external.label")
						: file.name
				}
				isItemEqualToValue={sameFile}
				onValueChange={choose}
				onInputValueChange={(text, details) => {
					if (details.reason === "input-change") setSearch(text);
				}}
				onOpenChangeComplete={(open) => {
					if (!open) setSearch("");
				}}
			>
				<ComboboxInput
					id={id}
					className="w-full"
					aria-invalid={invalid}
					placeholder={t("dashboard.storage.select.placeholder")}
				>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							size="icon-xs"
							aria-label={t(
								"dashboard.storage.select.add.aria-label",
							)}
							onClick={() => {
								setSession((current) => current + 1);
								setUploadOpen(true);
							}}
						>
							<RiAddLine />
						</InputGroupButton>
					</InputGroupAddon>
				</ComboboxInput>
				<ComboboxContent>
					{files.isPending ? <FileSelectSkeleton /> : null}
					{files.isError && !loaded.length ? (
						<QueryErrorAlert
							error={files.error}
							onRetry={() => void files.refetch()}
						/>
					) : null}
					{files.isSuccess ? (
						<ComboboxEmpty>
							{t("dashboard.storage.select.empty")}
						</ComboboxEmpty>
					) : null}
					<ComboboxList>
						{(file: AdminFile) => (
							<FileSelectItem
								key={file.id || file.url}
								file={file}
							/>
						)}
					</ComboboxList>
					{files.hasNextPage ? (
						<Button
							variant="ghost"
							className="w-full"
							disabled={files.isFetchingNextPage}
							onClick={() => void files.fetchNextPage()}
						>
							{files.isFetchingNextPage ? (
								<Spinner data-icon="inline-start" />
							) : null}
							{t("dashboard.storage.select.more")}
						</Button>
					) : null}
				</ComboboxContent>
			</Combobox>
			{selected ? (
				<FilePreview file={selected} onClear={() => choose(null)} />
			) : null}
			<FileUploadDialog
				open={uploadOpen}
				onOpenChange={setUploadOpen}
				accept={accept}
				session={session}
				onUploaded={choose}
			/>
		</div>
	);
};

export default FileSelectField;
