import React, { useRef } from "react";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { useVelocityMarquee } from "@/hooks/scroll/use-velocity-marquee";
import { MarqueeItem } from "@/routes/components/home/marquee/marquee-item";

const PHRASES: ParseKeys[] = [
	"home.marquee.phrases.1",
	"home.marquee.phrases.2",
	"home.marquee.phrases.3",
	"home.marquee.phrases.4",
	"home.marquee.phrases.5",
	"home.marquee.phrases.6",
];

/** Decorative velocity-reactive strip. The list is doubled so the loop wraps at half width. */
interface MarqueeProps {}

export const Marquee: React.FC<MarqueeProps> = () => {
	const { t } = useTranslation();
	const trackRef = useRef<HTMLDivElement>(null);
	useVelocityMarquee(trackRef);
	return (
		<div
			aria-hidden="true"
			className="mt-18 overflow-hidden border-y py-6.5"
		>
			<div ref={trackRef} className="flex w-max will-change-transform">
				{[...PHRASES, ...PHRASES].map((key, i) => (
					<MarqueeItem
						key={i}
						className={i % 2 ? "text-outline" : undefined}
					>
						{t(key)}
					</MarqueeItem>
				))}
			</div>
		</div>
	);
};

export default Marquee;
