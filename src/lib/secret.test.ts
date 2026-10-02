import { expect, test } from "bun:test";
import { SECRET_IDLE, advanceSecret, secretArmed } from "@/lib/secret";
import { SecretWord } from "@/types/home";

const W = 6000;

test("quiet then loud arms the hold", () => {
	const a = advanceSecret(SECRET_IDLE, SecretWord.Quiet, 100, W);
	const b = advanceSecret(a, SecretWord.Loud, 900, W);
	expect(secretArmed(b, 1500, W)).toBe(true);
	expect(secretArmed(b, 100 + W + 1, W)).toBe(false);
});

test("wrong order resets, first word restarts", () => {
	expect(advanceSecret(SECRET_IDLE, SecretWord.Loud, 1, W)).toEqual(
		SECRET_IDLE,
	);
	const a = advanceSecret(SECRET_IDLE, SecretWord.Quiet, 1, W);
	expect(advanceSecret(a, SecretWord.Quiet, 50, W)).toEqual({
		step: 1,
		startedAt: 50,
	});
});

test("stale progress expires", () => {
	const a = advanceSecret(SECRET_IDLE, SecretWord.Quiet, 0, W);
	expect(advanceSecret(a, SecretWord.Loud, W + 10, W).step).toBe(0);
});
