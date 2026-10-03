import { MotifKind, PostBlockType } from "@/api/types/portfolio/enums";
import type { Post, PostBlock } from "@/api/types/portfolio/post";

/** Words per minute for `readMinutes` (same as config.portfolio.readWordsPerMinute). */
const WORDS_PER_MINUTE = 200;

type RawPost = Omit<Post, "num" | "readMinutes" | "sample">;

// Written from the author's own project work; edit freely.
const rawPosts: RawPost[] = [
	{
		slug: "scalable-game-backend",
		title: "How to build a scalable backend for a game",
		date: "Oct 2026",
		tags: ["Go", "Architecture"],
		kind: MotifKind.Hex,
		excerpt:
			"Sockets, an API, one shared database and a queue. The boring parts that let a game survive launch day.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "I have built game backends in Go and MongoDB for a few years now. The pattern that keeps coming back is not clever. It is a handful of boring decisions made early, so the game can grow without a rewrite.",
			},
			{
				type: PostBlockType.Heading,
				text: "Split the live line from the API",
			},
			{
				type: PostBlockType.Paragraph,
				text: "A game has two kinds of traffic. Players need a live connection that pushes state both ways, and they also make ordinary requests: buy this, claim that, load my profile. Giving each its own server lets you scale and fix them separately.",
			},
			{
				type: PostBlockType.List,
				items: [
					"Socket server: keeps connections open and moves live state",
					"API server: handles requests, shops, missions, rewards",
					"One database both can read and write, so they always agree",
					"A queue for slow work, so a player never waits on it",
				],
			},
			{
				type: PostBlockType.Heading,
				text: "Build it general, not one-off",
			},
			{
				type: PostBlockType.Paragraph,
				text: "The best reuse I ever got was a generic queue. One small type that any service in any project can use, instead of a new queue per feature. Generics make that cheap in Go.",
			},
			{
				type: PostBlockType.Code,
				lang: "go",
				text: "// One queue, every service.\ntype Queue[T any] struct{ jobs chan T }\n\nfunc NewQueue[T any](size, workers int, handle func(T)) *Queue[T] {\n    q := &Queue[T]{jobs: make(chan T, size)}\n    for i := 0; i < workers; i++ {\n        go func() {\n            for job := range q.jobs {\n                handle(job)\n            }\n        }()\n    }\n    return q\n}\n\n// Push blocks when the queue is full: back-pressure, not endless memory.\nfunc (q *Queue[T]) Push(job T) { q.jobs <- job }",
			},
			{
				type: PostBlockType.Quote,
				text: "A full queue should slow the producer down, not eat the server.",
			},
			{ type: PostBlockType.Heading, text: "Read before you rewrite" },
			{
				type: PostBlockType.Paragraph,
				text: "I once inherited five years of backend code written by other people. The first job was not to improve it. It was to understand it well enough to add features, like a new shop system, without fighting it. Only when the old schema stood in the way did a rewrite pay off: a new schema, optimised code, and the old features kept working on top.",
			},
			{ type: PostBlockType.Heading, text: "Measure, then optimise" },
			{
				type: PostBlockType.Paragraph,
				text: "Guessing which part is slow is how weeks disappear. Measure the socket path and the API path separately, fix the one that hurts, and measure again.",
			},
		],
	},
	{
		slug: "smart-contracts-you-can-sleep-next-to",
		title: "Writing smart contracts you can sleep next to",
		date: "Oct 2026",
		tags: ["Solidity", "Security"],
		kind: MotifKind.Moon,
		excerpt:
			"Contracts that move real money cannot be patched at 3 a.m. Habits that help me sleep.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "A game server can be fixed in minutes. A deployed contract mostly cannot. I write the DeFi parts of games on chains like Soneium and Bitkub, so I treat every contract as something I will not get to take back.",
			},
			{ type: PostBlockType.Heading, text: "Habits" },
			{
				type: PostBlockType.List,
				items: [
					"Keep it small: fewer lines, fewer places to hide a bug",
					"Review twice, once as the author and once as an attacker",
					"Test how it breaks, not only how it works",
					"Decide the upgrade path before the first deploy",
					"Make it efficient without trading away safety",
				],
			},
			{
				type: PostBlockType.Heading,
				text: "Update state before you pay",
			},
			{
				type: PostBlockType.Paragraph,
				text: "The oldest trick is still the best. Change your own books first, then move the money, so a caller that re-enters finds nothing left to take.",
			},
			{
				type: PostBlockType.Code,
				lang: "solidity",
				text: 'function claim() external {\n    uint256 amount = rewards[msg.sender];\n    require(amount > 0, "nothing to claim");\n\n    rewards[msg.sender] = 0; // effects first\n    token.safeTransfer(msg.sender, amount); // interaction last\n}',
			},
			{
				type: PostBlockType.Quote,
				text: "If you cannot explain how it could be abused, you have not tested it yet.",
			},
			{ type: PostBlockType.Heading, text: "Test the abuse" },
			{
				type: PostBlockType.Paragraph,
				text: "With NFTs and DeFi in the mix, real value moves. Happy-path tests prove the contract works. Abuse tests prove it is safe: double claims, odd amounts, wrong callers, and the order of calls.",
			},
		],
	},
	{
		slug: "four-thousand-pins-one-smooth-map",
		title: "Four thousand pins, one smooth map",
		date: "Oct 2026",
		tags: ["React", "Maps"],
		kind: MotifKind.Pins,
		excerpt:
			"How a map with 4k+ pins stays smooth: ask for what you can see, cluster it on the client.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "On Estic AI you find a home by talking to an AI, and the map sits next to the chat. Zoomed out, the map holds 4k+ pins. Zoomed in, about 1k+. Drawing all of them at once is the fastest way to make a browser cry.",
			},
			{
				type: PostBlockType.Heading,
				text: "Ask only for what you can see",
			},
			{
				type: PostBlockType.Paragraph,
				text: "The client sends the edges of the current view to the backend, and the backend returns only the pins inside them. Move or zoom the map and the view changes, so the request changes too. The pin count follows the zoom level instead of the size of the database.",
			},
			{
				type: PostBlockType.Code,
				lang: "ts",
				text: '// Ask for the pins inside the current view, nothing else.\nmap.on("moveend", async () => {\n  const b = map.getBounds();\n  const pins = await fetchPins({\n    south: b.getSouth(),\n    west: b.getWest(),\n    north: b.getNorth(),\n    east: b.getEast(),\n  });\n  cluster.clearLayers();\n  cluster.addLayers(pins.map(toMarker));\n});',
			},
			{
				type: PostBlockType.Heading,
				text: "Cluster on the client",
			},
			{
				type: PostBlockType.Paragraph,
				text: "I use Leaflet with a cluster plugin. Pins that sit close together collapse into one numbered marker and split apart as you zoom in. The map stays readable zoomed out and detailed zoomed in, and the browser only draws what a person can actually see.",
			},
			{
				type: PostBlockType.List,
				items: [
					"The backend sends pins for the view, not for the whole country",
					"The client clusters them, so there is one marker per cluster",
					"Zoom out: many pins, grouped. Zoom in: fewer pins, shown one by one",
				],
			},
			{
				type: PostBlockType.Quote,
				text: "The fastest pin to draw is the one you never fetched.",
			},
			{
				type: PostBlockType.Heading,
				text: "The search side is separate",
			},
			{
				type: PostBlockType.Paragraph,
				text: "The map is only half of the product. The backend also works like a search engine, so the AI can turn a sentence like “2-bed near the river” into results. The map just shows what that search returns, in the part of the world you are looking at.",
			},
		],
	},
];

function wordCount(post: RawPost): number {
	const body = post.blocks.reduce((n, block: PostBlock) => {
		const text = "items" in block ? block.items.join(" ") : block.text;
		return n + text.split(/\s+/).length;
	}, 0);
	return body + post.title.split(/\s+/).length;
}

export const posts: Post[] = rawPosts.map((post, i) => ({
	...post,
	num: String(i + 1).padStart(2, "0"),
	readMinutes: Math.max(1, Math.round(wordCount(post) / WORDS_PER_MINUTE)),
	sample: false,
}));
