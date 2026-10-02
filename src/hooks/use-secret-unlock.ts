import { useEffect, useRef } from "react";
import { config } from "@/config";
import { SECRET_IDLE, advanceSecret, secretArmed } from "@/lib/secret";
import type { SecretWord } from "@/types/home";

/**
 * Owner-only gesture on the hero (no link, no hint, cursor unchanged): click "Quiet", then "loud",
 * then press and hold "behind" for `holdMs` while its box drains; letting go early refills it.
 * Done: full load of `config.routes.dashboard` (it may live outside this SPA).
 * `boxRef` gets its `scale` written while holding.
 */
export function useSecretUnlock() {
	const state = useRef(SECRET_IDLE);
	const boxRef = useRef<HTMLSpanElement>(null);
	const hold = useRef(0);

	const setDrain = (p: number) => {
		const box = boxRef.current;
		if (box) box.style.scale = p > 0 ? `${(1 - p).toFixed(3)} 1` : "";
	};
	const cancel = () => {
		cancelAnimationFrame(hold.current);
		hold.current = 0;
		setDrain(0);
	};
	useEffect(() => cancel, []);

	const onWord = (word: SecretWord) => {
		state.current = advanceSecret(
			state.current,
			word,
			performance.now(),
			config.secret.windowMs,
		);
	};

	const onHoldStart = () => {
		const start = performance.now();
		if (!secretArmed(state.current, start, config.secret.windowMs)) return;
		const tick = (now: number) => {
			const p = Math.min(1, (now - start) / config.secret.holdMs);
			setDrain(p);
			if (p < 1) {
				hold.current = requestAnimationFrame(tick);
				return;
			}
			state.current = SECRET_IDLE;
			window.location.assign(config.routes.dashboard);
		};
		hold.current = requestAnimationFrame(tick);
	};

	return { boxRef, onWord, onHoldStart, onHoldEnd: cancel };
}
