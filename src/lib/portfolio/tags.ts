import { z } from "zod";
import type { PostSummary } from "@/api/types/portfolio/post";

const tagParam = z.string().trim().min(1);

/** `?tag=` value to a tag; absent or blank means "all" (undefined). */
export function parseTagParam(raw: string | null): string | undefined {
	const parsed = tagParam.safeParse(raw);
	return parsed.success ? parsed.data : undefined;
}

/** Unique tags in first-seen order. Always pass the UNFILTERED list. */
export function uniqueTags(posts: PostSummary[]): string[] {
	return [...new Set(posts.flatMap((p) => p.tags))];
}

export function filterByTag(
	posts: PostSummary[],
	tag: string | undefined,
): PostSummary[] {
	return tag === undefined
		? posts
		: posts.filter((p) => p.tags.includes(tag));
}

/** Next post in list order, wrapping; undefined for an empty list or unknown slug. */
export function nextPost(
	posts: PostSummary[],
	slug: string,
): PostSummary | undefined {
	const i = posts.findIndex((p) => p.slug === slug);
	return i < 0 ? undefined : posts[(i + 1) % posts.length];
}
