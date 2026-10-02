import React from "react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { padCount } from "@/lib/portfolio/project-nav";
import { DisplayVariant } from "@/types/ui";
import type { BlockProps } from "@/types/work";
import { Eyebrow } from "@/components/common/typography/eyebrow";

interface BlockBigNumberProps extends BlockProps<BlockType.BigNumber> {}

/** One huge figure with a label and caption. */
export const BlockBigNumber: React.FC<BlockBigNumberProps> = ({
	value,
	label,
	caption,
	index,
}) => {
	return (
		<Panel className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-end gap-[4vw] max-desk:grid-cols-1">
			<div
				data-speed="0.88"
				className="text-[clamp(140px,24vw,440px)] leading-[0.78] font-black tracking-[-0.085em] whitespace-nowrap"
			>
				{value}
			</div>
			<div data-speed="1.1" className="flex flex-col gap-4.5 pb-3">
				<Eyebrow>({padCount(index)})</Eyebrow>
				<DisplayHeading variant={DisplayVariant.Subhead}>
					{label}
				</DisplayHeading>
				<p className="m-0 text-[17px] leading-[1.55] text-muted-foreground">
					{caption}
				</p>
			</div>
		</Panel>
	);
};

export default BlockBigNumber;
