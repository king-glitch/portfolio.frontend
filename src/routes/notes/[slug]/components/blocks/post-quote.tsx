import React from "react";

interface PostQuoteProps {
	text: string;
}

export const PostQuote: React.FC<PostQuoteProps> = ({ text }) => {
	return (
		<blockquote className="m-0 my-6 p-0 text-[clamp(30px,3.4vw,48px)] leading-[1.12] font-light tracking-[-0.04em]">
			“{text}”
		</blockquote>
	);
};

export default PostQuote;
