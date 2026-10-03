import { posts } from "@/api/mocks/portfolio/posts";
import { BlockType } from "@/api/types/portfolio/enums";
import type { Block } from "@/api/types/portfolio/block";
import type { Profile } from "@/api/types/portfolio/profile";
import type { Project } from "@/api/types/portfolio/project";
import { CATEGORY_SLUGS } from "./parse";

/** Labels of the seeded `project_categories` (the site filter chips). */
const CATEGORY_LABELS: Record<string, string> = {
	[CATEGORY_SLUGS.games]: "Games",
	[CATEGORY_SLUGS.platforms]: "Platforms & tools",
	[CATEGORY_SLUGS.onChain]: "On-chain",
};

const STATUS_PUBLISHED = "published";

/** The mock notes carry only "Oct 2026"; these instants keep the list in the mock order (newest first). */
const NOTE_DATES = [
	"2026-10-03T00:00:00Z",
	"2026-10-02T00:00:00Z",
	"2026-10-01T00:00:00Z",
];

const snake = (key: string) =>
	key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

/** Every object key of `value`, at any depth, in snake_case (`imageUrl` -> `image_url`). */
export function snakeKeys(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(snakeKeys);
	if (value && typeof value === "object")
		return Object.fromEntries(
			Object.entries(value).map(([key, v]) => [snake(key), snakeKeys(v)]),
		);
	return value;
}

/** A lineage `fromId` is a slug in the mocks; the backend wants an ObjectID, so the seed names it `from_slug` and the CLI resolves it. */
function seedBlock(block: Block): unknown {
	const out = snakeKeys(block);
	if (block.type !== BlockType.Lineage || !block.params.fromId) return out;
	const { type, params } = out as {
		type: string;
		params: Record<string, unknown>;
	};
	const { from_id: fromSlug, ...rest } = params;
	return { type, params: { ...rest, from_slug: fromSlug } };
}

/** Everything `commands content seed` creates, snake_case like the API. */
export function buildSeed(projects: Project[], profile: Profile) {
	return {
		project_categories: Object.entries(CATEGORY_LABELS).map(
			([slug, label]) => ({ slug, label }),
		),
		projects: projects.map((p) => ({
			slug: p.id,
			name: p.name,
			full: p.full,
			kind: p.kind,
			side: p.side,
			tags: p.tags,
			categories: p.categories,
			stack: p.stack,
			about: p.about,
			role: p.role,
			status: STATUS_PUBLISHED,
			blocks: p.blocks.map(seedBlock),
		})),
		notes: posts.map((post, i) => ({
			slug: post.slug,
			title: post.title,
			kind: post.kind,
			tags: post.tags,
			excerpt: post.excerpt,
			status: STATUS_PUBLISHED,
			published_at: NOTE_DATES[i],
			blocks: snakeKeys(post.blocks),
		})),
		profile: snakeKeys(profile),
	};
}
