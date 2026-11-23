import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { PillButton } from "@/components/common/buttons/pill-button";
import { QueryEmpty } from "@/components/common/feedback/query-empty";
import { QueryErrorAlert } from "@/components/common/feedback/query-error-alert";
import { MetaCode } from "@/components/common/typography/meta-code";
import { SectionLabel } from "@/components/common/typography/section-label";
import { Skeleton } from "@/components/ui/skeleton";
import { config } from "@/config";
import { usePinnedSteps } from "@/hooks/scroll/use-pinned-steps";
import { padCount } from "@/lib/motion/reveal";
import { sentences } from "@/lib/portfolio/lead";
import { cn } from "@/lib/utils";
import { HelloLines } from "@/routes/components/home/hello/hello-lines";
import { HomeSection } from "@/routes/components/home/home-section";
import { HomePad } from "@/types/home";
import { PillVariant } from "@/types/ui";

const LINE_BARS = ["h-12 w-full", "h-12 w-3/5", "h-12 w-11/12", "h-12 w-4/5"];

interface HelloProps {}

/**
 * About section: `profile.about`, one sentence per line. On desktop the section pins and
 * scrolling steps through the lines, lighting one at a time; a thin rail and counter show
 * how far along you are. Narrow, touch and reduced-motion get every line lit, no pinning.
 */
export const Hello: React.FC<HelloProps> = () => {
	const { t } = useTranslation();
	const profile = useProfile();
	const lines = sentences(profile.data?.about ?? "");
	const trackRef = useRef<HTMLDivElement>(null);
	const [index, setIndex] = useState(0);
	const { pinned } = usePinnedSteps(trackRef, lines.length, setIndex);
	const active = Math.min(index, Math.max(lines.length - 1, 0));

	const renderLines = () => {
		if (profile.isError)
			return <QueryErrorAlert onRetry={() => void profile.refetch()} />;
		if (profile.isPending)
			return (
				<div className="flex flex-col gap-6 desk:ml-[16.66%]">
					{LINE_BARS.map((bar) => (
						<Skeleton key={bar} className={bar} />
					))}
				</div>
			);
		if (!lines.length)
			return <QueryEmpty titleKey="home.hello.empty.title" />;
		return (
			<div className="grid items-center gap-10 desk:grid-cols-12 desk:gap-12">
				{pinned ? (
					<div
						aria-hidden="true"
						className="flex flex-col gap-4 desk:col-span-2"
					>
						<MetaCode>{`${padCount(active + 1, 2)} / ${padCount(lines.length, 2)}`}</MetaCode>
						<div className="h-40 w-px bg-foreground/15">
							<div
								className="h-full w-px origin-top bg-foreground transition-[scale] duration-700 ease-(--ease-out-expo)"
								style={{
									scale: `1 ${(active + 1) / lines.length}`,
								}}
							/>
						</div>
					</div>
				) : null}
				<div className="desk:col-span-10 desk:col-start-3">
					<HelloLines lines={lines} active={active} pinned={pinned} />
				</div>
			</div>
		);
	};

	return (
		<HomeSection id={config.sections.about} pad={HomePad.Top}>
			<div className="mb-[clamp(32px,4vw,64px)] flex items-center justify-between gap-6">
				<SectionLabel index={1}>{t("home.hello.eyebrow")}</SectionLabel>
				<PillButton
					variant={PillVariant.Outline}
					magnetic
					nativeButton={false}
					render={<Link to={config.routes.about} viewTransition />}
				>
					{t("home.hello.cta")}
				</PillButton>
			</div>
			<div
				ref={trackRef}
				style={
					pinned
						? { height: `${lines.length * 60 + 100}svh` }
						: undefined
				}
			>
				<div
					className={cn(
						pinned &&
							"sticky top-0 flex h-svh flex-col justify-center pt-20",
					)}
				>
					{renderLines()}
				</div>
			</div>
		</HomeSection>
	);
};

export default Hello;
