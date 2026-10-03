import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { ApiError } from "@/api/errors";
import { listAdminProjects, login, logout } from "@/api/services/admin";
import { getSession, setSession } from "@/lib/auth/session";

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

/** Replies to every fetch and records each request's URL and headers. */
function reply(response: () => Response) {
	const seen: { url: string; auth: string | null }[] = [];
	const fake = (input: URL | RequestInfo, init?: RequestInit) => {
		seen.push({
			url: String(input),
			auth: new Headers(init?.headers).get("Authorization"),
		});
		return Promise.resolve(response());
	};
	// Bun's `fetch` type also carries `preconnect`.
	spyOn(globalThis, "fetch").mockImplementation(
		Object.assign(fake, { preconnect: () => undefined }),
	);
	return seen;
}

const live = () => ({
	token: "tok",
	expiresAt: new Date(Date.now() + 60_000).toISOString(),
});

afterEach(() => {
	spyOn(globalThis, "fetch").mockRestore();
	setSession(null);
});

describe("session", () => {
	it("stores the login's session token and sends it as a bearer", async () => {
		reply(() =>
			json({
				data: {
					session: {
						token: "abc",
						expires_at: new Date(Date.now() + 60_000).toISOString(),
					},
				},
			}),
		);
		await login({ username: "u", password: "p" });
		expect(getSession()?.token).toBe("abc");

		const seen = reply(() => json({ data: { projects: [] } }));
		await listAdminProjects();
		expect(seen[0]?.auth).toBe("Bearer abc");
	});

	it("treats an expired session as signed out", () => {
		setSession({
			token: "old",
			expiresAt: new Date(Date.now() - 1000).toISOString(),
		});
		expect(getSession()).toBeNull();
	});

	it("signs out when the server rejects the session token", async () => {
		setSession(live());
		reply(() =>
			json(
				{
					data: {},
					errors: {
						code: "Service.Authentication.InvalidToken",
						message: "invalid or expired token",
					},
				},
				401,
			),
		);
		await expect(listAdminProjects()).rejects.toBeInstanceOf(ApiError);
		expect(getSession()).toBeNull();
	});

	it("stays signed in after another 401 (wrong password)", async () => {
		setSession(live());
		reply(() =>
			json(
				{
					data: {},
					errors: {
						code: "Service.Authentication.Unauthorized",
						message: "invalid credentials",
					},
				},
				401,
			),
		);
		await expect(listAdminProjects()).rejects.toBeInstanceOf(ApiError);
		expect(getSession()?.token).toBe("tok");
	});

	it("logout clears the session even when the server is unreachable", async () => {
		setSession(live());
		spyOn(globalThis, "fetch").mockImplementation(
			Object.assign(() => Promise.reject(new TypeError("down")), {
				preconnect: () => undefined,
			}),
		);
		await expect(logout()).rejects.toBeInstanceOf(ApiError);
		expect(getSession()).toBeNull();
	});
});
