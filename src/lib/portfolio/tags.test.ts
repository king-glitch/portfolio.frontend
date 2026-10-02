import { expect, test } from "bun:test";
import { posts } from "@/api/mocks/portfolio/posts";
import {
	filterByTag,
	nextPost,
	parseTagParam,
	uniqueTags,
} from "@/lib/portfolio/tags";

test("param: absent or blank is all", () => {
	expect(parseTagParam(null)).toBeUndefined();
	expect(parseTagParam("  ")).toBeUndefined();
	expect(parseTagParam("Go")).toBe("Go");
});

test("tags are unique and cover every post tag", () => {
	const tags = uniqueTags(posts);
	expect(new Set(tags).size).toBe(tags.length);
	for (const p of posts) for (const t of p.tags) expect(tags).toContain(t);
});

test("filter keeps matching posts; unknown tag is empty; undefined is all", () => {
	expect(filterByTag(posts, undefined)).toHaveLength(posts.length);
	expect(filterByTag(posts, "Go").every((p) => p.tags.includes("Go"))).toBe(
		true,
	);
	expect(filterByTag(posts, "nope")).toHaveLength(0);
});

test("next post loops", () => {
	expect(nextPost(posts, posts[0].slug)?.slug).toBe(posts[1].slug);
	expect(nextPost(posts, posts[posts.length - 1].slug)?.slug).toBe(
		posts[0].slug,
	);
	expect(nextPost(posts, "nope")).toBeUndefined();
});
