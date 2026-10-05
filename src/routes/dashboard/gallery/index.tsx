import React, { useDeferredValue, useMemo, useState } from "react";
import { RiUploadLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { useAdminFrames } from "@/api/hooks/admin/frames/use-admin-frames";
import { useDeleteFrame } from "@/api/hooks/admin/frames/use-delete-frame";
import type { AdminFrame } from "@/api/types/admin/gallery";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRetainedValue } from "@/hooks/use-retained-value";
import i18n from "@/lib/i18n";
import { DeleteDialog } from "@/routes/dashboard/components/delete-dialog";
import { PageHeader } from "@/routes/dashboard/components/page-header";
import { FrameCard } from "@/routes/dashboard/gallery/components/frame/frame-card";
import { FrameDialog } from "@/routes/dashboard/gallery/components/frame/frame-dialog";
import { FrameLightboxDialog } from "@/routes/dashboard/gallery/components/frame/frame-lightbox-dialog";
import { GalleryMetrics } from "@/routes/dashboard/gallery/components/gallery-metrics";
import { GallerySkeleton } from "@/routes/dashboard/gallery/components/gallery-skeleton";
import { GalleryTable } from "@/routes/dashboard/gallery/components/gallery-table";
import { GalleryToolbar } from "@/routes/dashboard/gallery/components/gallery-toolbar";
import { FrameSortOption, ViewMode } from "@/types/ui";

export function meta() {
	return [{ title: i18n.t("dashboard.gallery.meta.title") }];
}

interface GalleryProps {}

const ALL_SENTINEL = "__all__";
const UNLINKED_SENTINEL = "__unlinked__";

/** Redesigned gallery manager with metrics ribbon, search/filters, lightbox preview and grid/table views. */
const Gallery: React.FC<GalleryProps> = () => {
	const { t } = useTranslation();
	const frames = useAdminFrames();
	const remove = useDeleteFrame();

	const [searchQuery, setSearchQuery] = useState("");
	const deferredSearch = useDeferredValue(searchQuery.trim().toLowerCase());
	const [projectFilter, setProjectFilter] = useState(ALL_SENTINEL);
	const [tagFilter, setTagFilter] = useState(ALL_SENTINEL);
	const [sort, setSort] = useState<FrameSortOption>(FrameSortOption.Newest);
	const [mode, setMode] = useState<ViewMode>(ViewMode.Grid);

	const [editing, setEditing] = useState<AdminFrame>();
	const [formOpen, setFormOpen] = useState(false);
	const [session, setSession] = useState(0);

	const [zooming, setZooming] = useState<AdminFrame>();
	const [zoomOpen, setZoomOpen] = useState(false);

	const [deleting, setDeleting] = useState<AdminFrame>();
	const [deleteOpen, setDeleteOpen] = useState(false);

	const retainedZooming = useRetainedValue(zooming);
	const retainedDeleting = useRetainedValue(deleting);

	const openForm = (frame?: AdminFrame) => {
		setEditing(frame);
		setSession((current) => current + 1);
		setFormOpen(true);
	};

	const openZoom = (frame: AdminFrame) => {
		setZooming(frame);
		setZoomOpen(true);
	};

	const askDelete = (frame: AdminFrame) => {
		setDeleting(frame);
		setDeleteOpen(true);
	};

	const confirmDelete = () => {
		if (!deleting) return;
		remove.mutate(deleting.id, {
			onSuccess: () => {
				setDeleteOpen(false);
				setZoomOpen(false);
				toast.add({
					type: "success",
					title: t("dashboard.gallery.deleted"),
				});
			},
		});
	};

	const all = frames.data?.pages.flatMap((page) => page.frames);

	const projectOptions = useMemo(() => {
		if (!all) return [];
		const map = new Map<string, string>();
		for (const frame of all) {
			if (frame.project?.id && frame.project?.name) {
				map.set(frame.project.id, frame.project.name);
			}
		}
		return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
	}, [all]);

	const tagOptions = useMemo(() => {
		if (!all) return [];
		const set = new Set<string>();
		for (const frame of all) {
			for (const tag of frame.tags) {
				set.add(tag);
			}
		}
		return Array.from(set).sort();
	}, [all]);

	const filteredFrames = useMemo(() => {
		if (!all) return [];
		return all.filter((frame) => {
			if (projectFilter === UNLINKED_SENTINEL && frame.project)
				return false;
			if (
				projectFilter !== ALL_SENTINEL &&
				projectFilter !== UNLINKED_SENTINEL &&
				frame.project?.id !== projectFilter
			) {
				return false;
			}
			if (tagFilter !== ALL_SENTINEL && !frame.tags.includes(tagFilter)) {
				return false;
			}
			if (deferredSearch) {
				const projectName = (frame.project?.name ?? "").toLowerCase();
				const tagsMatch = frame.tags.some((tag) =>
					tag.toLowerCase().includes(deferredSearch),
				);
				if (!projectName.includes(deferredSearch) && !tagsMatch) {
					return false;
				}
			}
			return true;
		});
	}, [all, projectFilter, tagFilter, deferredSearch]);

	const sortedFrames = useMemo(() => {
		const list = [...filteredFrames];
		switch (sort) {
			case FrameSortOption.Oldest:
				return list.reverse();
			case FrameSortOption.Project:
				return list.sort((a, b) => {
					const nameA = a.project?.name ?? "";
					const nameB = b.project?.name ?? "";
					return nameA.localeCompare(nameB);
				});
			case FrameSortOption.Newest:
			default:
				return list;
		}
	}, [filteredFrames, sort]);

	const stepZoom = (delta: number) => {
		if (!sortedFrames.length || !zooming) return;
		const currentIndex = sortedFrames.findIndex((f) => f.id === zooming.id);
		const targetIndex =
			(currentIndex + delta + sortedFrames.length) % sortedFrames.length;
		setZooming(sortedFrames[targetIndex]);
	};

	const isFiltered =
		Boolean(deferredSearch) ||
		projectFilter !== ALL_SENTINEL ||
		tagFilter !== ALL_SENTINEL;

	const handleToolbarChange = (next: {
		search: string;
		projectFilter: string;
		tagFilter: string;
		sort: FrameSortOption;
		mode: ViewMode;
	}) => {
		setSearchQuery(next.search);
		setProjectFilter(next.projectFilter);
		setTagFilter(next.tagFilter);
		setSort(next.sort);
		setMode(next.mode);
	};

	const renderContent = () => {
		if (mode === ViewMode.Table) {
			return (
				<GalleryTable
					frames={sortedFrames}
					onZoom={openZoom}
					onEdit={openForm}
					onDelete={askDelete}
				/>
			);
		}
		return (
			<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{sortedFrames.map((frame) => (
					<FrameCard
						key={frame.id}
						frame={frame}
						onZoom={openZoom}
						onEdit={openForm}
						onDelete={askDelete}
					/>
				))}
			</div>
		);
	};

	const renderBody = () => {
		if (frames.isPending) return <GallerySkeleton />;
		if (frames.isError && !all)
			return (
				<QueryErrorAlert
					onRetry={() => void frames.refetch()}
					error={frames.error}
				/>
			);
		if (!all?.length)
			return (
				<QueryEmpty
					titleKey="dashboard.gallery.empty.title"
					descriptionKey="dashboard.gallery.empty.description"
				/>
			);
		if (!sortedFrames.length)
			return (
				<QueryEmpty
					titleKey="dashboard.files.empty.filtered.title"
					descriptionKey="dashboard.files.empty.filtered.description"
				/>
			);
		return (
			<div className="flex flex-col items-center gap-6">
				{renderContent()}
				{frames.isFetchNextPageError ? (
					<QueryErrorAlert
						onRetry={() => void frames.fetchNextPage()}
						error={frames.error}
					/>
				) : null}
				{frames.hasNextPage ? (
					<Button
						variant="outline"
						disabled={frames.isFetchingNextPage}
						onClick={() => void frames.fetchNextPage()}
					>
						{frames.isFetchingNextPage ? (
							<Spinner data-icon="inline-start" />
						) : null}
						{t("dashboard.gallery.more")}
					</Button>
				) : null}
			</div>
		);
	};

	return (
		<>
			<PageHeader
				title={t("dashboard.gallery.title")}
				description={t("dashboard.gallery.description")}
				action={
					<Button onClick={() => openForm()}>
						<RiUploadLine data-icon="inline-start" />
						{t("dashboard.gallery.upload.button")}
					</Button>
				}
			/>
			{all?.length && !isFiltered ? (
				<GalleryMetrics frames={all} />
			) : null}
			<GalleryToolbar
				search={searchQuery}
				projectFilter={projectFilter}
				tagFilter={tagFilter}
				sort={sort}
				mode={mode}
				projects={projectOptions}
				tags={tagOptions}
				onChange={handleToolbarChange}
			/>
			{renderBody()}
			<FrameDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				frame={editing}
				session={session}
			/>
			<FrameLightboxDialog
				open={zoomOpen}
				onOpenChange={setZoomOpen}
				frame={retainedZooming}
				onStep={stepZoom}
				onEdit={openForm}
				onDelete={askDelete}
			/>
			<DeleteDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				name={
					retainedDeleting?.project?.name ??
					t("dashboard.gallery.card.untitled")
				}
				pending={remove.isPending}
				onConfirm={confirmDelete}
			/>
		</>
	);
};

export default Gallery;
