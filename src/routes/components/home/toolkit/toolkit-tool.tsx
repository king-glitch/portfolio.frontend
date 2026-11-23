import React from "react";

interface ToolkitToolProps {
	name: string;
	/** Projects that list this tool; 0 hides the count. */
	count: number;
	/** Stable `view-transition-name` so the word morphs when the filter changes. */
	morphName: string;
}

/** One tool in the specimen flow; hover lifts a superscript project count. */
export const ToolkitTool: React.FC<ToolkitToolProps> = ({
	name,
	count,
	morphName,
}) => (
	<span
		data-tool=""
		className="group/tool inline-flex cursor-default items-start text-[clamp(22px,2.3vw,36px)] leading-tight font-medium tracking-tight text-foreground transition-opacity duration-200"
		style={{ viewTransitionName: morphName }}
	>
		{name}
		{count > 0 ? (
			<sup className="ml-1 translate-y-1 font-mono text-xs font-medium tabular-nums opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-out-expo) group-hover/tool:translate-y-0 group-hover/tool:opacity-60">
				{`×${String(count).padStart(2, "0")}`}
			</sup>
		) : null}
	</span>
);

export default ToolkitTool;
