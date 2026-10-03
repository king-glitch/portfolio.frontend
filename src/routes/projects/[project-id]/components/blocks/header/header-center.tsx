import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Panel } from "@/components/common/layout/panel";
import type { BlockParams } from "@/types/work";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { TagList } from "@/routes/projects/[project-id]/components/blocks/tag-list";

interface HeaderCenterProps extends BlockParams<BlockType.ProjectHeader> {}

/** Giant centred title over a faded motif. */
export const HeaderCenter: React.FC<HeaderCenterProps> = ({
	title,
	index,
	discipline,
	tags,
	kind,
	imageUrl,
}) => {
	const { t } = useTranslation();
	return (
		<Panel className="flex flex-col items-center justify-between overflow-hidden text-center">
			<div
				data-speed="1.3"
				aria-hidden="true"
				className="absolute inset-0 opacity-35"
			>
				<ProjectMotif
					kind={kind}
					imageUrl={imageUrl}
					className="bg-background text-foreground"
				/>
			</div>
			<Eyebrow className="relative">
				{index} · {t(`common.sides.${discipline}`)}
			</Eyebrow>
			<h1
				data-speed="0.92"
				className="relative m-0 text-[clamp(64px,13vw,240px)] leading-[0.84] font-black tracking-[-0.075em]"
			>
				{title}
			</h1>
			<TagList tags={tags} className="relative justify-center" />
		</Panel>
	);
};

export default HeaderCenter;
