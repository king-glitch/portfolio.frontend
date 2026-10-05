import React from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import { Eyebrow } from "@/components/common/typography/eyebrow";
import { padCount } from "@/lib/portfolio/project-nav";
import type { BlockProps } from "@/types/work";

interface BlockLinksProps extends BlockProps<BlockType.Links> {}

/** Where to see the project live; nothing renders while the project has no links. */
export const BlockLinks: React.FC<BlockLinksProps> = ({
	label,
	index,
	project,
}) => {
	if (!project.links.length) return null;
	return (
		<Panel className="flex w-[min(64vw,880px)] flex-col justify-between gap-10">
			<Eyebrow>
				({padCount(index)}) {label}
			</Eyebrow>
			<ul className="m-0 grid list-none p-0">
				{project.links.map((link) => (
					<li key={link.url} className="border-t border-border">
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center justify-between gap-6 py-5 text-[clamp(28px,3.4vw,56px)] leading-none font-bold tracking-[-0.045em] no-underline"
						>
							<span className="underline-offset-8 group-hover:underline">
								{link.label}
							</span>
							<RiArrowRightUpLine
								aria-hidden="true"
								className="size-[0.8em] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
							/>
						</a>
					</li>
				))}
			</ul>
		</Panel>
	);
};

export default BlockLinks;
