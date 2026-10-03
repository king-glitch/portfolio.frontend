import React, { useRef } from "react";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { useFanTilt } from "@/hooks/pointer/use-fan-tilt";
import { HeroFanCard } from "@/routes/components/home/hero/hero-fan-card";
import { HeroTags } from "@/routes/components/home/hero/hero-tags";
import { useTranslation } from "react-i18next";

interface HeroFanImplProps {}

const HeroFanImpl: React.FC<HeroFanImplProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProjects();
	const deckRef = useRef<HTMLDivElement>(null);
	useFanTilt(deckRef);

	const renderCards = () => {
		if (isError)
			return (
				<QueryErrorAlert
					onRetry={() => void refetch()}
					className="mx-auto max-w-md"
				/>
			);
		if (isPending)
			return Array.from(
				{ length: config.home.hero.fan.skeletonCount },
				(_, i) => (
					<HeroFanCard
						key={i}
						index={i}
						total={config.home.hero.fan.skeletonCount}
					/>
				),
			);
		if (!data?.length)
			return (
				<QueryEmpty
					titleKey="home.index.empty.title"
					className="mx-auto max-w-md"
				/>
			);
		return (
			<>
				{data.map((project, i) => (
					<HeroFanCard
						key={project.id}
						project={project}
						index={i}
						total={data.length}
					/>
				))}
				<HeroTags />
			</>
		);
	};

	return (
		<div className="w-full perspective-[1400px] desk:min-h-75 desk:flex-1">
			<div
				ref={deckRef}
				role="group"
				aria-label={t("home.hero.cards.aria-label")}
				className="relative mt-[clamp(40px,5vw,72px)] h-[calc(clamp(200px,24vw,390px)*0.75+110px)] w-full will-change-transform max-desk:mt-6 max-desk:grid max-desk:h-auto max-desk:grid-cols-2 max-desk:gap-3 max-desk:px-4 max-desk:pt-6 max-desk:pb-8"
			>
				{renderCards()}
			</div>
		</div>
	);
};

/**
 * The 3D card deck: one card per project, tilting toward the cursor on desktop. Handles loading,
 * error and empty. Memoised: the preloader flipping `loaded` re-renders the hero at the exact
 * moment the wipe starts, and the six SVG-heavy cards must not re-render with it.
 */
export const HeroFan = React.memo(HeroFanImpl);

export default HeroFan;
