import React from "react";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { HeroTag } from "@/types/home";

const tagVariants = cva(
	"pointer-events-none absolute z-50 animate-bob gated motion-reduce:animate-none max-desk:hidden",
	{
		variants: {
			tag: {
				[HeroTag.AlwaysOn]: "-top-4.5 left-[13%]",
				[HeroTag.GameReady]: "-bottom-7.5 left-[40%]",
				[HeroTag.ZeroDrama]: "-top-3 right-[12%]",
			},
		},
	},
);

const pillVariants = cva(
	"relative inline-block rounded-pill bg-foreground px-5 py-2.75 text-[17px] font-bold text-background shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]",
	{
		variants: {
			tag: {
				[HeroTag.AlwaysOn]: "-rotate-12",
				[HeroTag.GameReady]: "-rotate-4",
				[HeroTag.ZeroDrama]: "rotate-10",
			},
		},
	},
);

const arrowVariants = cva("absolute size-3 rotate-45 bg-foreground", {
	variants: {
		tag: {
			[HeroTag.AlwaysOn]: "-bottom-1.25 left-[48%]",
			[HeroTag.GameReady]: "-top-1.25 left-[44%]",
			[HeroTag.ZeroDrama]: "-bottom-1.25 left-[44%]",
		},
	},
});

interface HeroTagsProps {}

/** Three floating speech-bubble tags around the deck; hidden on mobile. */
export const HeroTags: React.FC<HeroTagsProps> = () => {
	const { t } = useTranslation();
	return (
		<>
			{Object.values(HeroTag).map((tag, i) => (
				<span
					key={tag}
					aria-hidden="true"
					className={tagVariants({ tag })}
					style={{ animationDelay: `${-i * 1.5}s` }}
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
