import React from "react";

interface PostHeadingProps {
	text: string;
}

export const PostHeading: React.FC<PostHeadingProps> = ({ text }) => {
	return (
		<h2 className="m-0 mt-6 text-[clamp(28px,2.8vw,40px)] leading-[1.05] font-extrabold tracking-[-0.045em]">
			{text}
		</h2>
	);
};

export default PostHeading;
