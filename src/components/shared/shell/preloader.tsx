import React from "react";
import { useTranslation } from "react-i18next";
import { config } from "@/config";
import {
	PreloaderPhase,
	usePreloaderProgress,
} from "@/hooks/motion/use-preloader";
import { cn } from "@/lib/utils";

interface PreloaderProps {}

/** First-load count 000..100, then the sheet lifts away while the page pushes up beneath it. Hero animations wait on `usePreloader().loaded`. */
export const Preloader: React.FC<PreloaderProps> = () => {
	const { t } = useTranslation();
	const { phase, numRef, barRef } = usePreloaderProgress();
	if (phase === PreloaderPhase.Done) return null;
	const out = phase === PreloaderPhase.Out;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"fixed inset-0 z-400 box-border flex flex-col justify-between overflow-hidden bg-foreground p-[clamp(16px,4vw,48px)] text-background will-change-transform",
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
			<div className="flex flex-wrap items-end justify-between gap-6">
				<span
					ref={numRef}
					className="text-[clamp(120px,24vw,400px)] leading-[0.78] font-black tracking-[-0.08em] tabular-nums"
				>
					{"0".repeat(config.shell.preloader.digits)}
				</span>
				<span className="max-w-60 text-right text-[15px] font-semibold">
					{t("shell.preloader.status")}
				</span>
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
