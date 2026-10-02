import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { nextPost } from "@/lib/portfolio/tags";
import { notePath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";

interface NextNoteProps {
	slug: string;
}

/** Footer link to the next post in list order (wraps). Reads the cached list; hidden if it fails or has no match. */
export const NextNote: React.FC<NextNoteProps> = ({ slug }) => {
	const { t } = useTranslation();
	const { data: posts, isPending, isError, refetch } = usePosts();
	if (isPending) return <Skeleton className="h-64 w-full rounded-none" />;
	if (isError) return <QueryErrorAlert onRetry={refetch} />;
	const next = posts ? nextPost(posts, slug) : undefined;
	if (!next) return null;
	return (
		<Link
			to={notePath(next.slug)}
			viewTransition
			data-cursor={CursorLabel.Next}
			aria-label={t("notes.post.next.aria-label", { title: next.title })}
			className="block w-full border-t border-border bg-card px-[clamp(16px,4vw,48px)] pt-18 pb-24 text-left"
		>
			<span className="mx-auto block max-w-340">
				<span className="block text-[13px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
					{t("notes.post.next.eyebrow", { num: next.num })}
				</span>
				<span className="notes-outline mt-5 block text-[clamp(40px,7vw,120px)] leading-[0.92] font-extrabold tracking-[-0.065em]">
					{next.title}
				</span>
			</span>
		</Link>
	);
};

export default NextNote;
