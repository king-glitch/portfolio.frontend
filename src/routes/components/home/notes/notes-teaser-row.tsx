import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { PostSummary } from "@/api/types/portfolio/post";
import { MetaCode } from "@/components/common/typography/meta-code";
import { notePath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";

interface NotesTeaserRowProps {
	post: PostSummary;
	/** 0-based position, shown as 01…. */
	index: number;
}

/**
 * Compact note row (number, title, meta). Hover or keyboard focus opens it: the row grows
 * (`grid-rows` 0fr → 1fr), the excerpt and tags wipe in and a rule draws along the bottom.
 * Touch pointers and reduced motion get it open from the start.
 */
export const NotesTeaserRow: React.FC<NotesTeaserRowProps> = ({
	post,
	index,
}) => {
	const { t } = useTranslation();
	return (
		<Link
			to={notePath(post.slug)}
			viewTransition
			data-cursor={CursorLabel.Read}
			className="group/note relative grid items-start gap-x-6 gap-y-3 border-b py-8 transition-opacity duration-300 outline-none max-desk:grid-cols-1 desk:grid-cols-[88px_minmax(0,1fr)_auto]"
		>
			<span className="text-[clamp(28px,2.5vw,42px)] leading-none font-light tracking-tighter text-muted-foreground tabular-nums transition-colors duration-300 group-hover/note:text-foreground group-focus-visible/note:text-foreground">
				{String(index + 1).padStart(2, "0")}
			</span>
			<div className="min-w-0">
				<h3 className="m-0 text-[clamp(22px,2.2vw,34px)] leading-[1.1] font-semibold tracking-tight transition-transform duration-500 ease-(--ease-out-expo) group-hover/note:translate-x-2 group-focus-visible/note:translate-x-2">
					{post.title}
				</h3>
				<div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-(--ease-out-expo) group-hover/note:grid-rows-[1fr] group-focus-visible/note:grid-rows-[1fr] motion-reduce:grid-rows-[1fr] pointer-coarse:grid-rows-[1fr]">
					<div className="overflow-hidden">
						<div className="flex -translate-y-2 flex-col gap-3 pt-4 transition-[clip-path,translate] duration-700 ease-(--ease-out-expo) [clip-path:inset(0_0_100%_0)] group-hover/note:translate-y-0 group-hover/note:[clip-path:inset(0)] group-focus-visible/note:translate-y-0 group-focus-visible/note:[clip-path:inset(0)] motion-reduce:translate-y-0 motion-reduce:[clip-path:inset(0)] pointer-coarse:translate-y-0 pointer-coarse:[clip-path:inset(0)]">
							<p className="m-0 max-w-160 text-[15px] leading-relaxed text-muted-foreground">
								{post.excerpt}
							</p>
							{post.tags.length > 0 ? (
								<MetaCode>{post.tags.join(" · ")}</MetaCode>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between gap-4 desk:flex-col desk:items-end desk:gap-2">
				<MetaCode>
					{t("notes.card.meta", {
						date: post.date,
						count: post.readMinutes,
					})}
				</MetaCode>
				<span
					aria-hidden="true"
					className="text-lg text-muted-foreground transition-[translate,rotate,color] duration-500 ease-(--ease-out-expo) group-hover/note:translate-x-1 group-hover/note:-translate-y-1 group-hover/note:text-foreground group-focus-visible/note:text-foreground"
				>
					↗
				</span>
			</div>
			<span
				aria-hidden="true"
				className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-foreground transition-transform duration-700 ease-(--ease-out-expo) group-hover/note:scale-x-100 group-focus-visible/note:scale-x-100"
			/>
		</Link>
	);
};

export default NotesTeaserRow;
