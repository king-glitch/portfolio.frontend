import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { useGallery } from "@/api/hooks/portfolio/gallery/use-gallery";
import { useGalleryTags } from "@/api/hooks/portfolio/gallery/use-gallery-tags";
import { galleryQuery, galleryTagsQuery } from "@/api/queries/portfolio";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import i18n from "@/lib/i18n";
import { parseTagParam } from "@/lib/portfolio/tags";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import { cn } from "@/lib/utils";
import { GalleryFilter } from "@/routes/gallery/components/gallery-filter";
import { GalleryGrid } from "@/routes/gallery/components/gallery-grid";
import { GalleryLightbox } from "@/routes/gallery/components/gallery-lightbox";
import { GallerySentinel } from "@/routes/gallery/components/gallery-sentinel";
import { DisplayVariant } from "@/types/ui";
import type { Route } from "./+types/index";

/** Client navigations wait for the first page and the chips, so the transition lands on the loaded page. */
export function clientLoader({ request }: Route.ClientLoaderArgs) {
	const tag = parseTagParam(
		new URL(request.url).searchParams.get(
			config.portfolio.searchParams.tag,
		),
	);
	return preloadQueries(
		queryClient.ensureInfiniteQueryData(galleryQuery(tag)),
		queryClient.ensureQueryData(galleryTagsQuery()),
	);
}

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("gallery.meta.title") }];
}

interface GalleryProps {}

const Gallery: React.FC<GalleryProps> = () => {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const tag = parseTagParam(
		searchParams.get(config.portfolio.searchParams.tag),
	);
	const gallery = useGallery(tag);
	const tags = useGalleryTags();
	const [activeId, setActiveId] = useState<string>();
	const [open, setOpen] = useState(false);

	const frames = gallery.data?.pages.flatMap((page) => page.frames);

	const pickTag = (next: string | undefined) =>
		setSearchParams(
			(prev) => {
				const params = new URLSearchParams(prev);
				if (next === undefined)
					params.delete(config.portfolio.searchParams.tag);
				else params.set(config.portfolio.searchParams.tag, next);
				return params;
			},
			{ preventScrollReset: true },
		);

	const openFrame = (id: string) => {
		setActiveId(id);
		setOpen(true);
	};
	const loadMore = () => void gallery.fetchNextPage();
	const step = async (delta: number) => {
		if (!frames?.length) return;
		const target = frames.findIndex((f) => f.id === activeId) + delta;
		if (target >= frames.length && gallery.hasNextPage) {
			const next = await gallery.fetchNextPage();
			const loaded = next.data?.pages.flatMap((page) => page.frames);
			setActiveId(loaded?.[target]?.id);
			return;
		}
		setActiveId(frames[(target + frames.length) % frames.length]?.id);
	};

	const renderBody = () => {
		if (gallery.isError && !frames)
			return (
				<QueryErrorAlert onRetry={gallery.refetch} className="mt-16" />
			);
		if (!frames)
			return (
				<GalleryGrid
					frames={undefined}
					onOpen={openFrame}
					className="mt-16"
				/>
			);
		if (!frames.length)
			return (
				<QueryEmpty
					titleKey="gallery.empty.title"
					action={
						tag
							? {
									to: config.routes.gallery,
									labelKey: "gallery.empty.action",
								}
							: undefined
					}
					className="mt-16"
				/>
			);
		return (
			<>
				<GalleryGrid
					frames={frames}
					onOpen={openFrame}
					className={cn(
						"mt-16 transition-opacity duration-300",
						gallery.isPlaceholderData && "opacity-40",
					)}
				/>
				<GallerySentinel
					hasMore={gallery.hasNextPage}
					loading={gallery.isFetchingNextPage}
					failed={gallery.isFetchNextPageError}
					onLoadMore={loadMore}
				/>
			</>
		);
	};

	return (
		<main className="mx-auto max-w-340 px-[clamp(16px,4vw,48px)] pt-32 pb-24">
			<div className="flex flex-wrap items-end justify-between gap-6">
				<div>
					<Eyebrow>
						{tags.data ? (
							t("gallery.count", { count: tags.data.total })
						) : (
							<Skeleton className="inline-block h-3.5 w-28 align-middle" />
						)}
					</Eyebrow>
					<DisplayHeading
						variant={DisplayVariant.Notes}
						render={<h1 />}
						className="mt-3.5"
					>
						{t("gallery.headline.lines.1")}
						<br />
						<span className="text-outline">
							{t("gallery.headline.lines.2")}
						</span>
					</DisplayHeading>
				</div>
				{tags.data ? (
					<div className="max-w-115 desk:flex desk:justify-end">
						<GalleryFilter
							tags={tags.data}
							value={tag}
							onChange={pickTag}
						/>
					</div>
				) : null}
			</div>
			{renderBody()}
			<GalleryLightbox
				frames={frames ?? []}
				activeId={activeId}
				open={open}
				onOpenChange={setOpen}
				onStep={(delta) => void step(delta)}
			/>
		</main>
	);
};

export default Gallery;
