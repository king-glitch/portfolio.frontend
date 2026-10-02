import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { config } from "@/config";
import { TerminalWeight, type TerminalLine as Line } from "@/types/terminal";

const lineVariants = cva("m-0 wrap-break-word whitespace-pre-wrap", {
	variants: {
		weight: {
			[TerminalWeight.Normal]: "font-normal",
			[TerminalWeight.Bold]: "font-bold",
		},
	},
});

interface TerminalLineProps {
	line: Line;
}

/** One output line; translates `key` at render, prints `prefix`/`raw` data as is. */
export const TerminalLine: React.FC<TerminalLineProps> = ({ line }) => {
	const { t } = useTranslation();
	const text = line.key ? t(line.key, line.values) : line.raw;
	return (
		<p
			style={{ opacity: config.terminal.lineOpacities[line.opacity] }}
			className={lineVariants({ weight: line.weight })}
		>
			{line.prefix}
			{text}
		</p>
	);
};

export default TerminalLine;
