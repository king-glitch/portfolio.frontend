import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { lifecycleKey, projectFacts } from "@/lib/portfolio/facts";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";

interface BlockOverviewProps extends BlockProps<BlockType.Overview> {}

/** The pitch (`project.about`) beside a fact sheet: role, period, team, status, platforms, chains, stack. */
export const BlockOverview: React.FC<BlockOverviewProps> = ({
	label,
	index,
	project,
}) => {
	const { t } = useTranslation();
	const rows = [
		...(project.lifecycle
			? [
					{
						id: "lifecycle",
						label: t("projects.facts.lifecycle"),
						value: t(lifecycleKey(project.lifecycle)),
					},
				]
			: []),
		...projectFacts(project).map((fact) => ({
			id: fact.id,
			label: t(fact.labelKey),
			value: fact.value,
		})),
	];
	return (
		<Panel className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-[6vw] max-desk:grid-cols-1">
			<div className="flex flex-col justify-between gap-10">
				<Eyebrow>
					({padCount(index)}) {label}
				</Eyebrow>
				<p className="m-0 max-w-[24ch] text-[clamp(26px,3vw,52px)] leading-[1.12] font-semibold tracking-[-0.035em] text-balance max-desk:max-w-none">
					{project.about}
				</p>
			</div>
			<dl className="m-0 flex flex-col self-end">
				{rows.map((row) => (
					<div
						key={row.id}
						className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-6 border-t border-border py-4"
					>
						<dt>
							<Eyebrow className="text-[11px]">
								{row.label}
							</Eyebrow>
						</dt>
						<dd className="m-0 font-semibold">{row.value}</dd>
					</div>
				))}
			</dl>
		</Panel>
	);
};

export default BlockOverview;
