import React from "react";
import { cn } from "@/lib/utils";

interface MetaCodeProps {
	children: React.ReactNode;
	className?: string;
}

/** Tabular monospace metadata label (indices, periods, counters). */
export const MetaCode: React.FC<MetaCodeProps> = ({ children, className }) => {
	return (
		<span
			className={cn(
				"font-mono text-xs font-medium text-muted-foreground tabular-nums",
				className,
			)}
		>
			{children}
		</span>
	);
};

export default MetaCode;
