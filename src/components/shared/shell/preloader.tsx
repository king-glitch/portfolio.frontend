import React from "react";
import { useTranslation } from "react-i18next";
import { Mascot } from "@/components/common/mascot/mascot";
import { config } from "@/config";
import {
	PreloaderPhase,
	usePreloaderProgress,
} from "@/hooks/motion/use-preloader";
import { cn } from "@/lib/utils";
import { MascotZone } from "@/types/ui";

interface PreloaderProps {}

/**
 * First load: the mascot watches the 000..100 counter while the status line steps through its
 * stages; at 100 it looks up and pops, then the sheet lifts away while the page pushes up beneath
 * it. Hero animations wait on `usePreloader().loaded`.
 */
export const Preloader: React.FC<PreloaderProps> = () => {
	const { t } = useTranslation();
	const statuses = [
		t("shell.preloader.statuses.1"),
		t("shell.preloader.statuses.2"),
		t("shell.preloader.statuses.3"),
		t("shell.preloader.statuses.4"),
	];
	const { phase, numRef, barRef, statusRef, mascotRef } =
		usePreloaderProgress(statuses);
	if (phase === PreloaderPhase.Done) return null;
	const out = phase === PreloaderPhase.Out;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"fixed inset-0 z-400 box-border flex flex-col justify-between overflow-hidden bg-foreground p-[clamp(16px,4vw,48px)] text-background will-change-transform invert-scope",
				out && "pointer-events-none animate-loader-out",
			)}
		>
			<div className="flex justify-between gap-4 text-[13px] font-bold tracking-[0.14em] uppercase">
				<span>{t("shell.preloader.name")}</span>
				<span>
					{t("shell.preloader.title", {
						year: new Date().getFullYear(),
					})}
				</span>
			</div>
			<div className="flex items-end justify-between gap-6 max-desk:flex-col-reverse max-desk:items-start">
				<span
					ref={numRef}
					className="text-[clamp(120px,24vw,400px)] leading-[0.78] font-black tracking-[-0.08em] tabular-nums"
				>
					{"0".repeat(config.shell.preloader.digits)}
				</span>
				<div className="flex flex-col items-end gap-5 pb-2 max-desk:items-start">
					{/* Inverted tokens, so the head contrasts with the sheet in both themes. */}
					<div className="invert-surface">
						<Mascot
							ref={mascotRef}
							options={{
								zone: MascotZone.BottomLeft,
								range: 0.35,
							}}
							className="w-[clamp(112px,16vw,240px)]"
						/>
					</div>
					<span
						ref={statusRef}
						className="max-w-60 text-right text-[15px] font-semibold max-desk:text-left"
					>
						{statuses[0]}
					</span>
				</div>
			</div>
			<div className="h-0.5 bg-current/30">
				<div
					ref={barRef}
					className="h-full origin-left scale-x-0 bg-current"
				/>
			</div>
		</div>
	);
};

export default Preloader;
