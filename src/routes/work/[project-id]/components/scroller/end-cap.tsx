import React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { PillButton } from "@/components/common/buttons/pill-button";
import { Panel } from "@/components/common/layout/panel";
import { CursorLabel } from "@/types/cursor";
import { PillSize, PillVariant } from "@/types/ui";
import { PanelTone } from "@/types/work";
import { PanelLabel } from "@/routes/work/[project-id]/components/blocks/panel-label";
import { EndCapTitle } from "@/routes/work/[project-id]/components/scroller/end-cap-title";

interface EndCapProps {
	next?: ProjectSummary;
	touch: boolean;
	onNext: () => void;
	meterRef: React.Ref<HTMLDivElement>;
	fillRef: React.Ref<HTMLDivElement>;
}

/** Last panel: pulling past the end fills the next title and loads that project. */
export const EndCap: React.FC<EndCapProps> = ({
	next,
	touch,
	onNext,
	meterRef,
	fillRef,
}) => {
	const { t } = useTranslation();
	const hintKey = touch ? "work.end.touch.hint" : "work.end.scroll.hint";
	return (
		<Panel
			tone={PanelTone.Card}
			className="flex flex-col justify-between gap-8 border-r-0"
		>
			<div className="flex justify-between gap-4">
				<PanelLabel>{t("work.end.eyebrow")}</PanelLabel>
				<PanelLabel className="tabular-nums">{next?.num}</PanelLabel>
			</div>
			<EndCapTitle name={next?.name} fillRef={fillRef} />
			<div className="flex flex-col gap-5">
				<div className="flex items-center gap-6">
					<div
						aria-hidden="true"
						className="h-0.5 grow overflow-hidden bg-border"
					>
						<div
							ref={meterRef}
							className="h-full origin-left bg-foreground"
							style={{ transform: "scaleX(0)" }}
						/>
					</div>
					<PillButton
						variant={PillVariant.Outline}
						size={PillSize.Xl}
						magnetic
						cursor={CursorLabel.Next}
						disabled={!next}
						onClick={onNext}
					>
						{t("work.end.button")}
						<RiArrowRightLine data-icon="inline-end" />
					</PillButton>
				</div>
				<span className="text-sm text-muted-foreground">
					{t(hintKey)}
				</span>
			</div>
		</Panel>
	);
};

export default EndCap;
