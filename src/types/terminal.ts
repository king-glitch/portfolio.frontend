import type { ParseKeys } from "i18next";
import type { PostSummary } from "@/api/types/portfolio/post";
import type { Profile } from "@/api/types/portfolio/profile";
import type { ProjectSummary } from "@/api/types/portfolio/project";

export enum TerminalCommand {
	Help = "help",
	Whoami = "whoami",
	Ls = "ls",
	Open = "open",
	Read = "read",
	Cat = "cat",
	Skills = "skills",
	About = "about",
	Blog = "blog",
	Home = "home",
	Contact = "contact",
	Date = "date",
	Clear = "clear",
	Exit = "exit",
	Sudo = "sudo",
}

/** Whether the data the commands read has arrived. */
export enum TerminalDataStatus {
	Loading = "loading",
	Error = "error",
	Ready = "ready",
}

/** Index into `config.terminal.lineOpacities`. */
export enum TerminalOpacity {
	Full = 0,
	Soft = 1,
	Help = 2,
	Muted = 3,
	Dim = 4,
	Faint = 5,
}

export enum TerminalWeight {
	Normal = "normal",
	Bold = "bold",
}

/** One output line: `prefix` (raw, padded data) followed by a translated `key` or `raw` text. */
export interface TerminalLine {
	prefix?: string;
	key?: ParseKeys;
	values?: Record<string, string | number>;
	raw?: string;
	opacity: TerminalOpacity;
	weight: TerminalWeight;
}

/** Where to go after a command: a route, or a home section by id. */
export interface TerminalNav {
	pathname?: string;
	section?: string;
}

export interface TerminalResult {
	lines: TerminalLine[];
	nav?: TerminalNav;
	clear?: boolean;
	exit?: boolean;
}

/** Everything a command may read; the engine itself is pure. */
export interface TerminalContext {
	status: TerminalDataStatus;
	projects: ProjectSummary[];
	posts: PostSummary[];
	profile: Profile | null;
	now: Date;
}
