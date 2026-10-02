import React from "react";
import { useTranslation } from "react-i18next";

const COMMENT = /^\s*\/\//;

interface PostCodeProps {
	lang: string;
	text: string;
}

/**
 * Line numbers come from CSS counters (notes.css); long lines scroll inside the block.
 * ponytail: no syntax highlighter; add shiki-light if posts grow.
 */
export const PostCode: React.FC<PostCodeProps> = ({ lang, text }) => {
	const { t } = useTranslation();
	const lines = text.split("\n");
	return (
		<figure className="m-0 my-2 min-w-0 overflow-hidden rounded-[22px] bg-card ring-1 ring-border lg:-mx-8">
			<figcaption className="flex justify-between border-b border-border px-5 py-3 text-xs font-bold text-muted-foreground">
				<span>{lang}</span>
				<span>
					{t("notes.post.code.lines", { count: lines.length })}
				</span>
			</figcaption>
			<pre
				tabIndex={0}
				aria-label={t("notes.post.code.label", { lang })}
				className="m-0 overflow-x-auto p-5 font-mono text-sm leading-[1.7]"
			>
				<code className="block w-max min-w-full [counter-reset:line] *:block *:whitespace-pre *:before:mr-[1.5ch] *:before:inline-block *:before:w-[2.5ch] *:before:text-right *:before:opacity-35 *:before:content-[counter(line)] *:before:select-none *:before:[counter-increment:line]">
					{lines.map((line, i) => (
						<span
							key={i}
							className={
								COMMENT.test(line) ? "opacity-50" : undefined
							}
						>
							{line}
						</span>
					))}
				</code>
			</pre>
		</figure>
	);
};

export default PostCode;
