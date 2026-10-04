import React from "react";
import type { RemixiconComponentType } from "@remixicon/react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
	label: string;
	value: string;
	/** Small line beside the number, e.g. "3 drafts". */
	hint?: string;
	/** Where the card leads. */
	to: string;
	icon: RemixiconComponentType;
}

/** A compact figure with its label; the whole card is a link. Loading is `StatCardSkeleton`, same outer size. */
export const StatCard: React.FC<StatCardProps> = ({
	label,
	value,
	hint,
	to,
	icon: Icon,
}) => {
	return (
		<Link
			to={to}
			viewTransition
			className="group/stat block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
		>
			<Card className="h-32 justify-between transition-colors group-hover/stat:bg-muted/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-muted-foreground">
						<Icon aria-hidden="true" className="size-4" />
						{label}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-baseline gap-2">
					<span className="text-4xl font-semibold tracking-tight tabular-nums">
						{value}
					</span>
					{hint ? (
						<span className="text-sm text-muted-foreground">
							{hint}
						</span>
					) : null}
				</CardContent>
			</Card>
		</Link>
	);
};

export default StatCard;
