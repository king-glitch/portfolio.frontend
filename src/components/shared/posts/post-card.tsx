import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { PostSummary } from "@/api/types/portfolio/post";
import { TagPill } from "@/components/common/badges/tag-pill";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { notePath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CursorLabel } from "@/types/cursor";
import { PostCardVariant } from "@/types/ui";

const coverVariants = cva("block overflow-hidden ring-1 ring-border", {
	variants: {
		variant: {
			[PostCardVariant.Teaser]: "aspect-4/3 rounded-2xl",
			[PostCardVariant.Grid]: "aspect-16/10 rounded-3xl",
		},
	},
});

const titleVariants = cva("font-extrabold", {
	variants: {
		variant: {
			[PostCardVariant.Teaser]:
				"text-[clamp(22px,2vw,30px)] leading-[1.05] tracking-[-0.04em]",
			[PostCardVariant.Grid]:
				"text-[clamp(26px,2.6vw,40px)] leading-[1.02] tracking-[-0.045em]",
		},
	},
});

interface PostCardProps {
	post: PostSummary;
	variant?: PostCardVariant;
	className?: string;
}

/** Note card linking to the post. Teaser (home): date, read time, title. Grid (notes list): number and tags, excerpt too. */
export const PostCard: React.FC<PostCardProps> = ({
	post,
	variant = PostCardVariant.Teaser,
	className,
}) => {
	const { t } = useTranslation();
	const isGrid = variant === PostCardVariant.Grid;
	const meta = isGrid ? `${post.num} · ${post.tags.join(", ")}` : post.date;
	return (
		<Link
			to={notePath(post.slug)}
			viewTransition
			data-cursor={CursorLabel.Read}
			className={cn("flex flex-col gap-4 text-left", className)}
		>
			<span className={coverVariants({ variant })}>
				<ProjectMotif kind={post.kind} />
			</span>
			<span className="flex justify-between gap-3 text-[13px] text-muted-foreground">
				<span>{meta}</span>
				<span className="flex items-center gap-2">
					{post.sample ? (
						<TagPill>{t("notes.sample")}</TagPill>
					) : null}
					{t("notes.card.read-time", { count: post.readMinutes })}
				</span>
			</span>
			<span className={titleVariants({ variant })}>{post.title}</span>
			{isGrid ? (
				<span className="text-base leading-relaxed text-muted-foreground">
					{post.excerpt}
				</span>
			) : null}
		</Link>
	);
};

export default PostCard;
