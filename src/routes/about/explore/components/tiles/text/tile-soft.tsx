import React from "react";
import type { TileProps } from "@/types/about";

/** Type specimen cycle: size px at 200 unit, weight, italic. */
const SPECIMENS = [
	{ size: 30, weight: 900, italic: false },
	{ size: 18, weight: 300, italic: true },
	{ size: 24, weight: 600, italic: false },
	{ size: 28, weight: 800, italic: true },
];

interface TileSoftProps extends TileProps {}

/** Soft skills set as a type specimen. */
export const TileSoft: React.FC<TileSoftProps> = ({ data }) => {
	return (
		<div className="flex size-full flex-wrap content-center items-baseline justify-center gap-x-3 gap-y-0.5 p-3.5 text-center">
			{data.items?.map((item, i) => {
				const s = SPECIMENS[i % SPECIMENS.length];
				return (
					<span
						key={item}
						className="leading-[1.1] tracking-[-0.03em]"
						style={{
							fontSize: `calc(${s?.size}px * var(--k))`,
							fontWeight: s?.weight,
							fontStyle: s?.italic ? "italic" : "normal",
						}}
					>
						{item}
					</span>
				);
			})}
		</div>
	);
};

export default TileSoft;
