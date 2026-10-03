import React, { useEffect, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { Mascot } from "@/components/common/mascot/mascot";
import { MascotBubble } from "@/components/common/mascot/mascot-bubble";
import { Button } from "@/components/ui/button";
import { config } from "@/config";
import { usePreloader } from "@/contexts/preloader-context";
import { useTheme } from "@/hooks/use-theme";
import { COMPANION_LINES, companionPlace } from "@/lib/companion";
import {
	BubbleSide,
	CompanionPlace,
	Theme,
	type MascotHandle,
} from "@/types/ui";

/** What Void says when the theme changes. */
const THEME_LINES: Record<Theme, ParseKeys> = {
	[Theme.Dark]: "shell.companion.theme.dark",
	[Theme.Light]: "shell.companion.theme.light",
};

/** Bottom-right everywhere; on About it sits above the wall minimap. */
const dockVariants = cva(
	"fixed right-[max(20px,env(safe-area-inset-right))] z-97 flex items-center transition-[translate,opacity] duration-700 ease-(--ease-out-expo) starting:translate-y-24 starting:opacity-0 print:hidden",
	{
		variants: {
			place: {
				[CompanionPlace.Home]:
					"bottom-[max(20px,env(safe-area-inset-bottom))]",
				[CompanionPlace.Project]:
					"bottom-[max(20px,env(safe-area-inset-bottom))]",
				[CompanionPlace.Notes]:
					"bottom-[max(20px,env(safe-area-inset-bottom))]",
				[CompanionPlace.Note]:
					"bottom-[max(20px,env(safe-area-inset-bottom))]",
				[CompanionPlace.Gallery]:
					"bottom-[max(20px,env(safe-area-inset-bottom))]",
				[CompanionPlace.About]:
					"bottom-44 max-desk:bottom-[max(84px,env(safe-area-inset-bottom))]",
			},
		},
	},
);

interface CompanionProps {}

/**
 * The site's companion: a small mascot docked bottom-right on every page (after the preloader).
 * It follows the cursor, greets on each page with a line for that page, steps through more lines
 * on click, pops on navigation and says its idle line after a long quiet spell.
 */
export const Companion: React.FC<CompanionProps> = () => {
	const { t } = useTranslation();
	const { loaded } = usePreloader();
	const { pathname } = useLocation();
	const place = companionPlace(pathname);
	const lines = COMPANION_LINES[place];
	const mascot = useRef<MascotHandle>(null);
	const [talk, setTalk] = useState<{ key: ParseKeys; line: number } | null>(
		null,
	);

	// Theme change (an event): Void flinches or sighs, then comments.
	const { theme } = useTheme();
	const lastTheme = useRef(theme);
	useEffect(() => {
		if (lastTheme.current === theme) return;
		lastTheme.current = theme;
		mascot.current?.poke(9);
		setTalk({ key: THEME_LINES[theme], line: -1 });
	}, [theme]);

	// Arrival on a page (an event, not derived state): pop and greet with its first line.
	useEffect(() => {
		if (!loaded) return;
		mascot.current?.poke(6);
		const first = COMPANION_LINES[companionPlace(pathname)][0];
		if (first) setTalk({ key: first, line: 0 });
	}, [loaded, pathname]);

	// Each line stays up for a while.
	useEffect(() => {
		if (!talk) return;
		const id = window.setTimeout(
			() => setTalk(null),
			config.companion.talkMs,
		);
		return () => window.clearTimeout(id);
	}, [talk]);

	// Idle line, once per page.
	useEffect(() => {
		if (!loaded) return;
		let id = 0;
		const arm = () => {
			window.clearTimeout(id);
			id = window.setTimeout(() => {
				mascot.current?.poke(4);
				setTalk({ key: "shell.companion.idle", line: -1 });
				stop();
			}, config.companion.idleMs);
		};
		const events: (keyof WindowEventMap)[] = [
			"pointermove",
			"keydown",
			"scroll",
			"wheel",
		];
		const stop = () => {
			window.clearTimeout(id);
			for (const e of events) window.removeEventListener(e, arm);
		};
		for (const e of events)
			window.addEventListener(e, arm, { passive: true });
		arm();
		return stop;
	}, [loaded, pathname]);

	if (!loaded) return null;

	const next = () => {
		const line = ((talk?.line ?? 0) + 1) % lines.length;
		const key = lines[line];
		mascot.current?.poke(7);
		if (key) setTalk({ key, line });
	};

	return (
		<div className={dockVariants({ place })}>
			{talk ? (
				<span className="pointer-events-none absolute right-full mr-3">
					<MascotBubble side={BubbleSide.Right}>
						{t(talk.key)}
					</MascotBubble>
				</span>
			) : null}
			<Button
				variant="ghost"
				aria-label={t("shell.companion.label")}
				onClick={next}
				className="h-auto rounded-full p-0 hover:bg-transparent dark:hover:bg-transparent"
			>
				<Mascot
					ref={mascot}
					className="w-[clamp(52px,5vw,72px)] drop-shadow-[0_14px_24px_rgb(0_0_0/0.35)]"
				/>
			</Button>
		</div>
	);
};

export default Companion;
