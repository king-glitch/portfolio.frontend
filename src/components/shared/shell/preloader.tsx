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
 * First load, mascot first: a big head in the middle with the progress drawn as a ring around
 * it, watching the 000..100 count below while the status line steps through its stages. At 100
 * it looks up and pops, then the sheet lifts away while the page pushes up beneath it.
 * Hero animations wait on `usePreloader().loaded`.
 */
export const Preloader: React.FC<PreloaderProps> = () => {
	const { t } = useTranslation();
	const statuses = [
		t("shell.preloader.statuses.1"),
		t("shell.preloader.statuses.2"),
		t("shell.preloader.statuses.3"),
		t("shell.preloader.statuses.4"),
	];
	const { phase, numRef, ringRef, statusRef, mascotRef } =
		usePreloaderProgress(statuses);
	if (phase === PreloaderPhase.Done) return null;
	const out = phase === PreloaderPhase.Out;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"fixed inset-0 z-400 box-border flex flex-col items-center justify-between overflow-hidden bg-foreground p-[clamp(16px,4vw,48px)] text-background will-change-transform invert-scope",
				out && "pointer-events-none animate-loader-out",
			)}
		>
			<div className="flex w-full justify-between gap-4 text-[13px] font-bold tracking-[0.14em] uppercase">
				<span>{t("shell.preloader.name")}</span>
				<span>
					{t("shell.preloader.title", {
						year: new Date().getFullYear(),
					})}
				</span>
			</div>
			<div className="flex flex-col items-center gap-[clamp(20px,3vh,36px)]">
				{/* Inverted tokens, so the head contrasts with the sheet in both themes. */}
				<div className="relative grid w-[clamp(200px,min(30vw,38vh),380px)] place-items-center invert-surface">
					<svg
						viewBox="0 0 100 100"
						className="absolute inset-[-9%] size-[118%] -rotate-90 overflow-visible"
					>
						<circle
							cx="50"
							cy="50"
							r="49"
							pathLength={1}
							fill="none"
							strokeWidth="0.8"
							className="stroke-foreground/20"
						/>
						<circle
							ref={ringRef}
							cx="50"
							cy="50"
							r="49"
							pathLength={1}
							fill="none"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeDasharray="1"
							strokeDashoffset="1"
							className="stroke-foreground"
						/>
					</svg>
					<Mascot
						ref={mascotRef}
						options={{ zone: MascotZone.Bottom, range: 0.35 }}
						className="w-full"
					/>
				</div>
				<div className="flex flex-col items-center gap-2 text-center">
					<span
						ref={numRef}
						className="text-[clamp(56px,8vw,112px)] leading-[0.85] font-black tracking-[-0.06em] tabular-nums"
					>
						{"0".repeat(config.shell.preloader.digits)}
					</span>
					<span
						ref={statusRef}
						className="text-[15px] font-semibold opacity-70"
					>
						{statuses[0]}
					</span>
				</div>
			</div>
			<span className="text-[13px] font-semibold opacity-60">
				{t("shell.preloader.hint")}
			</span>
		</div>
	);
};

export default Preloader;
