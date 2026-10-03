import React from "react";
import {
	RiArrowLeftLine,
	RiArrowRightLine,
	RiArrowRightUpLine,
	RiCloseLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { IconButton } from "@/components/common/buttons/icon-button";
import { PillButton } from "@/components/common/buttons/pill-button";
import { TagPill } from "@/components/common/badges/tag-pill";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { GalleryArt } from "@/routes/gallery/components/gallery-art";
import { projectPath } from "@/lib/routes";
import type { GalleryFrame } from "@/api/types/portfolio/gallery";
import { PillSize, PillVariant } from "@/types/ui";

interface GalleryLightboxProps {
	/** The frames loaded so far (the filtered list). */
	frames: GalleryFrame[];
	/** Kept after close so the exit animation still has a picture. */
	activeId: string | undefined;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onStep: (delta: number) => void;
}

/** Full-screen viewer: arrow keys and buttons flip through the filtered frames, Esc closes. */
export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
	frames,
	activeId,
	open,
	onOpenChange,
	onStep,
}) => {
	const { t } = useTranslation();
	const index = frames.findIndex((f) => f.id === activeId);
	const frame = frames[index];

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") onStep(1);
		if (e.key === "ArrowLeft") onStep(-1);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				overlayClassName="bg-transparent animate-none! supports-backdrop-filter:backdrop-blur-none"
				onKeyDown={onKeyDown}
				className="inset-0 z-150 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none bg-transparent p-0 ring-0 transition-[opacity,scale] duration-500 ease-(--ease-out-expo) data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:duration-1 sm:max-w-none data-open:animate-none! data-closed:animate-none!"
			>
				<DialogTitle className="sr-only">
					{t("gallery.lightbox.title")}
				</DialogTitle>
				<DialogDescription className="sr-only">
					{t("gallery.lightbox.description")}
				</DialogDescription>
				<div className="flex h-full flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-foreground">
					<div className="flex shrink-0 items-center justify-between gap-4 px-[clamp(16px,4vw,48px)] py-4">
						<span className="text-[13px] font-medium tracking-widest text-muted-foreground tabular-nums">
							{frame
								? t("gallery.lightbox.counter", {
										index: index + 1,
										total: frames.length,
									})
								: null}
						</span>
						<PillButton
							variant={PillVariant.Outline}
							size={PillSize.Lg}
							onClick={() => onOpenChange(false)}
						>
							<RiCloseLine data-icon="inline-start" />
							{t("common.close")}
						</PillButton>
					</div>
					<div className="flex min-h-0 grow items-center justify-center px-[clamp(16px,4vw,48px)]">
						{frame ? (
							<div
								key={frame.id}
								style={{
									aspectRatio: `${frame.width} / ${frame.height}`,
								}}
								className="h-full max-h-[calc(100dvh-16rem)] max-w-full animate-rise overflow-hidden rounded-3xl bg-card ring-1 ring-border"
							>
								<GalleryArt
									frame={frame}
									className="block size-full object-contain"
								/>
							</div>
						) : null}
					</div>
					<div className="flex shrink-0 flex-wrap items-center justify-between gap-4 px-[clamp(16px,4vw,48px)] py-5">
						<div className="flex min-w-0 flex-col gap-2">
							<span className="text-[clamp(22px,3vw,40px)] leading-none font-extrabold tracking-[-0.04em]">
								{frame?.projectName}
							</span>
							<span className="flex flex-wrap gap-2">
								{frame?.tags.map((tag) => (
									<TagPill key={tag}>{tag}</TagPill>
								))}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<IconButton
								label={t("common.previous")}
								icon={RiArrowLeftLine}
								onClick={() => onStep(-1)}
							/>
							<IconButton
								label={t("common.next")}
								icon={RiArrowRightLine}
								onClick={() => onStep(1)}
							/>
							{frame ? (
								<PillButton
									size={PillSize.Lg}
									nativeButton={false}
									render={
										<Link
											to={projectPath(frame.projectId)}
											viewTransition
										/>
									}
								>
									{t("gallery.lightbox.project")}
									<RiArrowRightUpLine data-icon="inline-end" />
								</PillButton>
							) : null}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default GalleryLightbox;
