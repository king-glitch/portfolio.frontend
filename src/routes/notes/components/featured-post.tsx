import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { PostSummary } from "@/api/types/portfolio/post";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { TagPill } from "@/components/common/badges/tag-pill";
import { notePath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CursorLabel } from "@/types/cursor";

interface FeaturedPostProps {
	post: PostSummary;
	className?: string;
}

/** First post of the (filtered) list, large. */
export const FeaturedPost: React.FC<FeaturedPostProps> = ({
	post,
	className,
}) => {
	const { t } = useTranslation();
	const meta = [
		post.num,
		post.date,
		t("notes.card.read-time", { count: post.readMinutes }),
	];
	return (
		<Link
			to={notePath(post.slug)}
			viewTransition
			data-cursor={CursorLabel.Read}
			className={cn(
				"grid items-end gap-8 text-left md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-[4vw]",
				className,
			)}
		>
			<span className="relative block aspect-4/3 overflow-hidden rounded-[28px] ring-1 ring-border">
				<ProjectMotif kind={post.kind} imageUrl={post.artUrl} />
				<TagPill className="absolute top-4 left-4.5 bg-background">
					{t("notes.list.featured.badge")}
				</TagPill>
			</span>
			<span className="flex flex-col gap-5 pb-2">
				<span className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
					{meta.map((item) => (
						<span key={item}>{item}</span>
					))}
					{post.sample ? (
						<TagPill>{t("notes.sample")}</TagPill>
					) : null}
				</span>
				<span className="text-[clamp(36px,4.4vw,72px)] leading-[0.96] font-extrabold tracking-[-0.055em]">
					{post.title}
				</span>
				<span className="text-lg leading-normal text-muted-foreground">
					{post.excerpt}
				</span>
				<span className="text-[15px] font-bold">
					{t("notes.list.featured.action")}
				</span>
			</span>
		</Link>
	);
};

export default FeaturedPost;
