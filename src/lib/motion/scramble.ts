/**
 * One scramble frame (design/Main.dc.html scramble()): the first
 * `floor(len * frame / frames)` characters are final, spaces are kept, the rest are random glyphs.
 */
export function scrambleFrame(
	original: string,
	frame: number,
	frames: number,
	chars: string,
	random: () => number,
): string {
	const keep = Math.floor((original.length * frame) / frames);
	let out = "";
	for (let i = 0; i < original.length; i++) {
		const ch = original[i] ?? "";
		out +=
			i < keep || ch === " "
				? ch
				: (chars[Math.floor(random() * chars.length)] ?? ch);
	}
	return out;
}
