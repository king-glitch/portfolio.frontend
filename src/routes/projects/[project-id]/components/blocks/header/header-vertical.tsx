import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import type { BlockParams } from "@/types/work";
import { ArtFrame } from "@/routes/projects/[project-id]/components/blocks/art-frame";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { TagList } from "@/routes/projects/[project-id]/components/blocks/tag-list";

interface HeaderVerticalProps extends BlockParams<BlockType.ProjectHeader> {}

/** Vertical title, art, details. The title shrinks to fit the viewport height; it lies flat on mobile. */
export const HeaderVertical: React.FC<HeaderVerticalProps> = ({
	title,
	subtitle,
	index,
	discipline,
	tags,
	kind,
}) => {
	const { t } = useTranslation();
	const fit: React.CSSProperties & Record<"--chars", number> = {
		"--chars": title.length,
	};
	return (
		<Panel className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,0.8fr)] grid-rows-[minmax(0,1fr)] gap-[4vw] max-desk:grid-cols-1 max-desk:grid-rows-none">
			<h1
				data-speed="0.9"
				style={fit}
				className="m-0 rotate-180 text-[min(clamp(64px,9vw,170px),calc((100svh-13rem)/(var(--chars)*0.56)))] leading-[0.82] font-black tracking-[-0.07em] whitespace-nowrap [writing-mode:vertical-rl] max-desk:rotate-0 max-desk:text-[clamp(40px,13vw,96px)] max-desk:whitespace-normal max-desk:[writing-mode:horizontal-tb]"
			>
				{title}
			</h1>
			<ArtFrame kind={kind} data-speed="1.15" className="min-h-55" />
			<div className="flex flex-col justify-between gap-6">
				<Eyebrow>{index}</Eyebrow>
				<div className="flex flex-col gap-4.5">
					<span className="text-[clamp(22px,2vw,30px)] leading-[1.15] font-bold tracking-[-0.03em]">
						{subtitle}
					</span>
					<span className="text-[15px] text-muted-foreground">
						{t(`common.sides.${discipline}`)}
					</span>
					<TagList tags={tags} />
				</div>
			</div>
		</Panel>
	);
};

export default HeaderVertical;
