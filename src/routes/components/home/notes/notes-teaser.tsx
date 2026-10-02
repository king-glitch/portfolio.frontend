import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { PostCard } from "@/components/shared/posts/post-card";
import { PostCardSkeleton } from "@/components/shared/posts/post-card-skeleton";
import { config } from "@/config";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { HomeTitle } from "@/routes/components/home/home-title";
import { HomePad } from "@/types/home";
import { PillSize, PillVariant } from "@/types/ui";

interface NotesTeaserProps {}

/** The three newest notes with a link to the full list. */
export const NotesTeaser: React.FC<NotesTeaserProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = usePosts();
	const posts = (data ?? []).slice(0, config.home.notes.teaserCount);

	const renderCards = () => {
		if (isPending)
			return Array.from(
				{ length: config.home.notes.teaserCount },
				(_, i) => <PostCardSkeleton key={i} />,
			);
		if (isError)
			return (
				<QueryErrorAlert
					onRetry={() => void refetch()}
					className="col-span-full"
				/>
			);
		if (!posts.length)
			return (
				<QueryEmpty
					titleKey="home.notes.empty.title"
					className="col-span-full"
				/>
			);
		return posts.map((post) => <PostCard key={post.slug} post={post} />);
	};

	return (
		<HomeSection id={config.sections.notes} pad={HomePad.Bottom}>
			<HomeSectionHead
				index={8}
				label={t("home.notes.eyebrow")}
				title={
					<HomeTitle
						lines={[
							t("home.notes.lines.1"),
							t("home.notes.lines.2"),
						]}
					/>
				}
				aside={
					<PillButton
						variant={PillVariant.Strong}
						size={PillSize.Lg}
						magnetic
						nativeButton={false}
						render={
							<Link to={config.routes.notes} viewTransition />
						}
					>
						{t("home.notes.all")}
					</PillButton>
				}
			/>
			<div className="mt-14 grid gap-6 max-desk:grid-cols-1 desk:grid-cols-3">
				{renderCards()}
			</div>
		</HomeSection>
	);
};

export default NotesTeaser;
