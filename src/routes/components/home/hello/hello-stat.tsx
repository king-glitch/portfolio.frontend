import React, { useRef } from "react";
import { RiArrowRightUpLine } from "@remixicon/react";
import { HelloStatCell } from "@/routes/components/home/hello/hello-stat-cell";
import { HelloStatDigit } from "@/routes/components/home/hello/hello-stat-digit";
import { useReducedMotion } from "@/hooks/motion/use-reduced-motion";
import { useInView } from "@/hooks/physics/use-in-view";
import { padCount } from "@/lib/motion/reveal";

const REEL_STAGGER_MS = 140;

interface HelloStatProps {
	/** 1-based position, shown as "01". */
	index: number;
	value: number;
	/** Minimum digits (zero padded). */
	pad: number;
	suffix?: string;
	label: string;
	/** Data line revealed on hover. */
	hint: string;
}

/**
 * Stat cell: odometer numerals roll in whenever the cell enters the viewport, the numeral drifts
 * with the pointer, and hovering floods the cell with the foreground colour and reveals the hint.
 */
export const HelloStat: React.FC<HelloStatProps> = ({
	index,
	value,
	pad,
	suffix,
	label,
	hint,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const shown = useInView(ref, "0px 0px -15% 0px") || reduced;
	const text = padCount(value, pad);

	const drift = (e: React.PointerEvent<HTMLDivElement>) => {
		const box = e.currentTarget.getBoundingClientRect();
		const { style } = e.currentTarget;
		style.setProperty(
			"--px",
			String(((e.clientX - box.left) / box.width - 0.5) * 2),
		);
		style.setProperty(
			"--py",
			String(((e.clientY - box.top) / box.height - 0.5) * 2),
		);
	};
	const settle = (e: React.PointerEvent<HTMLDivElement>) => {
		e.currentTarget.style.setProperty("--px", "0");
		e.currentTarget.style.setProperty("--py", "0");
	};

	return (
		<HelloStatCell
			ref={ref}
			onPointerMove={drift}
			onPointerLeave={settle}
			className="group/stat isolate bg-background"
		>
			{/* Own blend group (isolate + opaque bg) and a layer that lives before hover: Chrome/Safari
			    otherwise promote the flood on hover-in and demote it at the end, re-rasterizing the
			    difference blend each time, which blinks the cell. */}
			<span
				aria-hidden="true"
				className="absolute inset-0 origin-bottom scale-y-0 bg-foreground transition-transform duration-700 ease-(--ease-out-expo) will-change-transform group-hover/stat:scale-y-100"
			/>
			{/* Difference blend: white text reads as foreground on the page and as background on the flood, at every frame of the wipe. */}
			<div className="relative flex flex-1 flex-col justify-between gap-8 text-white mix-blend-difference">
				<div className="flex items-start justify-between text-[13px] font-medium tracking-widest text-white/60 tabular-nums">
					<span>{padCount(index, 2)}</span>
					<RiArrowRightUpLine
						aria-hidden="true"
						className="size-5 transition-transform duration-500 ease-(--ease-out-expo) group-hover/stat:rotate-45"
					/>
				</div>
				<span
					role="img"
					aria-label={`${value}${suffix ?? ""}`}
					className="flex [translate:calc(var(--px,0)*14px)_calc(var(--py,0)*8px)] items-baseline text-[clamp(88px,13vw,220px)] leading-[0.9] font-extrabold tracking-[-0.07em] tabular-nums transition-[translate] duration-500 ease-out"
				>
					{[...text].map((char, i) => (
						<HelloStatDigit
							// ponytail: digits never reorder, position is the identity
							key={i}
							digit={Number(char)}
							shown={shown}
							delayMs={i * REEL_STAGGER_MS}
						/>
					))}
					<span aria-hidden="true" className="text-white/50">
						{suffix}
					</span>
				</span>
				<div className="flex min-h-28 flex-col gap-2">
					<span className="max-w-60 text-sm leading-[1.4] font-medium">
						{label}
					</span>
					<span className="translate-y-2 text-[13px] leading-[1.4] text-white/70 opacity-0 transition-[opacity,translate] duration-500 ease-(--ease-out-expo) group-hover/stat:translate-y-0 group-hover/stat:opacity-100 max-desk:translate-y-0 max-desk:opacity-100">
						{hint}
					</span>
				</div>
			</div>
		</HelloStatCell>
	);
};

export default HelloStat;
