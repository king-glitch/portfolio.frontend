import React from "react";

interface ProgressBarProps {
	/** The scroller writes `scaleX(current / max)` to this element every frame. */
	ref: React.Ref<HTMLDivElement>;
}

/** Hairline scroll progress along the bottom edge of the top bar. */
export const ProgressBar: React.FC<ProgressBarProps> = ({ ref }) => {
	return (
		<div
			aria-hidden="true"
			className="absolute inset-x-0 bottom-0 h-px bg-border"
		>
			<div
				ref={ref}
				className="h-px origin-left bg-foreground will-change-transform"
				style={{ transform: "scaleX(0)" }}
			/>
		</div>
	);
};

export default ProgressBar;
