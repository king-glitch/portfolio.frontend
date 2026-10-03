import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType, HeaderVariant } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { DisplayVariant } from "@/types/ui";
import type { BlockParams } from "@/types/work";
import { ArtFrame } from "@/routes/projects/[project-id]/components/blocks/art-frame";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { TagList } from "@/routes/projects/[project-id]/components/blocks/tag-list";

const ART_ORDER: Record<HeaderVariant, string> = {
	[HeaderVariant.Split]: "",
	[HeaderVariant.SplitRev]: "order-first",
	[HeaderVariant.Center]: "",
	[HeaderVariant.Outline]: "",
	[HeaderVariant.Vertical]: "",
};

interface HeaderSplitProps extends BlockParams<BlockType.ProjectHeader> {}

/** Title left, art right (`split-rev` flips the art to the left). */
export const HeaderSplit: React.FC<HeaderSplitProps> = ({
	variant,
	title,
	subtitle,
	index,
	discipline,
	tags,
	kind,
	imageUrl,
}) => {
	const { t } = useTranslation();
	const meta = [
		{ id: "index", label: t("projects.header.index"), value: index },
		{
			id: "discipline",
			label: t("projects.header.discipline"),
			value: t(`common.sides.${discipline}`),
		},
		{ id: "project", label: t("projects.header.project"), value: subtitle },
	];
	return (
		<Panel className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-[4vw] max-desk:grid-cols-1">
			<div className="flex min-w-0 flex-col justify-between gap-8">
				<TagList tags={tags} data-speed="0.9" />
				<DisplayHeading
					variant={DisplayVariant.ProjectTitle}
					render={<h1 />}
					data-speed="1.08"
				>
					{title}
				</DisplayHeading>
				<dl className="m-0 grid grid-cols-3 gap-6 border-t border-border pt-4.5 max-desk:grid-cols-1">
					{meta.map((item) => (
						<div key={item.id}>
							<dt>
								<Eyebrow className="text-[11px]">
									{item.label}
								</Eyebrow>
							</dt>
							<dd className="m-0 mt-1.5 text-base font-semibold tabular-nums">
								{item.value}
							</dd>
						</div>
					))}
				</dl>
			</div>
			<ArtFrame
				kind={kind}
				imageUrl={imageUrl}
				data-speed="1.22"
				className={ART_ORDER[variant]}
			>
				<Eyebrow className="absolute bottom-4.5 left-5 font-semibold tracking-normal normal-case">
					{t("projects.header.scroll")}
				</Eyebrow>
			</ArtFrame>
		</Panel>
	);
};

export default HeaderSplit;
