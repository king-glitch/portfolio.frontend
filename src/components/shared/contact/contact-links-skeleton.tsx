import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ContactLinksSkeletonProps {
	className?: string;
}

const PILLS = ["email", "github", "linkedin"];

/** Three pill-sized placeholders, same height as ContactLinks (md pill, 38px). */
export const ContactLinksSkeleton: React.FC<ContactLinksSkeletonProps> = ({
	className,
}) => {
	return (
		<div className={cn("flex flex-wrap gap-3", className)}>
			{PILLS.map((pill) => (
				<Skeleton key={pill} className="h-9.5 w-32 rounded-pill" />
			))}
		</div>
	);
};

export default ContactLinksSkeleton;
