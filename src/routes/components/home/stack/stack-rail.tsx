import React from "react";

interface StackRailProps {
	/** 0-based active stop. */
	index: number;
	/** Number of stops on the rail. */
	count: number;
}

/** Vertical wire beside the stop list: fills down to the active stop, with a pulsing packet riding it. */
export const StackRail: React.FC<StackRailProps> = ({ index, count }) => {
	const centre = ((index + 0.5) / count) * 100;
	return (
		<div
			aria-hidden="true"
			className="absolute inset-y-0 left-0 w-px bg-border"
		>
			<span
				className="absolute inset-0 origin-top bg-foreground transition-[scale] duration-700 ease-(--ease-out-expo) motion-reduce:transition-none"
				style={{ scale: `1 ${centre / 100}` }}
			/>
			<span
				className="absolute -left-1 size-2.25 -translate-y-1/2 transition-[top] duration-700 ease-(--ease-out-expo) motion-reduce:transition-none"
				style={{ top: `${centre}%` }}
			>
				<span className="absolute inset-0 rounded-full bg-foreground motion-safe:animate-ping" />
				<span className="absolute inset-0 rounded-full bg-foreground" />
			</span>
		</div>
	);
};

export default StackRail;
