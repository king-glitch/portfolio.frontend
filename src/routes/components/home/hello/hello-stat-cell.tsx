import React from "react";
import { cn } from "@/lib/utils";

interface HelloStatCellProps extends React.ComponentProps<"div"> {}

/** Ruled cell of the stats row (shared by the loaded stat and its skeleton). */
export const HelloStatCell: React.FC<HelloStatCellProps> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				"relative flex min-h-[clamp(240px,30vw,420px)] flex-col justify-between gap-8 overflow-hidden border-b p-6 desk:border-r desk:border-b-0",
				className,
			)}
			{...props}
		/>
	);
};

export default HelloStatCell;
