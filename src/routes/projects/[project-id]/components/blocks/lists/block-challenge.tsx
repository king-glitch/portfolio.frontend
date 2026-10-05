import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { ItemNumber } from "@/components/common/typography/item-number";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import type { BlockProps } from "@/types/work";
import { PanelHeading } from "@/routes/projects/[project-id]/components/blocks/panel-heading";

interface BlockChallengeProps extends BlockProps<BlockType.Challenge> {}

/** The hard parts as ruled rows: number, problem, then how it was solved. */
export const BlockChallenge: React.FC<BlockChallengeProps> = ({
	label,
	items,
	index,
}) => {
	const { t } = useTranslation();
	return (
		<Panel className="flex w-[min(90vw,1380px)] flex-col gap-10">
			<PanelHeading index={index}>{label}</PanelHeading>
			<div className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-[3vw] max-desk:hidden">
				<span />
				<Eyebrow className="text-[11px]">
					{t("projects.challenge.problem")}
				</Eyebrow>
				<Eyebrow className="text-[11px]">
					{t("projects.challenge.approach")}
				</Eyebrow>
			</div>
			<ol className="m-0 flex list-none flex-col p-0">
				{items.map((item, i) => (
					<li
						key={item.problem}
						className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-[3vw] gap-y-3 border-t border-border py-6 max-desk:grid-cols-[2.5rem_minmax(0,1fr)]"
					>
						<ItemNumber n={i + 1} />
						<p className="m-0 text-[clamp(20px,1.8vw,28px)] leading-tight font-semibold tracking-tight">
							{item.problem}
						</p>
						{item.approach ? (
							<p className="m-0 text-[clamp(16px,1.2vw,19px)] leading-normal text-muted-foreground max-desk:col-start-2">
								{item.approach}
							</p>
						) : null}
					</li>
				))}
			</ol>
		</Panel>
	);
};

export default BlockChallenge;
