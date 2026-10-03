import React, { useDeferredValue, useState } from "react";
import { RiUploadLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { useAdminFiles } from "@/api/hooks/admin/storage/use-admin-files";
import { useDeleteFile } from "@/api/hooks/admin/storage/use-delete-file";
import { ApiErrorKind, isApiError } from "@/api/errors";
import { FileKind, type AdminFile } from "@/api/types/admin/storage";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { config } from "@/config";
import { useRetainedValue } from "@/hooks/use-retained-value";
import i18n from "@/lib/i18n";
import { parseFileParams } from "@/lib/storage/files";
import { DeleteDialog } from "@/routes/dashboard/components/delete-dialog";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { FileUploadDialog } from "@/routes/dashboard/components/storage/file/upload/file-upload-dialog";
import { FileCard } from "@/routes/dashboard/files/components/file/file-card";
import { FileEditDialog } from "@/routes/dashboard/files/components/file/file-edit-dialog";
import { FileRow } from "@/routes/dashboard/files/components/file/file-row";
import { FilesSkeleton } from "@/routes/dashboard/files/components/files-skeleton";
import { FilesToolbar } from "@/routes/dashboard/files/components/files-toolbar";

export function meta() {
	return [{ title: i18n.t("dashboard.files.meta.title") }];
}

const MEDIA_KINDS: FileKind[] = [FileKind.Image, FileKind.Video];

interface FilesProps {}

/** The file library: every upload, filtered by kind and search (both in the URL). */
const Files: React.FC<FilesProps> = () => {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { kind, q } = parseFileParams(searchParams);
	const search = useDeferredValue(q.trim());
	const files = useAdminFiles({ kinds: kind ? [kind] : [], q: search });
	const remove = useDeleteFile();

	const [uploadOpen, setUploadOpen] = useState(false);
	const [uploadSession, setUploadSession] = useState(0);
	const [editing, setEditing] = useState<AdminFile>();
	const [editOpen, setEditOpen] = useState(false);
	const [editSession, setEditSession] = useState(0);
	const [deleting, setDeleting] = useState<AdminFile>();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const retainedEditing = useRetainedValue(editing);
	const retainedDeleting = useRetainedValue(deleting);

	const setFilters = (next: { kind: FileKind | undefined; q: string }) => {
		const names = config.dashboard.fileSearchParams;
		const params = new URLSearchParams(searchParams);
		if (next.kind) params.set(names.kind, next.kind);
		else params.delete(names.kind);
		if (next.q) params.set(names.q, next.q);
		else params.delete(names.q);
		setSearchParams(params, { replace: true });
	};
	const openUpload = () => {
		setUploadSession((current) => current + 1);
		setUploadOpen(true);
	};
	const askEdit = (file: AdminFile) => {
		setEditing(file);
		setEditSession((current) => current + 1);
		setEditOpen(true);
	};
	const askDelete = (file: AdminFile) => {
		setDeleting(file);
		setDeleteOpen(true);
	};
	const confirmDelete = () => {
		if (!deleting) return;
		remove.mutate(deleting.id, {
			onSuccess: () => {
				setDeleteOpen(false);
				toast.add({
					type: "success",
					title: t("dashboard.files.deleted"),
				});
			},
			onError: (error) => {
				if (isApiError(error) && error.kind === ApiErrorKind.Conflict)
					toast.add({
						type: "error",
						title: t("dashboard.files.delete.in-use.title"),
						description: t(
							"dashboard.files.delete.in-use.description",
						),
					});
			},
		});
	};

	const all = files.data?.pages.flatMap((page) => page.files);
	const media = all?.filter((file) => MEDIA_KINDS.includes(file.kind)) ?? [];
	const others =
		all?.filter((file) => !MEDIA_KINDS.includes(file.kind)) ?? [];
	const filtered = Boolean(kind) || search !== "";

	const renderBody = () => {
		if (files.isPending) return <FilesSkeleton />;
		if (files.isError && !all)
			return (
				<QueryErrorAlert
					onRetry={() => void files.refetch()}
					error={files.error}
				/>
			);
		if (!all?.length)
			return filtered ? (
				<QueryEmpty
					titleKey="dashboard.files.empty.filtered.title"
					descriptionKey="dashboard.files.empty.filtered.description"
				/>
			) : (
				<QueryEmpty
					titleKey="dashboard.files.empty.title"
					descriptionKey="dashboard.files.empty.description"
				/>
			);
		return (
			<div className="flex flex-col items-center gap-6">
				{media.length ? (
					<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{media.map((file) => (
							<FileCard
								key={file.id}
								file={file}
								onEdit={askEdit}
								onDelete={askDelete}
							/>
						))}
					</div>
				) : null}
				{others.length ? (
					<ul className="flex w-full flex-col gap-2">
						{others.map((file) => (
							<FileRow
								key={file.id}
								file={file}
								onEdit={askEdit}
								onDelete={askDelete}
							/>
						))}
					</ul>
				) : null}
				{files.isFetchNextPageError ? (
					<QueryErrorAlert
						onRetry={() => void files.fetchNextPage()}
						error={files.error}
					/>
				) : null}
				{files.hasNextPage ? (
					<Button
						variant="outline"
						disabled={files.isFetchingNextPage}
						onClick={() => void files.fetchNextPage()}
					>
						{files.isFetchingNextPage ? (
							<Spinner data-icon="inline-start" />
						) : null}
						{t("dashboard.files.more")}
					</Button>
				) : null}
			</div>
		);
	};

	return (
		<>
			<PageHeader
				title={t("dashboard.files.title")}
				description={t("dashboard.files.description")}
				action={
					<Button onClick={openUpload}>
						<RiUploadLine data-icon="inline-start" />
						{t("dashboard.files.upload.button")}
					</Button>
				}
			/>
			<FilesToolbar kind={kind} q={q} onChange={setFilters} />
			{renderBody()}
			<FileUploadDialog
				open={uploadOpen}
				onOpenChange={setUploadOpen}
				accept={kind ? [kind] : []}
				multiple
				session={uploadSession}
			/>
			<FileEditDialog
				open={editOpen}
				onOpenChange={setEditOpen}
				file={retainedEditing}
				session={editSession}
			/>
			<DeleteDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				name={retainedDeleting?.name}
				pending={remove.isPending}
				onConfirm={confirmDelete}
			/>
		</>
	);
};

export default Files;
