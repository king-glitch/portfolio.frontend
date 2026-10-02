import { SecretWord } from "@/types/home";

/** Click order of the hidden dashboard gesture; then "behind" is held down. */
export const SECRET_ORDER: readonly SecretWord[] = [
	SecretWord.Quiet,
	SecretWord.Loud,
];

export interface SecretState {
	/** How many words of `SECRET_ORDER` were clicked in order. */
	step: number;
	startedAt: number;
}

export const SECRET_IDLE: SecretState = { step: 0, startedAt: 0 };

/** One word click. A wrong word resets (or restarts, if it is the first word); stale progress expires. */
export function advanceSecret(
	s: SecretState,
	word: SecretWord,
	now: number,
	windowMs: number,
): SecretState {
	const base = s.step > 0 && now - s.startedAt > windowMs ? SECRET_IDLE : s;
	if (SECRET_ORDER[base.step] === word)
		return {
			step: base.step + 1,
			startedAt: base.step === 0 ? now : base.startedAt,
		};
	return word === SECRET_ORDER[0] ? { step: 1, startedAt: now } : SECRET_IDLE;
}

/** Both words clicked, recently enough: holding "behind" may now unlock. */
export const secretArmed = (
	s: SecretState,
	now: number,
	windowMs: number,
): boolean => s.step === SECRET_ORDER.length && now - s.startedAt <= windowMs;
