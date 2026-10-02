import React from "react";

interface PostListProps {
	items: string[];
}

export const PostList: React.FC<PostListProps> = ({ items }) => {
	return (
		<ol className="m-0 flex list-none flex-col border-t border-border p-0">
			{items.map((item, i) => (
				<li
					key={item}
					className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-border py-4 text-lg leading-normal"
				>
					<span className="pt-1 text-[13px] font-bold text-muted-foreground tabular-nums">
						{String(i + 1).padStart(2, "0")}
					</span>
					<span>{item}</span>
				</li>
			))}
		</ol>
	);
};

export default PostList;
