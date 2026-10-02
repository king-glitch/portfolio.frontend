import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePosts } from "@/api/hooks/portfolio/use-posts";
import { useProfile } from "@/api/hooks/portfolio/use-profile";
import { useProjects } from "@/api/hooks/portfolio/use-projects";
import { useGoSection } from "@/components/shared/shell/use-go-section";
import { useShell } from "@/contexts/shell-context";
import { config } from "@/config";
import { runCommand } from "@/lib/terminal/commands";
import {
	TerminalDataStatus,
	TerminalOpacity,
	TerminalWeight,
	type TerminalLine,
	type TerminalNav,
} from "@/types/terminal";

/** First line of a fresh terminal (prototype). */
const GREETING: TerminalLine[] = [
	{
		key: "shell.terminal.messages.greeting",
		opacity: TerminalOpacity.Muted,
		weight: TerminalWeight.Normal,
	},
];

function dataStatus(...queries: { isPending: boolean; isError: boolean }[]) {
	if (queries.some((q) => q.isError)) return TerminalDataStatus.Error;
	if (queries.some((q) => q.isPending)) return TerminalDataStatus.Loading;
	return TerminalDataStatus.Ready;
}

/** Terminal state: output lines (last `config.terminal.maxLines`), command execution and delayed navigation. */
export function useTerminal() {
	const { setTerminalOpen } = useShell();
	const projects = useProjects();
	const posts = usePosts();
	const profile = useProfile();
	const navigate = useNavigate();
	const goSection = useGoSection();
	const { pathname } = useLocation();
	const [lines, setLines] = useState<TerminalLine[]>(GREETING);
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	const follow = (nav: TerminalNav) => {
		setTerminalOpen(false);
		if (nav.section) {
			goSection(nav.section);
			return;
		}
		if (nav.pathname && nav.pathname !== pathname)
			void navigate(nav.pathname, { viewTransition: true });
	};

	const run = (raw: string) => {
		if (!raw.trim()) return;
		const result = runCommand(raw, {
			status: dataStatus(projects, posts, profile),
			projects: projects.data ?? [],
			posts: posts.data ?? [],
			profile: profile.data ?? null,
			now: new Date(),
		});
		if (result.exit) {
			setTerminalOpen(false);
			return;
		}
		setLines((prev) =>
			result.clear
				? []
				: [...prev, ...result.lines].slice(-config.terminal.maxLines),
		);
		const { nav } = result;
		if (nav)
			timer.current = setTimeout(
				() => follow(nav),
				config.terminal.navDelayMs,
			);
	};

	const reset = () => {
		clearTimeout(timer.current);
		setLines(GREETING);
	};

	return { lines, run, reset };
}
