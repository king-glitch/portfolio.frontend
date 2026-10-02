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
import { CursorLabel } from "@/types/cursor";
import { PillSize, PillVariant } from "@/types/ui";
import { ProgressBar } from "@/routes/work/[project-id]/components/topbar/progress-bar";
import { RollingCounter } from "@/routes/work/[project-id]/components/topbar/rolling-counter";

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
	jsonOpen: boolean;
	onClose: () => void;
	onToggleJson: () => void;
	barRef: React.Ref<HTMLDivElement>;
}

/** Close, JSON toggle, title, rolling counter, prev/next and the progress hairline. */
export const ProjectTopbar: React.FC<ProjectTopbarProps> = ({
	num,
	name,
	position,
	total,
	showCounter,
	prevTo,
	nextTo,
	jsonOpen,
	onClose,
	onToggleJson,
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
		<header className="absolute inset-x-0 top-0 z-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 bg-background px-[clamp(16px,4vw,56px)] py-5.5">
			<div className="flex gap-2 justify-self-start">
				<PillButton
					variant={PillVariant.Outline}
					size={PillSize.Lg}
					magnetic
					cursor={CursorLabel.Close}
					onClick={onClose}
				>
					<RiCloseLine data-icon="inline-start" />
					{t("work.topbar.close")}
				</PillButton>
				<PillButton
					variant={jsonOpen ? PillVariant.Solid : PillVariant.Outline}
					size={PillSize.Lg}
					aria-pressed={jsonOpen}
					onClick={onToggleJson}
					className="font-mono text-[13px] font-bold mob:hidden"
				>
					{t("work.topbar.json")}
				</PillButton>
			</div>
			<span className="text-sm font-semibold whitespace-nowrap mob:hidden">
				{num} — {name}
			</span>
			<div className="flex items-center gap-3.5 justify-self-end">
				{showCounter ? (
					<RollingCounter position={position} total={total} />
				) : null}
				{steps.map((step) =>
					step.to ? (
						<IconButton
							key={step.id}
							label={step.label}
							icon={step.icon}
							magnetic
							nativeButton={false}
							render={<Link to={step.to} viewTransition />}
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
