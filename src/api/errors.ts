/** Why a request failed, as the UI cares about it. */
export enum ApiErrorKind {
	/** No response: offline, DNS, CORS, connection refused. */
	Network = "network",
	Timeout = "timeout",
	/** 404 / `Service.Resource.NotFound`: final, the page shows its not-found state. */
	NotFound = "not-found",
	/** 400 / `Request.Validation.Invalid`: the request itself is wrong. */
	Validation = "validation",
	Unauthorized = "unauthorized",
	Forbidden = "forbidden",
	Conflict = "conflict",
	RateLimited = "rate-limited",
	Server = "server",
	/** A 2xx whose body is not the documented envelope or shape. */
	Invalid = "invalid",
}

/** One rejected field of a 400 response (`errors.violations`). */
export interface FieldViolation {
	code: string;
	message: string;
}

export interface ApiErrorInit {
	kind: ApiErrorKind;
	message: string;
	status?: number;
	/** Backend `errors.code`, e.g. `Service.Resource.NotFound`. */
	code?: string;
	violations?: Record<string, FieldViolation>;
}

/** Every failure of the service layer. Hooks and pages branch on `kind`, never on message text. */
export class ApiError extends Error {
	readonly kind: ApiErrorKind;
	readonly status?: number;
	readonly code?: string;
	readonly violations: Record<string, FieldViolation>;

	constructor({ kind, message, status, code, violations }: ApiErrorInit) {
		super(message);
		this.name = "ApiError";
		this.kind = kind;
		this.status = status;
		this.code = code;
		this.violations = violations ?? {};
	}
}

export const isApiError = (error: unknown): error is ApiError =>
	error instanceof ApiError;

export const isNotFound = (error: unknown): boolean =>
	isApiError(error) && error.kind === ApiErrorKind.NotFound;

/** Worth another attempt: the cause may pass by itself. Everything else repeats the same answer. */
export const isRetryable = (error: unknown): boolean =>
	!isApiError(error) ||
	[
		ApiErrorKind.Network,
		ApiErrorKind.Timeout,
		ApiErrorKind.RateLimited,
		ApiErrorKind.Server,
	].includes(error.kind);
