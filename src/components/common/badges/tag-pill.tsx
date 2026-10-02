import React from "react";
import { Badge } from "@/components/ui/badge";

interface TagPillProps {
	children: React.ReactNode;
	className?: string;
}

/** Small outlined tag (project tags, post tags). */
export const TagPill: React.FC<TagPillProps> = ({ children, className }) => {
	return (
		<Badge variant="outline" className={className}>
			{children}
		</Badge>
	);
};

export default TagPill;
