import React from "react";
import { PostBlockType } from "@/api/types/portfolio/enums";
import type { PostBlock as PostBlockData } from "@/api/types/portfolio/post";
import { PostCallout } from "@/routes/notes/[slug]/components/blocks/post-callout";
import { PostCode } from "@/routes/notes/[slug]/components/blocks/post-code";
import { PostHeading } from "@/routes/notes/[slug]/components/blocks/post-heading";
import { PostList } from "@/routes/notes/[slug]/components/blocks/post-list";
import { PostParagraph } from "@/routes/notes/[slug]/components/blocks/post-paragraph";
import { PostQuote } from "@/routes/notes/[slug]/components/blocks/post-quote";

interface PostBlockProps {
	block: PostBlockData;
}

/**
 * One renderer per block type. A switch (not a `Record<PostBlockType, FC>`)
 * because TS cannot correlate `block.type` with a registry entry without a cast;
 * the `satisfies never` arm still fails typecheck on a new `PostBlockType`.
 */
export const PostBlock: React.FC<PostBlockProps> = ({ block }) => {
	switch (block.type) {
		case PostBlockType.Paragraph:
			return <PostParagraph text={block.text} />;
		case PostBlockType.Heading:
			return <PostHeading text={block.text} />;
		case PostBlockType.List:
			return <PostList items={block.items} />;
		case PostBlockType.Code:
			return <PostCode lang={block.lang} text={block.text} />;
		case PostBlockType.Quote:
			return <PostQuote text={block.text} />;
		case PostBlockType.Callout:
			return <PostCallout text={block.text} />;
		default:
			return block satisfies never;
	}
};

export default PostBlock;
