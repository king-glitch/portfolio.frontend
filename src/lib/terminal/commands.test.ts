import { expect, test } from "bun:test";
import { posts } from "@/api/mocks/portfolio/posts";
import { profile } from "@/api/mocks/portfolio/profile";
import { projects } from "@/api/mocks/portfolio/projects";
import { runCommand } from "@/lib/terminal/commands";
import { TerminalDataStatus, type TerminalContext } from "@/types/terminal";

const ready: TerminalContext = {
	status: TerminalDataStatus.Ready,
	projects,
	posts,
	profile,
	now: new Date("2026-10-02T10:00:00Z"),
};

const keys = (raw: string, ctx = ready) =>
	runCommand(raw, ctx).lines.map((l) => l.key ?? l.raw ?? l.prefix);

test("echoes the command first", () => {
	expect(runCommand("help", ready).lines[0]?.raw).toBe("❯ help");
});

test("help lists every row plus the hint", () => {
	expect(runCommand("help", ready).lines).toHaveLength(1 + 9 + 1);
});

test("unknown command", () => {
	const result = runCommand("foo", ready);
	expect(result.lines[1]?.key).toBe("shell.terminal.errors.not-found");
	expect(result.lines[1]?.values).toEqual({ command: "foo" });
});

test("ls lists projects then posts", () => {
	const lines = runCommand("ls", ready).lines.slice(1);
	expect(lines).toHaveLength(projects.length + posts.length);
	expect(lines[0]?.prefix?.startsWith("  0001  ")).toBe(true);
});

test("ls posts only, ls foo errors", () => {
	expect(runCommand("ls posts", ready).lines).toHaveLength(1 + posts.length);
	expect(keys("ls foo")[1]).toBe("shell.terminal.errors.ls");
});

test("open by number and by name navigates to the project", () => {
	const byNumber = runCommand("open 3", ready);
	const byName = runCommand(`open ${projects[2]?.name.toLowerCase()}`, ready);
	expect(byNumber.nav?.pathname).toBe(`/projects/${projects[2]?.id}`);
	expect(byName.nav?.pathname).toBe(byNumber.nav?.pathname);
});

test("open miss and empty argument", () => {
	expect(runCommand("open zzz", ready).nav).toBeUndefined();
	expect(keys("open")[1]).toBe("shell.terminal.errors.open");
});

test("read is 1-based and range checked", () => {
	expect(runCommand("read 1", ready).nav?.pathname).toBe(
		`/notes/${posts[0]?.slug}`,
	);
	expect(keys("read 99")[1]).toBe("shell.terminal.errors.read");
	expect(keys("read")[1]).toBe("shell.terminal.errors.read");
});

test("cat about prints the profile, other targets error", () => {
	expect(runCommand("cat about", ready).lines[1]?.raw).toBe(profile.about);
	expect(keys("cat")[1]).toBe("shell.terminal.errors.cat");
});

test("skills prints one row per group", () => {
	expect(runCommand("skills", ready).lines).toHaveLength(
		1 + profile.skills.length,
	);
});

test("page commands navigate", () => {
	expect(runCommand("about", ready).nav?.pathname).toBe("/about");
	expect(runCommand("blog", ready).nav?.pathname).toBe("/notes");
	expect(runCommand("home", ready).nav?.pathname).toBe("/");
});

test("contact and sudo hire william go to the contact section", () => {
	expect(runCommand("contact", ready).nav?.section).toBe("contact");
	const hire = runCommand("sudo hire william", ready);
	expect(hire.lines.map((l) => l.key)).toContain(
		"shell.terminal.sudo.granted",
	);
	expect(hire.nav?.section).toBe("contact");
	expect(keys("sudo rm")[1]).toBe("shell.terminal.sudo.denied");
});

test("date uses the injected clock", () => {
	expect(runCommand("date", ready).lines[1]?.raw).toBe(ready.now.toString());
});

test("clear and exit", () => {
	expect(runCommand("clear", ready)).toMatchObject({
		clear: true,
		lines: [],
	});
	expect(runCommand("exit", ready).exit).toBe(true);
});

test("data commands print loading and error while data is missing", () => {
	const loading = { ...ready, status: TerminalDataStatus.Loading };
	const failed = { ...ready, status: TerminalDataStatus.Error };
	expect(keys("ls", loading)[1]).toBe("shell.terminal.messages.loading");
	expect(keys("skills", failed)[1]).toBe("shell.terminal.messages.error");
	expect(keys("help", loading)).toHaveLength(11);
});
