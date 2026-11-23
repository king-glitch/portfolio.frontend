import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { usePosts } from "@/api/hooks/portfolio/post/use-posts";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { MetaCode } from "@/components/common/typography/meta-code";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { notePath } from "@/lib/routes";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { HomeTitle } from "@/routes/components/home/home-title";
import { NotesTeaserRow } from "@/routes/components/home/notes/notes-teaser-row";
import { CursorLabel } from "@/types/cursor";
import { HomePad } from "@/types/home";
import { PillSize, PillVariant } from "@/types/ui";

interface NotesTeaserProps {}

/** Numbered publication ledger: compact rows that open on hover/focus while siblings dim. */
export const NotesTeaser: React.FC<NotesTeaserProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = usePosts();
	const posts = (data ?? []).slice(0, config.home.notes.teaserCount);

	const renderBody = () => {
		if (isPending)
			return (
				<div className="mt-14 divide-y border-y">
					{Array.from(
						{ length: config.home.notes.teaserCount },
						(_, i) => (
							<div
								key={i}
								className="grid gap-6 py-9 desk:grid-cols-[88px_minmax(0,1.4fr)_minmax(0,1fr)_auto]"
							>
								{/* style-lint-ignore-next-line repeated-siblings -- each bar mirrors a different cell (number, title, excerpt, meta) of the loaded row */}
								<Skeleton className="h-9 w-12" />
								<Skeleton className="h-9 w-4/5" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-5 w-24" />
							</div>
						),
					)}
				</div>
			);
		if (isError)
			return (
				<QueryErrorAlert
					onRetry={() => void refetch()}
					className="mt-14"
				/>
			);
		if (!posts.length)
			return (
				<QueryEmpty
					titleKey="home.notes.empty.title"
					className="mt-14"
				/>
			);
		return (
			<div className="mt-14 border-t [&:hover_a:not(:hover):not(:focus-visible)]:opacity-35">
				{posts.map((post, i) => (
					<NotesTeaserRow key={post.slug} post={post} index={i} />
				))}
			</div>
		);
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
						variant={PillVariant.Outline}
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
			{renderBody()}
		</HomeSection>
	);
};

export default NotesTeaser;
