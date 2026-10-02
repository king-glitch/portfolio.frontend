import React from "react";
import { useTranslation } from "react-i18next";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { HeroWord } from "@/routes/components/home/hero/hero-word";
import { config } from "@/config";
import { DisplayVariant } from "@/types/ui";

interface HeroTitleProps {}

/** "Quiet code / [behind] loud products." with staggered word rise; `behind` sits in a wiping inverted box. */
export const HeroTitle: React.FC<HeroTitleProps> = () => {
	const { t } = useTranslation();
	const { wordBaseDelayS, secondLineBaseDelayS, wordStaggerS } = config.home.hero;
	const first = t("home.hero.title.line-1").split(" ");
	const second = t("home.hero.title.line-2").split(" ");
	return (
		<DisplayHeading
			variant={DisplayVariant.Hero}
			render={<h1 />}
			className="px-4"
		>
			<span className="block">
				{first.map((word, i) => (
					<React.Fragment key={word}>
						<HeroWord delayS={wordBaseDelayS + i * wordStaggerS}>
							{word}
						</HeroWord>{" "}
					</React.Fragment>
				))}
			</span>
			<span className="mt-[0.04em] block">
				<span className="relative mr-[0.2em] inline-block px-[0.14em]">
					<span
						aria-hidden="true"
						className="gated absolute inset-x-0 top-[0.04em] bottom-[0.02em] origin-left animate-box-in rounded-[0.14em] bg-foreground motion-reduce:animate-none"
					/>
					<HeroWord delayS={0.34} className="relative text-background">
						{t("home.hero.title.behind")}
					</HeroWord>
				</span>
				{second.map((word, i) => (
					<React.Fragment key={word}>
						<HeroWord delayS={secondLineBaseDelayS + i * wordStaggerS}>
							{word}
						</HeroWord>{" "}
					</React.Fragment>
				))}
			</span>
		</DisplayHeading>
	);
};

export default HeroTitle;
