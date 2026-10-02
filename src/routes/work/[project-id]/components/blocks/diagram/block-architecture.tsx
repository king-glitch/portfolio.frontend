import React from "react";
import { useTranslation } from "react-i18next";
import { BlockType } from "@/api/types/portfolio/enums";
import { Panel } from "@/components/common/layout/panel";
import type { BlockProps } from "@/types/work";
import { ArchitectureNode } from "@/routes/work/[project-id]/components/blocks/diagram/architecture-node";
import { PanelHeading } from "@/routes/work/[project-id]/components/blocks/panel-heading";

interface BlockArchitectureProps extends BlockProps<BlockType.Architecture> {}

/** Left-to-right system flow with animated packets on the links. */
export const BlockArchitecture: React.FC<BlockArchitectureProps> = ({
	label,
	nodes,
	index,
}) => {
	const { t } = useTranslation();
	return (
		<Panel className="flex w-auto flex-col justify-between gap-8 mob:overflow-y-auto">
			<PanelHeading index={index}>{label}</PanelHeading>
			<div
				data-speed="1.06"
				className="flex items-center mob:flex-col mob:items-stretch"
			>
				{nodes.map((node, i) => (
					<React.Fragment key={node.name}>
						{i > 0 ? (
							<div
								aria-hidden="true"
								className="relative h-px w-22 shrink-0 bg-foreground opacity-50 mob:h-7 mob:w-px mob:self-center"
							>
								<span
									className="work-packet"
									style={{
										animationDelay: `${(-i * 0.4).toFixed(1)}s`,
									}}
								/>
							</div>
						) : null}
						<ArchitectureNode
							index={i + 1}
							name={node.name}
							description={node.description}
							last={i === nodes.length - 1}
						/>
					</React.Fragment>
				))}
			</div>
			<span className="text-sm text-muted-foreground">
				{t("work.architecture.note")}
			</span>
		</Panel>
	);
};

export default BlockArchitecture;
