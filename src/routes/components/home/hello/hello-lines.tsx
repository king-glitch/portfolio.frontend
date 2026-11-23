import React from "react";

interface HelloLinesProps {
	lines: string[];
	active: number;
	/** Pinned: only the active line is lit. Otherwise every line is lit. */
	pinned: boolean;
}

/** The about text, one sentence per row; the active row lights up and draws a lead rule. */
export const HelloLines: React.FC<HelloLinesProps> = ({
	lines,
	active,
	pinned,
}) => (
	<ol className="m-0 flex list-none flex-col gap-[clamp(14px,1.8vw,28px)] p-0">
		{lines.map((line, i) => (
			<li
				key={`${i}-${line}`}
				data-on={!pinned || i === active ? "" : undefined}
				data-active={i === active ? "" : undefined}
				className="group/line flex items-start text-[clamp(28px,3.6vw,60px)] leading-[1.06] font-semibold tracking-[-0.035em] text-foreground/15 transition-colors duration-500 ease-(--ease-out-expo) data-on:text-foreground"
			>
				<span
					aria-hidden="true"
					className="mt-[0.56em] mr-0 h-[0.08em] w-0 shrink-0 bg-foreground transition-[width,margin] duration-700 ease-(--ease-out-expo) group-data-active/line:mr-[0.35em] group-data-active/line:w-[0.9em]"
				/>
				<span>{line}</span>
			</li>
		))}
	</ol>
);

export default HelloLines;
