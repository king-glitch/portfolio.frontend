import type { z } from "zod";
import { ApiError, ApiErrorKind } from "@/api/errors";

/** Parse a response body; a body that breaks the contract is an `Invalid` error, never a crash later. */
export function parseBody<S extends z.ZodType>(
	schema: S,
	path: string,
	body: unknown,
): z.output<S> {
	const parsed = schema.safeParse(body);
	if (!parsed.success)
		throw new ApiError({
			kind: ApiErrorKind.Invalid,
			message: `unexpected response from ${path}: ${parsed.error.message}`,
		});
	return parsed.data;
}
