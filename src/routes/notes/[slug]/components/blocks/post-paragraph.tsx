import React from "react";

interface PostParagraphProps {
	text: string;
}

export const PostParagraph: React.FC<PostParagraphProps> = ({ text }) => {
	return <p className="m-0 text-[19px] leading-[1.75]">{text}</p>;
};

export default PostParagraph;
