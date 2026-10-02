import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { ProjectMotif } from "@/components/common/art/project-motif";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";
import { Eyebrow } from "@/components/common/typography/eyebrow";

interface BlockMotifFullProps extends BlockProps<BlockType.MotifFull> {}

/** Full-bleed motif with an optional caption card. */
export const BlockMotifFull: React.FC<BlockMotifFullProps> = ({
	kind,
	label,
	index,
}) => {
	return (
		<Panel className="overflow-hidden p-0 max-desk:p-0">
			<div data-speed="1.25" className="absolute inset-0">
				<ProjectMotif
					kind={kind}
					className="bg-background text-foreground"
				/>
			</div>
			{label ? (
				<div className="absolute bottom-18 left-[clamp(16px,5vw,80px)] max-w-140 rounded-3xl bg-background px-6.5 py-6 ring-1 ring-border">
					<Eyebrow>
						({padCount(index)}) {label}
					</Eyebrow>
				</div>
			) : null}
		</Panel>
	);
};

export default BlockMotifFull;
