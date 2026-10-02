import React from "react";
import type { PostSummary } from "@/api/types/portfolio/post";
import { PostCard } from "@/components/shared/posts/post-card";
import { PostCardSkeleton } from "@/components/shared/posts/post-card-skeleton";
import { config } from "@/config";
import { cn } from "@/lib/utils";
import { PostCardVariant } from "@/types/ui";

const STAGGER_STYLE: React.CSSProperties & Record<"--stagger", string> = {
	"--stagger": `${config.notes.staggerPx}px`,
};

interface PostGridProps {
	/** Posts to show; undefined renders 4 card skeletons in the same grid. */
	posts: PostSummary[] | undefined;
	className?: string;
}

/** Two-column grid, every second card dropped by `config.notes.staggerPx` (desktop only, see notes.css). */
export const PostGrid: React.FC<PostGridProps> = ({ posts, className }) => {
	return (
		<div
			style={STAGGER_STYLE}
			className={cn(
				"grid gap-x-[4vw] gap-y-8 md:grid-cols-2 md:*:even:mt-(--stagger)",
				className,
			)}
		>
			{posts
				? posts.map((post) => (
						<PostCard
							key={post.slug}
							post={post}
							variant={PostCardVariant.Grid}
						/>
					))
				: [0, 1, 2, 3].map((i) => <PostCardSkeleton key={i} />)}
		</div>
	);
};

export default PostGrid;
