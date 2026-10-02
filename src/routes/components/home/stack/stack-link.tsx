import React from "react";

interface StackLinkProps {
	/** Negative seconds: staggers the packet so links do not pulse in sync. */
	delayS: number;
}

/** Thin line between two stops with a packet sliding along it (CSS `left` keyframes). Vertical and static on mobile. */
export const StackLink: React.FC<StackLinkProps> = ({ delayS }) => {
	return (
		<div
			aria-hidden="true"
			className="relative h-px min-w-5 flex-[1_1_0] bg-foreground/45 max-desk:h-7 max-desk:w-px max-desk:flex-none max-desk:self-center"
		>
			<span
				className="absolute -top-0.75 left-0 size-1.75 animate-packet rounded-full bg-foreground motion-reduce:hidden max-desk:hidden"
				style={{ animationDelay: `${delayS.toFixed(2)}s` }}
			/>
		</div>
	);
};

export default StackLink;
