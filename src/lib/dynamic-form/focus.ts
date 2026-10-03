/** DOM id of block card `index`, for scrolling to it. */
export const blockDomId = (index: number): string => `block-${index}`;

/** After the cards re-render (invalid ones open), scrolls to block `index` and focuses its first invalid field. */
export function focusBlock(index: number): void {
	requestAnimationFrame(() =>
		requestAnimationFrame(() => {
			const card = document.getElementById(blockDomId(index));
			card?.scrollIntoView({ behavior: "smooth", block: "center" });
			card?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus({
				preventScroll: true,
			});
		}),
	);
}
