import React from "react";
import { NotFoundError } from "@/api/errors";
import { usePost } from "@/api/hooks/portfolio/use-post";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { postQuery, postsQuery } from "@/api/queries/portfolio";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { preloadQueries } from "@/lib/route-data";
import { NextNote } from "@/routes/notes/[slug]/components/next-note";
import { PostBody } from "@/routes/notes/[slug]/components/post-body";
import { PostHeader } from "@/routes/notes/[slug]/components/post-header";
import { PostProgress } from "@/routes/notes/[slug]/components/post-progress";
import { PostSkeleton } from "@/routes/notes/[slug]/components/post-skeleton";
import type { Route } from "./+types/index";

/** Client navigations wait for this page's data, so the transition lands on the loaded page. */
export function clientLoader({ params }: Route.ClientLoaderArgs) {
	return preloadQueries(
		queryClient.ensureQueryData(postQuery(params.slug)),
		queryClient.ensureQueryData(postsQuery()),
	);
}

export function meta(_args: Route.MetaArgs) {
	return [{ title: i18n.t("notes.meta.title") }];
}

interface NoteProps extends Route.ComponentProps {}

const Note: React.FC<NoteProps> = ({ params }) => {
	const {
		data: post,
		error,
		isPending,
		isError,
		refetch,
	} = usePost(params.slug);

	if (isPending) return <PostSkeleton />;
	if (isError) {
		return (
			<main className="mx-auto max-w-340 px-[clamp(16px,4vw,48px)] pt-32 pb-24">
				{error instanceof NotFoundError ? (
					<QueryEmpty
						titleKey="notes.post.not-found.title"
						descriptionKey="notes.post.not-found.description"
						action={{
							to: config.routes.notes,
							labelKey: "notes.post.not-found.action",
						}}
					/>
				) : (
					<QueryErrorAlert onRetry={refetch} />
				)}
			</main>
		);
	}
	return (
		<main>
			<PostProgress post={post} />
			<article className="px-[clamp(16px,4vw,48px)] pt-18 pb-24">
				<PostHeader post={post} />
				<PostBody post={post} />
			</article>
			<NextNote slug={post.slug} />
		</main>
	);
};

export default Note;
