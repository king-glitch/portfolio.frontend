import React from "react";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import type { TimelineEntry } from "@/lib/portfolio/timeline";
import { DisplayVariant } from "@/types/ui";

interface TimelineDetailProps {
	entry: TimelineEntry;
}

/** Period, title and notes of the selected bar. */
export const TimelineDetail: React.FC<TimelineDetailProps> = ({ entry }) => {
	return (
		<div className="mt-12 grid gap-12 border-t pt-8 desk:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
			<div className="flex flex-col gap-2.5">
				<span className="text-sm text-muted-foreground tabular-nums">
					{entry.period}
				</span>
				<DisplayHeading
					variant={DisplayVariant.Subhead}
					render={<h3 />}
				>
					{entry.title}
				</DisplayHeading>
			</div>
			<div className="flex flex-col gap-4">
				{entry.notes.map((note) => (
					<p
						key={note}
						className="m-0 text-lg leading-relaxed text-muted-foreground"
					>
						{note}
					</p>
				))}
			</div>
		</div>
	);
};

export default TimelineDetail;
