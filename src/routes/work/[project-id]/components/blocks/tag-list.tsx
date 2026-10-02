import React from "react";
import { TagPill } from "@/components/common/badges/tag-pill";
import { cn } from "@/lib/utils";

interface TagListProps extends React.ComponentProps<"div"> {
	tags: string[];
}

/** Wrapping row of project tags. */
export const TagList: React.FC<TagListProps> = ({
	tags,
	className,
	...props
}) => {
	return (
		<div className={cn("flex flex-wrap gap-2", className)} {...props}>
			{tags.map((tag) => (
				<TagPill
					key={tag}
					className="h-7 px-3 font-semibold text-muted-foreground"
				>
					{tag}
				</TagPill>
			))}
		</div>
	);
};

export default TagList;
