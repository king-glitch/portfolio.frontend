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

const coverVariants = cva(
	"block overflow-hidden rounded-2xl ring-1 ring-border transition-colors duration-200 group-hover/post:ring-foreground/30",
	{
		variants: {
			variant: {
				[PostCardVariant.Teaser]: "aspect-video",
				[PostCardVariant.Grid]: "aspect-16/10",
			},
		},
	},
);

const titleVariants = cva(
	"font-semibold transition-opacity duration-200 group-hover/post:opacity-75",
	{
		variants: {
			variant: {
				[PostCardVariant.Teaser]:
					"text-[clamp(19px,1.5vw,24px)] leading-snug tracking-tight",
				[PostCardVariant.Grid]:
					"text-[clamp(24px,2.2vw,34px)] leading-tight tracking-tight",
			},
		},
	},
);

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
			className={cn(
				"group/post flex flex-col gap-3.5 text-left",
				className,
			)}
		>
			<span className={coverVariants({ variant })}>
				<ProjectMotif kind={post.kind} imageUrl={post.artUrl} />
			</span>
			<span className="flex justify-between gap-3 font-mono text-xs text-muted-foreground tabular-nums">
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
				<span className="text-[15px] leading-relaxed text-muted-foreground">
					{post.excerpt}
				</span>
			) : null}
		</Link>
	);
};

export default PostCard;
