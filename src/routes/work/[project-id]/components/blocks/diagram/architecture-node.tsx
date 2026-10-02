import React from "react";
import { padCount } from "@/lib/portfolio/project-nav";
import { cn } from "@/lib/utils";

interface ArchitectureNodeProps {
	index: number;
	name: string;
	description: string;
	/** The final node is inverted. */
	last: boolean;
}

/** One box of the architecture flow. */
export const ArchitectureNode: React.FC<ArchitectureNodeProps> = ({
	index,
	name,
	description,
	last,
}) => {
	return (
		<div
			className={cn(
				"box-border flex min-h-55 w-[min(260px,72vw)] shrink-0 flex-col justify-between gap-5 rounded-3xl p-5.5 shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,color] duration-400 mob:min-h-0 mob:w-auto",
				last ? "bg-foreground text-background" : "bg-card",
			)}
		>
			<span className="text-xs font-bold opacity-60">
				{padCount(index)}
			</span>
			<span className="text-2xl leading-[1.05] font-extrabold tracking-[-0.035em]">
				{name}
			</span>
			<span className="text-sm leading-[1.45] opacity-70">
				{description}
			</span>
		</div>
	);
};

export default ArchitectureNode;
