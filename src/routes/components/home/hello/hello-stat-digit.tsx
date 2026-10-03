import React from "react";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

interface HelloStatDigitProps {
	digit: number;
	/** False parks the reel at 0; true rolls it to `digit`. */
	shown: boolean;
	delayMs: number;
}

/** One odometer reel: ten stacked digits, shifted by `--d` lines so the roll is a single transform. */
export const HelloStatDigit: React.FC<HelloStatDigitProps> = ({
	digit,
	shown,
	delayMs,
}) => {
	const style: React.CSSProperties & Record<"--d", number> = {
		"--d": shown ? digit : 0,
		transitionDelay: `${delayMs}ms`,
	};
	return (
		<span
			aria-hidden="true"
			className="relative mx-[-0.04em] mr-[-0.1em] inline-block h-[0.9em] overflow-hidden px-[0.04em] pr-[0.1em] leading-[0.9]"
		>
			<span
				style={style}
				className="block transform-[translateY(calc(var(--d)*-0.9em))] transition-transform duration-1400 ease-(--ease-out-expo) motion-reduce:transition-none"
			>
				{DIGITS.map((d) => (
					<span key={d} className="block h-[0.9em]">
						{d}
					</span>
				))}
			</span>
		</span>
	);
};

export default HelloStatDigit;
