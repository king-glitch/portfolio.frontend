import React from "react";
import { useTranslation } from "react-i18next";
import { usePreloader } from "@/contexts/preloader-context";
import { config } from "@/config";
import { HeroFan } from "@/routes/components/home/hero/hero-fan";
import { HeroTitle } from "@/routes/components/home/hero/hero-title";

interface HeroProps {}

/** Home hero: eyebrow, headline, card deck, lede and the scroll cue. Entrance motion waits for the preloader. */
export const Hero: React.FC<HeroProps> = () => {
	const { t } = useTranslation();
	const { loaded } = usePreloader();
	return (
		<section
			id={config.sections.top}
			data-loaded={loaded}
			className="flex flex-col items-center pb-10 text-center"
		>
			<div className="flex w-full flex-col items-center pt-[clamp(120px,19svh,170px)] desk:h-svh">
				<p className="m-0 mb-7 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
					{t("home.hero.eyebrow")}
				</p>
				<HeroTitle />
				<HeroFan />
			</div>
			<p className="m-0 mt-[clamp(40px,5vw,72px)] max-w-180 px-4 text-[clamp(17px,1.6vw,24px)] leading-normal tracking-[-0.01em]">
				{t("home.hero.lede.text")}{" "}
				<span className="text-muted-foreground">
					{t("home.hero.lede.accent")}
				</span>
			</p>
			<a
				href={`#${config.sections.about}`}
				data-magnetic=""
				aria-label={t("home.hero.scroll.aria-label")}
				className="mt-12 flex size-16 items-center justify-center overflow-hidden rounded-full shadow-[inset_0_0_0_1px_var(--foreground)] transition-transform duration-500 ease-(--ease-out-expo) outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
			>
				<span className="block size-1.5 animate-scroll-dot rounded-full bg-foreground motion-reduce:animate-none" />
			</a>
		</section>
	);
};

export default Hero;
