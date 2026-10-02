import React from "react";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface CounterReelProps {
	digit: number;
	/** Transition delay in seconds (the units reel trails the tens reel). */
	delay: number;
}

/** One digit reel: a 0-9 column moved with `transform` only. Rolls in on mount. */
export const CounterReel: React.FC<CounterReelProps> = ({ digit, delay }) => {
	return (
		<span className="inline-block h-[1em] overflow-hidden leading-none">
			<span
				className="flex flex-col transition-[translate] duration-1000 ease-(--ease-out-expo) motion-reduce:transition-none starting:[translate:0_0]"
				style={{
					translate: `0 ${-digit}em`,
					transitionDelay: `${delay}s`,
				}}
			>
				{DIGITS.map((d) => (
					<span key={d} className="block h-[1em]">
						{d}
					</span>
				))}
			</span>
		</span>
	);
};

export default CounterReel;
