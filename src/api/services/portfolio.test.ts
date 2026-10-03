import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { ApiError, ApiErrorKind } from "@/api/errors";
import {
	getProfile,
	getProject,
	listGallery,
	listPosts,
} from "@/api/services/portfolio";
import { BlockType } from "@/api/types/portfolio/enums";

type Reply = () => Response | Promise<Response>;

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

/** Replies in order to every fetch; returns the requested URLs. */
function reply(...replies: Reply[]): string[] {
	const urls: string[] = [];
	const fake = (input: URL | RequestInfo) => {
		urls.push(String(input));
		const next = replies[Math.min(urls.length, replies.length) - 1];
		return Promise.resolve(next ? next() : json({ data: null }));
	};
	// Bun's `fetch` type also carries `preconnect`.
	spyOn(globalThis, "fetch").mockImplementation(
		Object.assign(fake, { preconnect: () => undefined }),
	);
	return urls;
}

const failure = async (run: () => Promise<unknown>): Promise<ApiError> => {
	try {
		await run();
	} catch (error) {
		if (error instanceof ApiError) return error;
	}
	throw new Error("expected an ApiError");
};

afterEach(() => spyOn(globalThis, "fetch").mockRestore());

describe("error mapping", () => {
	it("reads the envelope of a 404", async () => {
		reply(() =>
			json(
				{
					data: {},
					errors: {
						code: "Service.Resource.NotFound",
						message: "project not found",
					},
				},
				404,
			),
		);
		const error = await failure(() => getProject("nope"));
		expect(error.kind).toBe(ApiErrorKind.NotFound);
		expect(error.status).toBe(404);
		expect(error.code).toBe("Service.Resource.NotFound");
		expect(error.message).toBe("project not found");
	});

	it("keeps the field violations of a 400", async () => {
		reply(() =>
			json(
				{
					data: {},
					errors: {
						code: "Request.Validation.Invalid",
						message: "invalid cursor",
						violations: {
							cursor: { code: "x", message: "bad cursor" },
						},
					},
				},
				400,
			),
		);
		const error = await failure(() => listGallery({ limit: 6 }));
		expect(error.kind).toBe(ApiErrorKind.Validation);
		expect(error.violations.cursor?.message).toBe("bad cursor");
	});

	it("maps the other statuses", async () => {
		const kinds = new Map([
			[401, ApiErrorKind.Unauthorized],
			[403, ApiErrorKind.Forbidden],
			[409, ApiErrorKind.Conflict],
			[429, ApiErrorKind.RateLimited],
			[500, ApiErrorKind.Server],
			[503, ApiErrorKind.Server],
		]);
		for (const [status, kind] of kinds) {
			reply(() => json({ data: {} }, status));
			expect((await failure(listPosts)).kind).toBe(kind);
		}
	});

	it("survives a non-JSON error page", async () => {
		reply(() => new Response("<html>Bad gateway</html>", { status: 502 }));
		const error = await failure(listPosts);
		expect(error.kind).toBe(ApiErrorKind.Server);
		expect(error.message).toBe("request failed (502)");
	});

	it("reports an unreachable server", async () => {
		reply(() => {
			throw new TypeError("fetch failed");
		});
		expect((await failure(listPosts)).kind).toBe(ApiErrorKind.Network);
	});

	it("reports a timeout", async () => {
		reply(() => {
			throw new DOMException("timed out", "TimeoutError");
		});
		expect((await failure(listPosts)).kind).toBe(ApiErrorKind.Timeout);
	});

	it("rejects a success body that is not the envelope", async () => {
		reply(() => new Response("ok", { status: 200 }));
		expect((await failure(listPosts)).kind).toBe(ApiErrorKind.Invalid);
	});

	it("rejects data that breaks the contract (profile not saved yet)", async () => {
		reply(() => json({ data: null }));
		expect((await failure(getProfile)).kind).toBe(ApiErrorKind.Invalid);
	});
});

describe("mapping", () => {
	it("sends the cursor, tag and limit and maps a frame page", async () => {
		const urls = reply(() =>
			json({
				data: {
					items: [
						{
							id: "f1",
							project: {
								id: "p1",
								slug: "pocket",
								name: "Pocket",
							},
							tags: ["go"],
							width: 640,
							height: 400,
							image_url: "http://x/uploads/f1.webp",
							created_at: "2026-09-03T12:00:00Z",
						},
						{
							id: "f2",
							project: null,
							tags: [],
							width: 1,
							height: 1,
							image_url: "http://x/uploads/f2.webp",
							created_at: "2026-09-03T12:00:00Z",
						},
					],
					next_cursor: "abc",
				},
			}),
		);
		const page = await listGallery({ tag: "go", cursor: "c1", limit: 6 });
		const url = new URL(urls[0] ?? "");
		expect(url.pathname).toBe("/api/v1/gallery/frames");
		expect(url.searchParams.get("tag")).toBe("go");
		expect(url.searchParams.get("cursor")).toBe("c1");
		expect(url.searchParams.get("limit")).toBe("6");
		expect(page.nextCursor).toBe("abc");
		expect(page.frames[0]).toMatchObject({
			projectSlug: "pocket",
			projectName: "Pocket",
			imageUrl: "http://x/uploads/f1.webp",
		});
		expect(page.frames[1]?.projectSlug).toBeNull();
	});

	it("omits an empty cursor", async () => {
		const urls = reply(() =>
			json({ data: { items: [], next_cursor: null } }),
		);
		await listGallery({ cursor: "", limit: 6 });
		expect(new URL(urls[0] ?? "").searchParams.has("cursor")).toBe(false);
	});

	it("formats a note's date and read time", async () => {
		reply(() =>
			json({
				data: {
					notes: [
						{
							id: "n1",
							slug: "a",
							num: "01",
							title: "A",
							published_at: "2026-10-04T00:00:00Z",
							tags: [],
							kind: "radar",
							excerpt: "",
							read_minutes: 3,
							sample: false,
							project: null,
							status: "published",
						},
					],
				},
			}),
		);
		const [note] = await listPosts();
		expect(note?.date).toBe("Oct 2026");
		expect(note?.readMinutes).toBe(3);
	});

	it("turns a lineage document id into a slug, and drops a dangling one", async () => {
		const lineage = (fromId: string) => ({
			type: "lineage",
			params: {
				label: "L",
				from: "Old",
				to: "New",
				text: "",
				from_id: fromId,
			},
		});
		const detail = (blocks: unknown[]) => ({
			data: {
				id: "p2",
				slug: "estic",
				num: "04",
				name: "Estic",
				full: "Estic AI",
				kind: "orbit",
				side: "on-screen",
				tags: [],
				categories: ["platforms"],
				stack: [],
				about: "",
				role: [],
				status: "published",
				order: 4,
				content_version: 1,
				blocks,
			},
		});
		const slugs = { data: { projects: [{ id: "p1", slug: "pocket" }] } };
		reply(
			() => json(detail([lineage("p1")])),
			() => json(slugs),
		);
		const linked = await getProject("estic");
		expect(linked.id).toBe("estic");
		const [block] = linked.blocks;
		expect(block?.type).toBe(BlockType.Lineage);
		expect(block?.type === BlockType.Lineage && block.params.fromId).toBe(
			"pocket",
		);

		reply(
			() => json(detail([lineage("gone")])),
			() => json(slugs),
		);
		const [dangling] = (await getProject("estic")).blocks;
		expect(
			dangling?.type === BlockType.Lineage && dangling.params.fromId,
		).toBeUndefined();
	});
});
