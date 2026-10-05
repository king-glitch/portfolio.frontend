import React, { useDeferredValue, useMemo, useState } from "react";
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
import { FileDetailSheet } from "@/routes/dashboard/files/components/file/file-detail-sheet";
import { FileEditDialog } from "@/routes/dashboard/files/components/file/file-edit-dialog";
import { FilesMetrics } from "@/routes/dashboard/files/components/files-metrics";
import { FilesSkeleton } from "@/routes/dashboard/files/components/files-skeleton";
import { FilesTable } from "@/routes/dashboard/files/components/files-table";
import { FilesToolbar } from "@/routes/dashboard/files/components/files-toolbar";
import { FileSortOption, ViewMode } from "@/types/ui";

export function meta() {
	return [{ title: i18n.t("dashboard.files.meta.title") }];
}

interface FilesProps {}

/** Redesigned file manager with storage metrics, grid/table views and inspection sheet. */
const Files: React.FC<FilesProps> = () => {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { kind, q } = parseFileParams(searchParams);
	const search = useDeferredValue(q.trim());
	const files = useAdminFiles({ kinds: kind ? [kind] : [], q: search });
	const remove = useDeleteFile();

	const [sort, setSort] = useState<FileSortOption>(FileSortOption.Newest);
	const [mode, setMode] = useState<ViewMode>(ViewMode.Grid);

	const [uploadOpen, setUploadOpen] = useState(false);
	const [uploadSession, setUploadSession] = useState(0);
	const [editing, setEditing] = useState<AdminFile>();
	const [editOpen, setEditOpen] = useState(false);
	const [editSession, setEditSession] = useState(0);
	const [inspecting, setInspecting] = useState<AdminFile>();
	const [inspectOpen, setInspectOpen] = useState(false);
	const [deleting, setDeleting] = useState<AdminFile>();
	const [deleteOpen, setDeleteOpen] = useState(false);

	const retainedEditing = useRetainedValue(editing);
	const retainedInspecting = useRetainedValue(inspecting);
	const retainedDeleting = useRetainedValue(deleting);

	const setFilters = (next: {
		kind: FileKind | undefined;
		q: string;
		sort: FileSortOption;
		mode: ViewMode;
	}) => {
		const names = config.dashboard.fileSearchParams;
		const params = new URLSearchParams(searchParams);
		if (next.kind) params.set(names.kind, next.kind);
		else params.delete(names.kind);
		if (next.q) params.set(names.q, next.q);
		else params.delete(names.q);
		setSearchParams(params, { replace: true });
		setSort(next.sort);
		setMode(next.mode);
	};

	const openUpload = () => {
		setUploadSession((current) => current + 1);
		setUploadOpen(true);
	};

	const askInspect = (file: AdminFile) => {
		setInspecting(file);
		setInspectOpen(true);
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
				setInspectOpen(false);
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

	const counts = useMemo(() => {
		if (!all) return undefined;
		const tally: Record<string, number> = { all: all.length };
		for (const item of all) {
			tally[item.kind] = (tally[item.kind] ?? 0) + 1;
		}
		return tally;
	}, [all]);

	const sortedFiles = useMemo(() => {
		if (!all) return [];
		const list = [...all];
		switch (sort) {
			case FileSortOption.Oldest:
				return list.sort((a, b) =>
					a.createdAt.localeCompare(b.createdAt),
				);
			case FileSortOption.Name:
				return list.sort((a, b) => a.name.localeCompare(b.name));
			case FileSortOption.Size:
				return list.sort((a, b) => b.size - a.size);
			case FileSortOption.Newest:
			default:
				return list.sort((a, b) =>
					b.createdAt.localeCompare(a.createdAt),
				);
		}
	}, [all, sort]);

	const filtered = Boolean(kind) || search !== "";

	const renderContent = () => {
		if (mode === ViewMode.Table) {
			return (
				<FilesTable
					files={sortedFiles}
					onInspect={askInspect}
					onEdit={askEdit}
					onDelete={askDelete}
				/>
			);
		}
		return (
			<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{sortedFiles.map((file) => (
					<FileCard
						key={file.id}
						file={file}
						onInspect={askInspect}
						onEdit={askEdit}
						onDelete={askDelete}
					/>
				))}
			</div>
		);
	};

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
				{renderContent()}
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
			{all?.length ? <FilesMetrics files={all} /> : null}
			<FilesToolbar
				kind={kind}
				q={q}
				sort={sort}
				mode={mode}
				counts={counts}
				onChange={setFilters}
			/>
			{renderBody()}
			<FileUploadDialog
				open={uploadOpen}
				onOpenChange={setUploadOpen}
				accept={kind ? [kind] : []}
				multiple
				session={uploadSession}
			/>
			<FileDetailSheet
				file={retainedInspecting}
				open={inspectOpen}
				onOpenChange={setInspectOpen}
				onEdit={askEdit}
				onDelete={askDelete}
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
