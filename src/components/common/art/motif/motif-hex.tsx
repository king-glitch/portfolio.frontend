import React from "react";
import { motifHexes } from "@/lib/art/motif-data";

interface MotifHexProps {}

export const MotifHex: React.FC<MotifHexProps> = () => {
	return (
		<>
			{motifHexes.map((hx) => (
				<polygon
					key={hx.pts}
					points={hx.pts}
					fill={hx.filled ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1"
					className={
						hx.blink ? "motion-safe:animate-art-blink" : undefined
					}
					opacity={hx.op}
				/>
			))}
			<g fill="none" stroke="currentColor" strokeWidth="1.5">
				<circle
					cx="200"
					cy="150"
					r="46"
					strokeDasharray="4 4"
					className="origin-[200px_150px] transform-view motion-safe:animate-art-spin-slow"
				/>
				<path d="M186 136 L214 136 L222 150 L214 164 L186 164 L178 150 Z" />
				<circle cx="200" cy="150" r="4" fill="currentColor" />
			</g>
		</>
	);
};

export default MotifHex;
