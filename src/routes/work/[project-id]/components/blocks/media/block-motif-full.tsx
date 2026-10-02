import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";
import { PanelLabel } from "@/routes/work/[project-id]/components/blocks/panel-label";

interface BlockMotifFullProps extends BlockProps<BlockType.MotifFull> {}

/** Full-bleed motif with an optional caption card. */
export const BlockMotifFull: React.FC<BlockMotifFullProps> = ({
	kind,
	label,
	index,
}) => {
	return (
		<Panel className="overflow-hidden p-0 mob:p-0">
			<div data-speed="1.25" className="absolute inset-0">
				<ProjectMotif
					kind={kind}
					className="bg-background text-foreground"
				/>
			</div>
			{label ? (
				<div className="absolute bottom-18 left-[clamp(16px,5vw,80px)] max-w-140 rounded-3xl bg-background px-6.5 py-6 ring-1 ring-border">
					<PanelLabel>
						({padCount(index)}) {label}
					</PanelLabel>
				</div>
			) : null}
		</Panel>
	);
};

export default BlockMotifFull;
