import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { SectionBlurb } from "@/components/common/typography/section-blurb";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { config } from "@/config";
import { projectsForStop, STACK_STOPS } from "@/lib/portfolio/stack-stops";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomeSectionHead } from "@/routes/components/home/home-section-head";
import { HomeTitle } from "@/routes/components/home/home-title";
import { StackLink } from "@/routes/components/home/stack/stack-link";
import { StackStop } from "@/routes/components/home/stack/stack-stop";
import { StackUsedIn } from "@/routes/components/home/stack/stack-used-in";
import { HomePad } from "@/types/home";

interface StackFlowProps {}

/** "How a tap becomes a thing": five stops joined by moving packets; selecting one lists the projects that used it. */
export const StackFlow: React.FC<StackFlowProps> = () => {
	const { t } = useTranslation();
	const { data, isPending, isError, refetch } = useProjects();
	const [selectedId, setSelectedId] = useState(STACK_STOPS[0]?.id);
	const selected =
		STACK_STOPS.find((s) => s.id === selectedId) ?? STACK_STOPS[0];

	return (
		<HomeSection id={config.sections.stack} pad={HomePad.Bottom}>
			<HomeSectionHead
				index={4}
				label={t("home.stack.eyebrow")}
				title={
					<HomeTitle
						lines={[
							t("home.stack.lines.1"),
							t("home.stack.lines.2"),
						]}
					/>
				}
				aside={
					<SectionBlurb>{t("home.stack.description")}</SectionBlurb>
				}
			/>
			<div
				role="group"
				aria-label={t("home.stack.flow.aria-label")}
				className="mt-16 flex items-center max-desk:flex-col max-desk:items-stretch"
			>
				{STACK_STOPS.map((stop, i) => (
					<React.Fragment key={stop.id}>
						{i > 0 ? (
							<StackLink
								delayS={-i * config.home.stack.linkDelayStepS}
							/>
						) : null}
						<StackStop
							stop={stop}
							index={i}
							count={
								data
									? projectsForStop(stop, data).length
									: undefined
							}
							selected={stop.id === selected?.id}
							onSelect={() => setSelectedId(stop.id)}
						/>
					</React.Fragment>
				))}
			</div>
			{isError ? (
				<QueryErrorAlert
					onRetry={() => void refetch()}
					className="mt-10"
				/>
			) : null}
			{selected && !isError ? <StackUsedIn stop={selected} /> : null}
		</HomeSection>
	);
};

export default StackFlow;
