import React from "react";
import { useTranslation } from "react-i18next";
import { highlight } from "sugar-high";
import { lang as resolveLang } from "sugar-high/lang";
import { config } from "@/config";

interface PostCodeProps {
	lang: string;
	text: string;
}

/**
 * Highlighted code block, Catppuccin Latte (light) / Mocha (dark) via the `--sh-*` / `--code-*` tokens.
 * Line numbers are CSS counters on sugar-high's line spans; long lines scroll inside the block.
 * Safe as HTML: sugar-high escapes the source, which is our own post data.
 */
export const PostCode: React.FC<PostCodeProps> = ({ lang, text }) => {
	const { t } = useTranslation();
	const lines = text.split("\n").length;
	const html = highlight(text, {
		lang: resolveLang(lang) ?? config.notes.codeFallbackLang,
	});
	return (
		<figure className="m-0 my-2 min-w-0 overflow-hidden rounded-[22px] bg-code-background text-code-foreground ring-1 ring-code-border lg:-mx-8">
			<figcaption className="flex justify-between border-b border-code-border bg-code-header px-5 py-3 text-xs font-bold text-code-muted">
				<span>{lang}</span>
				<span>{t("notes.post.code.lines", { count: lines })}</span>
			</figcaption>
			<pre
				tabIndex={0}
				aria-label={t("notes.post.code.label", { lang })}
				className="m-0 overflow-x-auto p-5 font-mono text-sm leading-[1.7]"
			>
				<code
					className="block w-max min-w-full [counter-reset:line] *:before:mr-[1.5ch] *:before:inline-block *:before:w-[2.5ch] *:before:text-right *:before:text-code-muted *:before:content-[counter(line)] *:before:select-none *:before:[counter-increment:line] [&_.sh\_\_token--comment]:italic"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</pre>
		</figure>
	);
};

export default PostCode;
