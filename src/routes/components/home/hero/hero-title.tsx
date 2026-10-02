import React from "react";
import { useTranslation } from "react-i18next";
import { DisplayHeading } from "@/components/common/typography/display-heading";
import { HeroWord } from "@/routes/components/home/hero/hero-word";
import { config } from "@/config";
import { useSecretUnlock } from "@/hooks/use-secret-unlock";
import { MascotBuddy } from "@/components/common/mascot/mascot-buddy";
import { SecretWord } from "@/types/home";
import { BubbleSide, DisplayVariant } from "@/types/ui";

interface HeroTitleProps {}

/** "Quiet code / [behind] loud products." with staggered word rise; `behind` sits in a wiping inverted box. */
export const HeroTitle: React.FC<HeroTitleProps> = () => {
	const { t } = useTranslation();
	const { wordBaseDelayS, secondLineBaseDelayS, wordStaggerS } =
		config.home.hero;
	const first = t("home.hero.lines.1").split(" ");
	const second = t("home.hero.lines.2").split(" ");
	const secret = useSecretUnlock();
	return (
		<DisplayHeading
			variant={DisplayVariant.Hero}
			render={<h1 />}
			className="px-4"
		>
			<span className="block">
				{first.map((word, i) => (
					<React.Fragment key={word}>
						<HeroWord
							delayS={wordBaseDelayS + i * wordStaggerS}
							onClick={
								i === 0
									? () => secret.onWord(SecretWord.Quiet)
									: undefined
							}
						>
							{word}
						</HeroWord>{" "}
					</React.Fragment>
				))}
			</span>
			<span className="mt-[0.04em] block">
				<span
					onPointerDown={secret.onHoldStart}
					onPointerUp={secret.onHoldEnd}
					onPointerLeave={secret.onHoldEnd}
					onPointerCancel={secret.onHoldEnd}
					className="relative mr-[0.2em] inline-block touch-none px-[0.14em] select-none"
				>
					<span
						ref={secret.boxRef}
						aria-hidden="true"
						className="absolute inset-x-0 top-[0.04em] bottom-[0.02em] origin-left animate-box-in rounded-[0.14em] bg-foreground gated motion-reduce:animate-none"
					/>
					<HeroWord
						delayS={0.34}
						className="relative text-background"
					>
						{t("home.hero.behind")}
					</HeroWord>
				</span>
				{second.map((word, i) => (
					<React.Fragment key={word}>
						<HeroWord
							delayS={secondLineBaseDelayS + i * wordStaggerS}
							onClick={
								i === 0
									? () => secret.onWord(SecretWord.Loud)
									: undefined
							}
						>
							{word}
						</HeroWord>{" "}
					</React.Fragment>
				))}
				{/* The mascot sits in the headline like one more word; it pops in after the last one. */}
				<span
					className="relative z-60 inline-block animate-fan-in align-middle gated motion-reduce:animate-none"
					style={{
						animationDelay: `${secondLineBaseDelayS + second.length * wordStaggerS}s`,
					}}
				>
					<MascotBuddy
						quips={[
							t("home.hero.mascot.quips.1"),
							t("home.hero.mascot.quips.2"),
							t("home.hero.mascot.quips.3"),
							t("home.hero.mascot.quips.4"),
						]}
						label={t("home.hero.mascot.label")}
						side={BubbleSide.Top}
						className="w-[0.78em]"
					/>
				</span>
			</span>
		</DisplayHeading>
	);
};

export default HeroTitle;
