import { __unstable__loadDesignSystem } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Reports classes that Tailwind IntelliSense flags as non-canonical
// (suggestCanonicalClasses), e.g. `w-[230px]` -> `w-57.5`.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const cssPath = resolve(root, "src/main.css");
const designSystem = await __unstable__loadDesignSystem(
	await readFile(cssPath, "utf8"),
	{ base: dirname(cssPath) },
);

const files = new Bun.Glob("src/**/*.{ts,tsx}").scanSync({ cwd: root });
const scanner = new Scanner({});
const fix = process.argv.includes("--fix");
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let problems = 0;

for (const file of files) {
	const path = resolve(root, file);
	let content = await readFile(path, "utf8");
	const original = content;
	const found = scanner.getCandidatesWithPositions({
		content,
		extension: "tsx",
	});
	const candidates = [...new Set(found.map((item) => item.candidate))];
	const css = designSystem.candidatesToCss(candidates);
	const valid = candidates.filter((_, index) => css[index] !== null);
	for (const candidate of valid) {
		const [canonical] = designSystem.canonicalizeCandidates([candidate], {
			rem: 16,
		});
		if (canonical && canonical !== candidate) {
			const position =
				found.find((item) => item.candidate === candidate)?.position ??
				0;
			const line = content.slice(0, position).split("\n").length;
			console.log(
				`${relative(root, path)}:${line}  ${candidate}  ->  ${canonical}`,
			);
			problems++;
			if (fix) {
				const pattern = new RegExp(
					`(?<=^|[\\s"'\`{])${escape(candidate)}(?=$|[\\s"'\`}])`,
					"g",
				);
				content = content.replace(pattern, canonical);
			}
		}
	}
	if (fix && content !== original) await Bun.write(path, content);
}

if (problems && !fix) {
	console.log(`\n${problems} non-canonical Tailwind class(es).`);
	process.exit(1);
}
console.log(
	fix ? `Fixed ${problems} class(es).` : "Tailwind classes are canonical.",
);
