import type { ParseKeys } from "i18next";
import { config } from "@/config";
import { notePath, projectPath } from "@/lib/routes";
import {
	TerminalCommand,
	TerminalDataStatus,
	TerminalOpacity,
	TerminalWeight,
	type TerminalContext,
	type TerminalLine,
	type TerminalResult,
} from "@/types/terminal";

type Handler = (
	arg: string,
	ctx: TerminalContext,
) => Omit<TerminalResult, "lines"> & { lines?: TerminalLine[] };

const line = (
	opacity: TerminalOpacity,
	rest: Partial<TerminalLine>,
): TerminalLine => ({ opacity, weight: TerminalWeight.Normal, ...rest });

const pad = (text: string, width: number) => text.padEnd(width, " ");

const HELP_ROWS: ParseKeys[] = [
	"shell.terminal.help.rows.whoami",
	"shell.terminal.help.rows.ls",
	"shell.terminal.help.rows.open",
	"shell.terminal.help.rows.read",
	"shell.terminal.help.rows.cat",
	"shell.terminal.help.rows.skills",
	"shell.terminal.help.rows.pages",
	"shell.terminal.help.rows.contact",
	"shell.terminal.help.rows.tidy",
];

/** Commands that read query data; they print loading/error text until it is ready. */
const NEEDS_DATA = new Set<TerminalCommand>([
	TerminalCommand.Ls,
	TerminalCommand.Open,
	TerminalCommand.Read,
	TerminalCommand.Cat,
	TerminalCommand.Skills,
	TerminalCommand.Contact,
]);

const go = (pathname: string) => ({ nav: { pathname } });
const goSection = (section: string) => ({
	nav: { pathname: config.routes.home, section },
});

/** 1-based index when `arg` is a number, otherwise the first item whose name contains `arg`. */
function pickIndex(arg: string, names: string[]): number {
	const n = Number.parseInt(arg, 10);
	if (!Number.isNaN(n)) return n - 1;
	if (!arg) return -1;
	return names.findIndex((name) => name.toLowerCase().includes(arg));
}

const HANDLERS: Record<TerminalCommand, Handler> = {
	[TerminalCommand.Help]: () => ({
		lines: [
			...HELP_ROWS.map((key) => line(TerminalOpacity.Help, { key })),
			line(TerminalOpacity.Faint, { key: "shell.terminal.help.hint" }),
		],
	}),
	[TerminalCommand.Whoami]: () => ({
		lines: [line(TerminalOpacity.Full, { key: "shell.terminal.whoami" })],
	}),
	[TerminalCommand.Ls]: (arg, { projects, posts }) => {
		const showProjects = !arg || arg === "projects";
		const showPosts = !arg || arg === "posts";
		const lines: TerminalLine[] = [];
		if (showProjects)
			for (const p of projects)
				lines.push(
					line(TerminalOpacity.Soft, {
						prefix: `  ${p.num}  ${pad(p.name, 24)}`,
						key: `common.sides.${p.side}`,
					}),
				);
		if (showPosts)
			for (const p of posts)
				lines.push(
					line(TerminalOpacity.Soft, {
						raw: `  ${p.num}    ${p.title}`,
					}),
				);
		if (!showProjects && !showPosts)
			lines.push(
				line(TerminalOpacity.Dim, {
					key: "shell.terminal.errors.ls",
					values: { arg },
				}),
			);
		return { lines };
	},
	[TerminalCommand.Open]: (arg, { projects }) => {
		const project =
			projects[
				pickIndex(
					arg,
					projects.map((p) => p.name),
				)
			];
		if (!project)
			return {
				lines: [
					line(TerminalOpacity.Dim, {
						key: "shell.terminal.errors.open",
						values: { arg },
					}),
				],
			};
		return {
			lines: [
				line(TerminalOpacity.Muted, {
					key: "shell.terminal.messages.opening.project",
					values: { name: project.name },
				}),
			],
			...go(projectPath(project.id)),
		};
	},
	[TerminalCommand.Read]: (arg, { posts }) => {
		const n = Number.parseInt(arg, 10);
		const post = Number.isNaN(n) ? undefined : posts[n - 1];
		if (!post)
			return {
				lines: [
					line(TerminalOpacity.Dim, {
						key: "shell.terminal.errors.read",
					}),
				],
			};
		return {
			lines: [
				line(TerminalOpacity.Muted, {
					key: "shell.terminal.messages.opening.post",
					values: { title: post.title },
				}),
			],
			...go(notePath(post.slug)),
		};
	},
	[TerminalCommand.Cat]: (arg, { profile }) => {
		if (arg === "about" && profile)
			return {
				lines: [line(TerminalOpacity.Soft, { raw: profile.about })],
			};
		return {
			lines: [
				line(TerminalOpacity.Dim, {
					key: "shell.terminal.errors.cat",
					values: { arg: arg || "?" },
				}),
			],
		};
	},
	[TerminalCommand.Skills]: (_arg, { profile }) => ({
		lines: (profile?.skills ?? []).map((g) =>
			line(TerminalOpacity.Soft, {
				raw: `  ${pad(g.label, 28)}${g.items.join(", ")}`,
			}),
		),
	}),
	[TerminalCommand.About]: () => go(config.routes.about),
	[TerminalCommand.Blog]: () => go(config.routes.notes),
	[TerminalCommand.Home]: () => go(config.routes.home),
	[TerminalCommand.Contact]: (_arg, { profile }) => ({
		lines: profile
			? [
					line(TerminalOpacity.Full, {
						raw: [
							profile.contact.email,
							profile.contact.github,
							profile.contact.linkedin,
							`discord: ${profile.contact.discord}`,
						].join(" · "),
					}),
				]
			: [],
		...goSection(config.sections.contact),
	}),
	[TerminalCommand.Date]: (_arg, { now }) => ({
		lines: [line(TerminalOpacity.Help, { raw: now.toString() })],
	}),
	[TerminalCommand.Sudo]: (arg) => {
		if (!/hire\s+william/.test(arg))
			return {
				lines: [
					line(TerminalOpacity.Dim, {
						key: "shell.terminal.sudo.denied",
					}),
				],
			};
		return {
			lines: [
				line(TerminalOpacity.Dim, {
					key: "shell.terminal.sudo.password",
				}),
				line(TerminalOpacity.Full, {
					key: "shell.terminal.sudo.granted",
				}),
			],
			...goSection(config.sections.contact),
		};
	},
	[TerminalCommand.Clear]: () => ({ clear: true }),
	[TerminalCommand.Exit]: () => ({ exit: true }),
};

const dataMessage: Record<
	Exclude<TerminalDataStatus, TerminalDataStatus.Ready>,
	ParseKeys
> = {
	[TerminalDataStatus.Loading]: "shell.terminal.messages.loading",
	[TerminalDataStatus.Error]: "shell.terminal.messages.error",
};

/** Runs one command line. Pure: all copy comes back as i18n keys, all data is passed in. */
export function runCommand(raw: string, ctx: TerminalContext): TerminalResult {
	const text = raw.trim();
	const echo: TerminalLine = {
		raw: `${config.terminal.prompt} ${text}`,
		opacity: TerminalOpacity.Full,
		weight: TerminalWeight.Bold,
	};
	const [first = "", ...rest] = text.split(/\s+/);
	const head = first.toLowerCase();
	const arg = rest.join(" ").toLowerCase();
	const command = Object.values(TerminalCommand).find((c) => c === head);

	if (!command)
		return {
			lines: [
				echo,
				line(TerminalOpacity.Dim, {
					key: "shell.terminal.errors.not-found",
					values: { command: head },
				}),
			],
		};

	if (NEEDS_DATA.has(command) && ctx.status !== TerminalDataStatus.Ready)
		return {
			lines: [
				echo,
				line(TerminalOpacity.Dim, { key: dataMessage[ctx.status] }),
			],
		};

	const { lines = [], ...effects } = HANDLERS[command](arg, ctx);
	return { lines: effects.clear ? [] : [echo, ...lines], ...effects };
}
