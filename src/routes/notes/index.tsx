import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { postsQuery } from "@/api/queries/portfolio";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import { filterByTag, parseTagParam, uniqueTags } from "@/lib/portfolio/tags";
import { DisplayVariant } from "@/types/ui";
import { FeaturedPost } from "@/routes/notes/components/featured-post";
import { FeaturedPostSkeleton } from "@/routes/notes/components/featured-post-skeleton";
import { PostGrid } from "@/routes/notes/components/post-grid";
import { TagFilter } from "@/routes/notes/components/tag-filter";
import { TagFilterSkeleton } from "@/routes/notes/components/tag-filter-skeleton";
import type { Route } from "./+types/index";

/** Client navigations wait for this page's data, so the transition lands on the loaded page. */
export function clientLoader() {
	return preloadQueries(queryClient.ensureQueryData(postsQuery()));
}

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("notes.meta.title") }];
}

interface NotesProps {}

const Notes: React.FC<NotesProps> = () => {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const tag = parseTagParam(
		searchParams.get(config.portfolio.searchParams.tag),
	);
	const { data: posts, isPending, isError, refetch } = usePosts();

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

	const filtered = posts ? filterByTag(posts, tag) : [];
	const [featured, ...rest] = filtered;

	const renderBody = () => {
		if (isPending) {
			return (
				<>
					<FeaturedPostSkeleton className="mt-16" />
					<PostGrid posts={undefined} className="mt-24" />
				</>
			);
		}
		if (isError) {
			return <QueryErrorAlert onRetry={refetch} className="mt-16" />;
		}
		if (posts.length === 0) {
			return (
				<QueryEmpty
					titleKey="notes.list.all.empty.title"
					descriptionKey="notes.list.all.empty.description"
					className="mt-16"
				/>
			);
		}
		if (!featured) {
			return (
				<QueryEmpty
					titleKey="notes.list.filtered.empty.title"
					descriptionKey="notes.list.filtered.empty.description"
					action={{
						to: config.routes.notes,
						labelKey: "notes.list.filtered.empty.action",
					}}
					className="mt-16"
				/>
			);
		}
		return (
			<>
				<FeaturedPost post={featured} className="mt-16" />
				{rest.length > 0 ? (
					<PostGrid posts={rest} className="mt-24" />
				) : null}
			</>
		);
	};

	return (
		<main className="mx-auto max-w-340 px-[clamp(16px,4vw,48px)] pt-32 pb-24">
			<div className="flex flex-wrap items-end justify-between gap-6">
				<div>
					<Eyebrow>
						{posts ? (
							t("notes.list.count", {
								count: posts.length,
							})
						) : (
							<Skeleton className="inline-block h-3.5 w-32 align-middle" />
						)}
					</Eyebrow>
					<DisplayHeading
						variant={DisplayVariant.Notes}
						render={<h1 />}
						className="mt-3.5"
					>
						{t("notes.list.headline.lines.1")}
						<br />
						<span className="text-outline">
							{t("notes.list.headline.lines.2")}
						</span>
					</DisplayHeading>
				</div>
				{posts ? (
					<TagFilter
						tags={uniqueTags(posts)}
						value={tag}
						onChange={pickTag}
					/>
				) : null}
				{isPending ? <TagFilterSkeleton /> : null}
			</div>
			{renderBody()}
			<p className="mt-24 border-t border-border pt-6 text-[13px] text-muted-foreground">
				{t("notes.list.footnote")}
			</p>
		</main>
	);
};

export default Notes;
