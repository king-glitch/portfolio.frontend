import React from "react";
import { cva } from "class-variance-authority";
import { Link } from "react-router";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { padCount } from "@/lib/portfolio/project-nav";
import { projectPath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";
import type { BlockProps } from "@/types/work";
import { Eyebrow } from "@/components/common/typography/eyebrow";

const nameVariants = cva(
	"text-[clamp(44px,7.5vw,140px)] leading-[0.92] font-black tracking-[-0.07em]",
	{ variants: { outline: { true: "text-left text-outline" } } },
);

interface BlockLineageProps extends BlockProps<BlockType.Lineage> {}

/** "From -> to" lineage; the source name links to that project when it exists. */
export const BlockLineage: React.FC<BlockLineageProps> = ({
	label,
	from,
	fromId,
	to,
	text,
	index,
}) => {
	return (
		<Panel className="flex flex-col justify-between gap-7">
			<Eyebrow>
				({padCount(index)}) {label}
			</Eyebrow>
			<div className="flex flex-col gap-1">
				{fromId ? (
					<Link
						to={projectPath(fromId)}
						viewTransition
						data-cursor={CursorLabel.Open}
						className={nameVariants({ outline: true })}
					>
						{from}
					</Link>
				) : (
					<span className={nameVariants({ outline: true })}>
						{from}
					</span>
				)}
				<svg
					width="72"
					height="72"
					viewBox="0 0 72 72"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					aria-hidden="true"
					className="my-2 ml-3"
				>
					<path d="M8 8 V44 H60 M46 30 L60 44 L46 58" />
				</svg>
				<span className={nameVariants()}>{to}</span>
			</div>
			<p className="m-0 max-w-140 text-[clamp(17px,1.5vw,22px)] leading-normal text-muted-foreground">
				{text}
			</p>
		</Panel>
	);
};

export default BlockLineage;
