import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSpotlight } from "@/hooks/pointer/use-spotlight";
import { SpotlightLayer } from "@/routes/components/home/spotlight/spotlight-layer";
import { CursorLabel } from "@/types/cursor";
import { SpotlightSide } from "@/types/home";

interface SpotlightProps {}

/** "What you see / what I see": the cursor opens a circle onto the inverted layer; tap or Enter toggles it fully open. */
export const Spotlight: React.FC<SpotlightProps> = () => {
	const { t } = useTranslation();
	const [revealed, setRevealed] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const layerRef = useRef<HTMLDivElement>(null);
	useSpotlight(sectionRef, layerRef, revealed);

	return (
		<section
			ref={sectionRef}
			role="button"
			tabIndex={0}
			aria-pressed={revealed}
			aria-label={t("home.spotlight.aria-label")}
			data-cursor={CursorLabel.LookCloser}
			onClick={() => setRevealed((v) => !v)}
			onKeyDown={(e) => {
				if (e.key !== "Enter" && e.key !== " ") return;
				e.preventDefault();
				setRevealed((v) => !v);
			}}
			className="relative mt-[clamp(96px,12vw,180px)] h-[clamp(520px,86vh,900px)] overflow-hidden border-y outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
		>
			<SpotlightLayer side={SpotlightSide.See} />
			<SpotlightLayer side={SpotlightSide.Reveal} ref={layerRef} />
		</section>
	);
};

export default Spotlight;
