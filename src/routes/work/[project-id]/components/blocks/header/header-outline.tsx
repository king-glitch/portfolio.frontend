import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Panel } from "@/components/common/layout/panel";
import { PanelWidth, type BlockParams } from "@/types/work";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { TagList } from "@/routes/work/[project-id]/components/blocks/tag-list";

interface HeaderOutlineProps extends BlockParams<BlockType.ProjectHeader> {}

/** Wide panel with an outlined title. */
export const HeaderOutline: React.FC<HeaderOutlineProps> = ({
	title,
	subtitle,
	index,
	discipline,
	tags,
	kind,
}) => {
	const { t } = useTranslation();
	return (
		<Panel
			width={PanelWidth.Wide}
			className="flex flex-col justify-between overflow-hidden"
		>
			<div className="flex flex-wrap justify-between gap-6">
				<Eyebrow>
					{index} — {subtitle}
				</Eyebrow>
				<TagList tags={tags} />
			</div>
			<h1
				data-speed="0.85"
				className="m-0 text-[clamp(80px,19vw,360px)] leading-[0.8] font-black tracking-[-0.075em] whitespace-nowrap text-outline"
			>
				{title}
			</h1>
			<div className="flex items-end justify-between gap-6">
				<span className="text-[clamp(18px,1.6vw,24px)] font-bold tracking-[-0.02em]">
					{t(`common.sides.${discipline}`)}
				</span>
				<div
					data-speed="1.3"
					className="aspect-4/3 w-[min(34vw,460px)] overflow-hidden rounded-3xl ring-1 ring-border"
				>
					<ProjectMotif kind={kind} />
				</div>
			</div>
		</Panel>
	);
};

export default HeaderOutline;
