import React from "react";
import { cn } from "@/lib/utils";
import { StackUsedIn } from "@/routes/components/home/stack/stack-used-in";
import type { StackStop } from "@/api/types/portfolio/project";

interface StackStageProps {
	stop: StackStop;
	/** 0-based position of `stop`. */
	index: number;
	/** Number of stops. */
	total: number;
	/** Padded project count, or "--" while loading. */
	count: string;
	className?: string;
}

/**
 * Inverted "live stage" for the selected stop. Its copy is keyed by stop so each change
 * wipes in from the top (`animate-stage-in`) while a giant outlined index sits behind it.
 */
export const StackStage: React.FC<StackStageProps> = ({
	stop,
	index,
	total,
	count,
	className,
}) => {
	const n = String(index + 1).padStart(2, "0");
	return (
		<div
			className={cn(
				"relative isolate flex min-h-96 flex-col justify-between gap-10 overflow-hidden bg-foreground p-7 text-background desk:p-11",
				className,
			)}
		>
			<span
				key={`n-${stop.id}`}
				aria-hidden="true"
				className="pointer-events-none absolute -right-2 bottom-[-0.18em] -z-1 text-[clamp(160px,22vw,320px)] leading-none font-extrabold tracking-[-0.06em] text-outline-inverse opacity-20 select-none motion-safe:animate-stage-in"
			>
				{n}
			</span>
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between gap-4 font-mono text-xs tabular-nums opacity-60">
					<span>{`${n} / ${String(total).padStart(2, "0")}`}</span>
					<span>{`×${count}`}</span>
				</div>
				<div aria-hidden="true" className="grid grid-cols-5 gap-1.5">
					{Array.from({ length: total }, (_, i) => (
						<span
							key={i}
							className="h-0.5 origin-left bg-background/20 transition-[background-color] duration-500 data-on:bg-background"
							data-on={i <= index ? "" : undefined}
						/>
					))}
				</div>
			</div>
			<div
				key={stop.id}
				aria-live="polite"
				className="flex flex-col gap-4 motion-safe:animate-stage-in"
			>
				<h3 className="m-0 text-[clamp(34px,4vw,64px)] leading-[0.96] font-semibold tracking-[-0.03em]">
					{stop.name}
				</h3>
				<p className="m-0 max-w-lg text-[clamp(16px,1.25vw,19px)] leading-relaxed opacity-80">
					{stop.description}
				</p>
			</div>
			<div className="border-t border-background/20 pt-6">
				<StackUsedIn stop={stop} />
			</div>
		</div>
	);
};

export default StackStage;
