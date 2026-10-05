import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType, MediaFit, MediaTone } from "@/api/types/portfolio/enums";
import { MediaFrame } from "@/components/common/art/media-frame";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Panel } from "@/components/common/layout/panel";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { lifecycleKey } from "@/lib/portfolio/facts";
import { DisplayVariant } from "@/types/ui";
import type { BlockProps } from "@/types/work";
import { TagList } from "@/routes/projects/[project-id]/components/blocks/tag-list";

interface BlockProjectHeaderProps extends BlockProps<BlockType.ProjectHeader> {}

/** Cover: number, title, tagline and the three facts a visitor checks first; key art on the right. */
export const BlockProjectHeader: React.FC<BlockProjectHeaderProps> = ({
	tagline,
	project,
}) => {
	const { t } = useTranslation();
	const meta = [
		{
			id: "position",
			label: t("projects.facts.position"),
			value: project.position,
		},
		{
			id: "period",
			label: t("projects.facts.period"),
			value: project.period,
		},
		{
			id: "lifecycle",
			label: t("projects.facts.lifecycle"),
			value: project.lifecycle ? t(lifecycleKey(project.lifecycle)) : "",
		},
	].filter((item) => item.value);
	return (
		<Panel className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-[4vw] max-desk:grid-cols-1">
			<div className="flex min-w-0 flex-col justify-between gap-8">
				<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
					<Eyebrow className="text-foreground tabular-nums">
						{project.num}
					</Eyebrow>
					<Eyebrow>{t(`common.sides.${project.side}`)}</Eyebrow>
				</div>
				<div className="flex flex-col gap-6">
					<DisplayHeading
						variant={DisplayVariant.ProjectTitle}
						render={<h1 />}
						className="text-[clamp(48px,7.6vw,160px)] leading-[0.88] text-balance"
					>
						{project.name}
					</DisplayHeading>
					{tagline ? (
						<p className="m-0 max-w-160 text-[clamp(20px,2vw,32px)] leading-tight font-semibold tracking-[-0.03em] text-muted-foreground">
							{tagline}
						</p>
					) : null}
					<TagList tags={project.tags} />
				</div>
				<dl className="m-0 grid grid-cols-3 gap-6 border-t border-border pt-4.5 max-desk:grid-cols-1">
					{meta.map((item) => (
						<div key={item.id}>
							<dt>
								<Eyebrow className="text-[11px]">
									{item.label}
								</Eyebrow>
							</dt>
							<dd className="m-0 mt-1.5 text-base font-semibold">
								{item.value}
							</dd>
						</div>
					))}
				</dl>
			</div>
			<div className="relative min-h-55 max-desk:min-h-[50svh]">
				{project.artUrl ? (
					<MediaFrame
						asset={{
							url: project.artUrl,
							alt: project.name,
							fit: MediaFit.Cover,
							tone: MediaTone.Photo,
						}}
						className="size-full rounded-[28px]"
					/>
				) : (
					<div className="size-full overflow-hidden rounded-[28px] ring-1 ring-border">
						<ProjectMotif kind={project.kind} />
					</div>
				)}
				<Eyebrow className="pointer-events-none absolute bottom-4.5 left-5 rounded-pill bg-background px-3 py-1.5 font-semibold tracking-normal text-foreground normal-case">
					{t("projects.header.scroll")}
				</Eyebrow>
			</div>
		</Panel>
	);
};

export default BlockProjectHeader;
