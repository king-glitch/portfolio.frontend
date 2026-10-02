import React from "react";
import type { Post } from "@/api/types/portfolio/post";
import { PostBlock } from "@/routes/notes/[slug]/components/post-block";

interface PostBodyProps {
	post: Post;
}

/** Lead excerpt then the blocks, 720px column. */
export const PostBody: React.FC<PostBodyProps> = ({ post }) => {
	return (
		<div className="mx-auto mt-18 flex max-w-180 flex-col gap-7">
			<p className="m-0 text-[clamp(22px,2vw,28px)] leading-[1.45] font-medium tracking-[-0.02em]">
				{post.excerpt}
			</p>
			{post.blocks.map((block, i) => (
				<PostBlock key={i} block={block} />
			))}
		</div>
	);
};

export default PostBody;
