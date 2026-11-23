import React from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import type { TimelineEntry } from "@/lib/portfolio/timeline";
import { DisplayVariant } from "@/types/ui";

interface TimelineDetailProps {
	entry: TimelineEntry;
}

/** Editorial readout of the selected career bar: oversized tabular period + role beside engineering notes. */
export const TimelineDetail: React.FC<TimelineDetailProps> = ({ entry }) => {
	return (
		<div className="mt-10 grid gap-8 desk:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] desk:gap-16">
			<div className="flex flex-col gap-3">
				<span className="text-[clamp(22px,2.2vw,34px)] leading-none font-light tracking-tight text-muted-foreground tabular-nums">
					{entry.period}
				</span>
				<DisplayHeading
					variant={DisplayVariant.Subhead}
					render={<h3 />}
				>
					{entry.title}
				</DisplayHeading>
			</div>
			<div className="flex flex-col divide-y divide-border/60 border-t border-border/60">
				{entry.notes.map((note) => (
					<p
						key={note}
						className="m-0 py-4 text-[15px] leading-relaxed text-muted-foreground first:pt-4"
					>
						{note}
					</p>
				))}
			</div>
		</div>
	);
};

export default TimelineDetail;
