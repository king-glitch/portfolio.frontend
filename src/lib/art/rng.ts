/** Lehmer RNG used by the prototype art (design/Motif.dc.html, Mock.dc.html): same seed, same picture. */
export function createRng(seed: number): () => number {
	let state = seed;
	return () => {
		state = (state * 16807) % 2147483647;
		return (state - 1) / 2147483646;
	};
}
