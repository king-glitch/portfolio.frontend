import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { ApiError } from "@/api/errors";
import {
	createFrame,
	deleteFile,
	listAdminProjects,
	listFiles,
	login,
	logout,
	uploadFile,
} from "@/api/services/admin";
import { ApiErrorKind } from "@/api/errors";
import { FileKind } from "@/api/types/admin/storage";
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

const fileWire = {
	id: "f1",
	kind: "image",
	mime: "image/png",
	size: 12,
	width: 4,
	height: 3,
	name: "a.png",
	alt: "an a",
	url: "http://x/uploads/a.png",
	created_at: "2026-10-01T00:00:00Z",
};

/** Records method, URL and body of every request. */
function capture(response: () => Response) {
	const seen: { method: string; url: string; body: unknown }[] = [];
	const fake = (input: URL | RequestInfo, init?: RequestInit) => {
		seen.push({
			method: init?.method ?? "GET",
			url: String(input),
			body: init?.body,
		});
		return Promise.resolve(response());
	};
	spyOn(globalThis, "fetch").mockImplementation(
		Object.assign(fake, { preconnect: () => undefined }),
	);
	return seen;
}

describe("file library", () => {
	it("lists files with the kind filter, search and cursor, and parses the page", async () => {
		setSession(live());
		const seen = capture(() =>
			json({ data: { items: [fileWire], next_cursor: "c2" } }),
		);
		const page = await listFiles("c1", {
			kinds: [FileKind.Image, FileKind.Document],
			q: "cv",
		});
		const url = new URL(seen[0]?.url ?? "");
		expect(url.pathname).toEndWith("/storage/administration/files");
		expect(url.searchParams.get("kind")).toBe("image,document");
		expect(url.searchParams.get("q")).toBe("cv");
		expect(url.searchParams.get("cursor")).toBe("c1");
		expect(page.nextCursor).toBe("c2");
		expect(page.files[0]).toMatchObject({
			id: "f1",
			kind: FileKind.Image,
			createdAt: "2026-10-01T00:00:00Z",
		});
	});

	it("uploads as multipart with the file and its alt", async () => {
		setSession(live());
		const seen = capture(() => json({ data: fileWire }));
		const file = new File(["x"], "a.png", { type: "image/png" });
		const stored = await uploadFile({ file, alt: "an a" });
		const form = seen[0]?.body;
		expect(seen[0]?.method).toBe("POST");
		expect(form).toBeInstanceOf(FormData);
		expect(form instanceof FormData && form.get("alt")).toBe("an a");
		expect(form instanceof FormData && form.get("file")).toBeInstanceOf(
			File,
		);
		expect(stored.url).toBe("http://x/uploads/a.png");
	});

	it("reports a file that is still used as a conflict", async () => {
		setSession(live());
		capture(() =>
			json(
				{
					data: {},
					errors: { code: "Service.File.InUse", message: "in use" },
				},
				409,
			),
		);
		const error = await deleteFile("f1").catch((reason: unknown) => reason);
		expect(error).toBeInstanceOf(ApiError);
		expect(error instanceof ApiError && error.kind).toBe(
			ApiErrorKind.Conflict,
		);
	});
});

describe("gallery frames", () => {
	it("creates a frame from a file id as JSON", async () => {
		setSession(live());
		const seen = capture(() =>
			json({
				data: {
					id: "g1",
					file_id: "f1",
					alt: "",
					project: null,
					tags: ["a"],
					width: 4,
					height: 3,
					image_url: "http://x/a.png",
				},
			}),
		);
		const frame = await createFrame({
			fileId: "f1",
			tags: ["a"],
			projectId: null,
		});
		expect(JSON.parse(String(seen[0]?.body))).toEqual({
			file_id: "f1",
			tags: ["a"],
			project_id: null,
		});
		expect(frame.fileId).toBe("f1");
	});
});
