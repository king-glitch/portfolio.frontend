import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { HeroTag } from "@/types/home";

const tagVariants = cva("pointer-events-none absolute z-50 max-lg:hidden", {
	variants: {
		tag: {
			[HeroTag.Scalable]: "-top-4.5 left-[13%]",
			[HeroTag.Optimized]: "-bottom-7.5 left-[40%]",
			[HeroTag.Secure]: "-top-3 right-[12%]",
		},
	},
});

const pillVariants = cva(
	"relative inline-block rounded-pill bg-foreground px-4.5 py-2 text-[15px] font-semibold text-background shadow-md",
	{
		variants: {
			tag: {
				[HeroTag.Scalable]: "-rotate-8",
				[HeroTag.Optimized]: "-rotate-3",
				[HeroTag.Secure]: "rotate-7",
			},
		},
	},
);

const arrowVariants = cva("absolute size-3 rotate-45 bg-foreground", {
	variants: {
		tag: {
			[HeroTag.Scalable]: "-bottom-1.25 left-[48%]",
			[HeroTag.Optimized]: "-top-1.25 left-[44%]",
			[HeroTag.Secure]: "-bottom-1.25 left-[44%]",
		},
	},
});

interface HeroTagsProps {}

/** Three floating speech-bubble tags around the deck; hidden on phones and tablets. */
export const HeroTags: React.FC<HeroTagsProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			{Object.values(HeroTag).map((tag) => (
				<span
					key={tag}
					aria-hidden="true"
					className={tagVariants({ tag })}
				>
					<span className={pillVariants({ tag })}>
						{t(`home.hero.tags.${tag}`)}
						<span className={arrowVariants({ tag })} />
					</span>
				</span>
			))}
		</>
	);
};

export default HeroTags;
