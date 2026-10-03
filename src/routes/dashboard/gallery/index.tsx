import React, { useState } from "react";
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
import { FrameCard } from "@/routes/dashboard/gallery/components/frame-card";
import { FrameDialog } from "@/routes/dashboard/gallery/components/frame-dialog";
import { GallerySkeleton } from "@/routes/dashboard/gallery/components/gallery-skeleton";

export function meta() {
	return [{ title: i18n.t("dashboard.gallery.meta.title") }];
}

interface GalleryProps {}

const Gallery: React.FC<GalleryProps> = () => {
	const { t } = useTranslation();
	const frames = useAdminFrames();
	const remove = useDeleteFrame();
	const [editing, setEditing] = useState<AdminFrame>();
	const [formOpen, setFormOpen] = useState(false);
	const [session, setSession] = useState(0);
	const [deleting, setDeleting] = useState<AdminFrame>();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const retainedDeleting = useRetainedValue(deleting);

	const openForm = (frame?: AdminFrame) => {
		setEditing(frame);
		setSession((current) => current + 1);
		setFormOpen(true);
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
				toast.add({
					type: "success",
					title: t("dashboard.gallery.deleted"),
				});
			},
		});
	};

	const all = frames.data?.pages.flatMap((page) => page.frames);

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
		return (
			<div className="flex flex-col items-center gap-6">
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{all.map((frame) => (
						<FrameCard
							key={frame.id}
							frame={frame}
							onEdit={openForm}
							onDelete={askDelete}
						/>
					))}
				</div>
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
			{renderBody()}
			<FrameDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				frame={editing}
				session={session}
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
