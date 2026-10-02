import React from "react";
import { useProject } from "@/api/hooks/portfolio/use-project";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { Panel } from "@/components/common/layout/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { BlockRenderer } from "@/routes/projects/[project-id]/components/blocks/block-renderer";

interface NextProjectUnderlayProps {
	id: string;
}

/**
 * The next project's first panel, rendered exactly as its own page renders it, so the hand-off
 * after the curtain leaves is seamless. Empty projects fall back to a plain panel.
 */
export const NextProjectUnderlay: React.FC<NextProjectUnderlayProps> = ({
	id,
}) => {
	const project = useProject(id);
	if (project.isPending)
		return (
			<Panel className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-[4vw] max-desk:grid-cols-1">
				<Skeleton className="size-full" />
				<Skeleton className="min-h-50 rounded-[28px]" />
			</Panel>
		);
	if (project.isError)
		return (
			<Panel className="flex items-center justify-center">
				<QueryErrorAlert
					onRetry={() => void project.refetch()}
					className="max-w-md"
				/>
			</Panel>
		);
	const first = project.data.blocks[0];
	if (!first) return <Panel />;
	return (
		<BlockRenderer
			block={first}
			index={1}
			projectKind={project.data.kind}
		/>
	);
};

export default NextProjectUnderlay;
