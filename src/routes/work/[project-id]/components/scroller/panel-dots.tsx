import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { config } from "@/config";

interface PanelDotsProps {
	count: number;
	active: number;
	onSelect: (index: number) => void;
}

const dots = config.work.dots;

/** One dot per panel; the active one is wide. Click jumps to that panel. */
export const PanelDots: React.FC<PanelDotsProps> = ({
	count,
	active,
	onSelect,
}) => {
	const { t } = useTranslation();
	return (
		<nav
			aria-label={t("work.dots.label")}
			className="absolute bottom-6 left-1/2 z-5 flex -translate-x-1/2 items-center"
		>
			{Array.from({ length: count }, (_, i) => (
				<Button
					key={i}
					variant="ghost"
					aria-label={t("work.dots.panel", { index: i + 1 })}
					aria-current={i === active}
					onClick={() => onSelect(i)}
					className="h-6 px-1 hover:bg-transparent"
				>
					<span
						className="block h-1.5 rounded-full bg-foreground transition-[width,opacity] duration-500 ease-(--ease-out-expo)"
						style={{
							width:
								i === active ? dots.activePx : dots.inactivePx,
							opacity: i === active ? 1 : dots.inactiveOpacity,
						}}
					/>
				</Button>
			))}
		</nav>
	);
};

export default PanelDots;
