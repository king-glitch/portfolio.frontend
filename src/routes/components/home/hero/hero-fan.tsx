import React, { useRef } from "react";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { useFanTilt } from "@/hooks/pointer/use-fan-tilt";
import { HeroFanCard } from "@/routes/components/home/hero/hero-fan-card";
import { HeroTags } from "@/routes/components/home/hero/hero-tags";
import { useTranslation } from "react-i18next";

interface HeroFanProps {}

/** The 3D card deck: one card per project, tilting toward the cursor on desktop. Handles loading, error and empty. */
export const HeroFan: React.FC<HeroFanProps> = () => {
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
			return Array.from({ length: config.home.hero.fan.skeletonCount }, (_, i) => (
				<HeroFanCard key={i} index={i} total={config.home.hero.fan.skeletonCount} />
			));
		if (!data?.length)
			return <QueryEmpty titleKey="home.index.empty.title" className="mx-auto max-w-md" />;
		return (
			<>
				{data.map((project, i) => (
					<HeroFanCard key={project.id} project={project} index={i} total={data.length} />
				))}
				<HeroTags />
			</>
		);
	};

	return (
		<div className="w-full perspective-[1400px]">
			<div
				ref={deckRef}
				role="group"
				aria-label={t("home.hero.cards.aria-label")}
				className="relative mt-[clamp(40px,5vw,72px)] h-[clamp(300px,33vw,520px)] w-full transform-3d will-change-transform max-desk:mt-6 max-desk:flex max-desk:h-auto max-desk:snap-x max-desk:snap-mandatory max-desk:gap-3.5 max-desk:overflow-x-auto max-desk:px-4 max-desk:pt-6 max-desk:pb-8"
			>
				{renderCards()}
			</div>
		</div>
	);
};

export default HeroFan;
