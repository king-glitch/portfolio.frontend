import { ApiError, ApiErrorKind, type FieldViolation } from "@/api/errors";
import { config } from "@/config";
import { getSession, setSession } from "@/lib/auth/session";

export type Params = Record<string, string | number | undefined>;

export enum HttpMethod {
	Get = "GET",
	Post = "POST",
	Put = "PUT",
	Patch = "PATCH",
	Delete = "DELETE",
}

export interface RequestOptions {
	params?: Params;
	/** Sent as JSON. */
	body?: unknown;
	/** Sent as multipart (uploads); wins over `body`. */
	form?: FormData;
	/** Adds the bearer token; a rejected session token signs you out. */
	auth?: boolean;
}

interface Envelope {
	data?: unknown;
	errors?: {
		message?: string;
		code?: string;
		violations?: Record<string, FieldViolation>;
	};
}

const KIND_BY_STATUS: Record<number, ApiErrorKind> = {
	400: ApiErrorKind.Validation,
	401: ApiErrorKind.Unauthorized,
	403: ApiErrorKind.Forbidden,
	404: ApiErrorKind.NotFound,
	409: ApiErrorKind.Conflict,
	422: ApiErrorKind.Validation,
	429: ApiErrorKind.RateLimited,
};

const kindOf = (status: number): ApiErrorKind =>
	KIND_BY_STATUS[status] ??
	(status >= 500 ? ApiErrorKind.Server : ApiErrorKind.Invalid);

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

/** Body as JSON, or null when empty / not JSON (a proxy's HTML error page, a cut connection). */
async function readEnvelope(response: Response): Promise<Envelope | null> {
	try {
		const body: unknown = await response.json();
		return isRecord(body) ? body : null;
	} catch {
		return null;
	}
}

function buildUrl(path: string, params: Params | undefined): string {
	const url = new URL(config.api.baseUrl + path);
	for (const [key, value] of Object.entries(params ?? {}))
		if (value !== undefined && value !== "")
			url.searchParams.set(key, String(value));
	return url.toString();
}

function buildInit(
	method: HttpMethod,
	{ body, form }: RequestOptions,
	accessToken: string | undefined,
): RequestInit {
	const headers = new Headers({ Accept: "application/json" });
	if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
	if (!form && body !== undefined)
		headers.set("Content-Type", "application/json");
	return {
		method,
		headers,
		body: form ?? (body === undefined ? undefined : JSON.stringify(body)),
		signal: AbortSignal.timeout(config.api.timeoutMs),
	};
}

async function exchange(url: string, init: RequestInit): Promise<Response> {
	try {
		return await fetch(url, init);
	} catch (error) {
		const timedOut =
			error instanceof DOMException && error.name === "TimeoutError";
		throw new ApiError({
			kind: timedOut ? ApiErrorKind.Timeout : ApiErrorKind.Network,
			message: timedOut ? "request timed out" : "network unreachable",
		});
	}
}

async function failure(response: Response): Promise<ApiError> {
	const envelope = await readEnvelope(response);
	return new ApiError({
		kind: kindOf(response.status),
		status: response.status,
		message:
			envelope?.errors?.message ?? `request failed (${response.status})`,
		code: envelope?.errors?.code,
		violations: envelope?.errors?.violations,
	});
}

/**
 * Call the backend and return the unwrapped `data` of its `{ data, errors }` envelope.
 * Every failure is an `ApiError`: no response, timeout, HTTP error status (with the backend's
 * code and field violations), or a success body that is not the envelope.
 */
export async function request(
	method: HttpMethod,
	path: string,
	options: RequestOptions = {},
): Promise<unknown> {
	const response = await exchange(
		buildUrl(path, options.params),
		buildInit(
			method,
			options,
			options.auth ? getSession()?.token : undefined,
		),
	);

	if (!response.ok) {
		const error = await failure(response);
		// An expired or revoked session cannot recover: clear it and the dashboard shows the login.
		// A wrong password on change-password is also a 401 but carries another code.
		if (options.auth && error.code === config.api.invalidTokenCode)
			setSession(null);
		throw error;
	}

	const envelope = await readEnvelope(response);
	if (!envelope || !("data" in envelope))
		throw new ApiError({
			kind: ApiErrorKind.Invalid,
			status: response.status,
			message: "response is not a data envelope",
		});
	return envelope.data;
}

export const get = (path: string, params?: Params): Promise<unknown> =>
	request(HttpMethod.Get, path, { params });
