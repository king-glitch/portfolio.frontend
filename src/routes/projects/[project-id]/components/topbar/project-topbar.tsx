import React from "react";
import {
	RiArrowLeftLine,
	RiArrowRightLine,
	RiCloseLine,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { IconButton } from "@/components/common/buttons/icon-button";
import { PillButton } from "@/components/common/buttons/pill-button";
import { PillSize, PillVariant } from "@/types/ui";
import { ProgressBar } from "@/routes/projects/[project-id]/components/topbar/progress-bar";
import { RollingCounter } from "@/routes/projects/[project-id]/components/topbar/rolling-counter";

interface ProjectTopbarProps {
	num: string;
	name: string;
	/** 1-based position in the project list; undefined while loading or on error. */
	position?: number;
	total?: number;
	/** Hide the counter when the project list failed to load. */
	showCounter: boolean;
	prevTo?: string;
	nextTo?: string;
	onClose: () => void;
	/** Next project is pushing in: title and counter fade out (the next page fades its own in). */
	leaving: boolean;
	barRef: React.Ref<HTMLDivElement>;
}

/** Close, title, rolling counter, prev/next and the progress hairline. */
export const ProjectTopbar: React.FC<ProjectTopbarProps> = ({
	num,
	name,
	position,
	total,
	showCounter,
	prevTo,
	nextTo,
	onClose,
	leaving,
	barRef,
}) => {
	const { t } = useTranslation();
	const steps = [
		{
			id: "prev",
			label: t("common.previous"),
			icon: RiArrowLeftLine,
			to: prevTo,
		},
		{
			id: "next",
			label: t("common.next"),
			icon: RiArrowRightLine,
			to: nextTo,
		},
	];
	return (
		<header className="absolute inset-x-0 top-0 z-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 bg-background px-[clamp(16px,4vw,56px)] pt-[max(22px,env(safe-area-inset-top))] pb-5.5 select-none">
			<div className="justify-self-start">
				<PillButton
					variant={PillVariant.Outline}
					magnetic
					onClick={onClose}
				>
					<RiCloseLine data-icon="inline-start" />
					{t("projects.topbar.close")}
				</PillButton>
			</div>
			<span className="text-sm font-semibold whitespace-nowrap transition-opacity duration-500 group-data-leaving/topbar:opacity-0 max-desk:hidden starting:opacity-0">
				{num} — {name}
			</span>
			<div className="flex items-center gap-3.5 justify-self-end">
				<div className="transition-opacity duration-500 group-data-leaving/topbar:opacity-0 starting:opacity-0">
					{showCounter ? (
						<RollingCounter position={position} total={total} />
					) : null}
				</div>
				{steps.map((step) =>
					step.to ? (
						<IconButton
							key={step.id}
							label={step.label}
							icon={step.icon}
							magnetic
							nativeButton={false}
							render={
								<Link to={step.to} replace viewTransition />
							}
						/>
					) : (
						<IconButton
							key={step.id}
							label={step.label}
							icon={step.icon}
							disabled
						/>
					),
				)}
			</div>
			<ProgressBar ref={barRef} />
		</header>
	);
};

export default ProjectTopbar;
