import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Post } from "@/api/types/portfolio/post";
import { PillButton } from "@/components/common/buttons/pill-button";
import { config } from "@/config";
import { useReadProgress } from "@/hooks/scroll/use-read-progress";
import { PillVariant } from "@/types/ui";

interface PostProgressProps {
	post: Post;
}

/** Sticky bar: back link, title, read time and the scroll progress line. */
export const PostProgress: React.FC<PostProgressProps> = ({ post }) => {
	const { t } = useTranslation();
	const barRef = useRef<HTMLDivElement>(null);
	useReadProgress(barRef);
	return (
		<div className="sticky top-0 z-4 border-b border-border bg-background">
			<div className="mx-auto flex max-w-340 items-center justify-between gap-4 px-[clamp(16px,4vw,48px)] py-4.5">
				<PillButton
					variant={PillVariant.Outline}
					nativeButton={false}
					render={<Link to={config.routes.notes} viewTransition />}
				>
					{t("notes.post.back")}
				</PillButton>
				<span className="max-w-[50vw] truncate text-[13px] font-semibold">
					{post.title}
				</span>
				<span className="text-[13px] whitespace-nowrap text-muted-foreground">
					{t("notes.card.read-time", { count: post.readMinutes })}
				</span>
			</div>
			<div
				ref={barRef}
				role="progressbar"
				aria-label={t("notes.post.progress.aria-label")}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={0}
				className="origin-left bg-foreground"
				style={{
					height: config.notes.progress.minHeightPx,
					transform: "scaleX(0)",
				}}
			/>
		</div>
	);
};

export default PostProgress;
