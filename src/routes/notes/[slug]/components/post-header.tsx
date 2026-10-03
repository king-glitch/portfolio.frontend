import React from "react";
import { useTranslation } from "react-i18next";
import type { Post } from "@/api/types/portfolio/post";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { TagPill } from "@/components/common/badges/tag-pill";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { DisplayVariant } from "@/types/ui";

interface PostHeaderProps {
	post: Post;
}

/** Tags, title, byline and the 21:9 motif banner. */
export const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
	const { t } = useTranslation();
	const byline = [
		t("notes.post.author"),
		post.date,
		t("notes.card.read-time", { count: post.readMinutes }),
	];
	return (
		<header className="mx-auto max-w-275">
			<div className="flex flex-wrap gap-2">
				{post.tags.map((tag) => (
					<TagPill key={tag}>{tag}</TagPill>
				))}
				{post.sample ? <TagPill>{t("notes.sample")}</TagPill> : null}
			</div>
			<DisplayHeading
				variant={DisplayVariant.Post}
				render={<h1 />}
				className="mt-7"
			>
				{post.title}
			</DisplayHeading>
			<div className="mt-7 flex flex-wrap gap-5 text-[15px] text-muted-foreground">
				{byline.map((item) => (
					<span key={item}>{item}</span>
				))}
			</div>
			<div className="mt-14 aspect-21/9 overflow-hidden rounded-[28px] ring-1 ring-border">
				<ProjectMotif kind={post.kind} imageUrl={post.artUrl} />
			</div>
		</header>
	);
};

export default PostHeader;
