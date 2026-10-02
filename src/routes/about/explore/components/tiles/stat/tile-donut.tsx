import React from "react";
import { TileCaption } from "@/routes/about/explore/components/tiles/tile-caption";
import type { TileProps } from "@/types/about";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface TileDonutProps extends TileProps {}

/** Ring showing `ratio` with its percentage in the middle. */
export const TileDonut: React.FC<TileDonutProps> = ({ data }) => {
	const ratio = data.ratio ?? 0;
	return (
		<div className="flex size-full items-center justify-center gap-4 p-3.5">
			<span className="relative size-(--wall-donut) flex-none">
				<svg
					viewBox="0 0 132 132"
					aria-hidden="true"
					className="size-full -rotate-90"
				>
					<circle
						cx="66"
						cy="66"
						r={RADIUS}
						fill="none"
						stroke="currentColor"
						strokeWidth="16"
						opacity="0.14"
					/>
					<circle
						cx="66"
						cy="66"
						r={RADIUS}
						fill="none"
						stroke="currentColor"
						strokeWidth="16"
						strokeLinecap="round"
						strokeDasharray={`${(CIRCUMFERENCE * ratio).toFixed(1)} ${CIRCUMFERENCE.toFixed(1)}`}
					/>
				</svg>
				<span className="absolute inset-0 flex items-center justify-center text-(length:--wall-m) font-extrabold tracking-[-0.04em]">
					{Math.round(ratio * 100)}%
				</span>
			</span>
			<TileCaption data={data} className="max-w-40" />
		</div>
	);
};

export default TileDonut;
