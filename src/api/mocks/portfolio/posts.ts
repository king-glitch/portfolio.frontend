import { MotifKind, PostBlockType } from "@/api/types/portfolio/enums";
import type { Post, PostBlock } from "@/api/types/portfolio/post";

/** Words per minute for `readMinutes` (same as config.portfolio.readWordsPerMinute). */
const WORDS_PER_MINUTE = 200;

type RawPost = Omit<Post, "num" | "readMinutes" | "sample">;

// Sample posts to show the layouts, hand-ported from design/me-data.js POSTS. Replace with real writing.
const rawPosts: RawPost[] = [
	{
		slug: "socket-server-state-machine",
		title: "Your socket server is a state machine",
		date: "Sep 2026",
		tags: ["Sockets", "Go"],
		kind: MotifKind.Radar,
		excerpt:
			"Connections are not “on” or “off”. Treat every one as a small state machine and most real-time bugs stop being mysterious.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "Most real-time bugs I have chased were not in the business logic. They lived in the gap between “the socket is open” and “this player can actually receive state”. Naming those states explicitly is the cheapest fix there is.",
			},
			{ type: PostBlockType.Heading, text: "Four states, not two" },
			{
				type: PostBlockType.List,
				items: [
					"Connecting — handshake done, not authenticated yet",
					"Ready — authenticated, subscribed, receiving state",
					"Draining — server is shutting down or the client is slow",
					"Closed — resources released, nothing else may write",
				],
			},
			{
				type: PostBlockType.Paragraph,
				text: "Once those states exist, every write path can ask one question first: am I allowed to send in this state? Draining connections get a final snapshot and nothing else. Closed connections never get anything.",
			},
			{
				type: PostBlockType.Code,
				lang: "go",
				text: "// Keep the read deadline moving with every pong.\nconn.SetReadDeadline(time.Now().Add(pongWait))\nconn.SetPongHandler(func(string) error {\n    return conn.SetReadDeadline(time.Now().Add(pongWait))\n})\n\n// Never block the hub on one slow client.\nselect {\ncase c.send <- msg:\ndefault:\n    c.setState(Draining) // slow consumer: stop feeding it\n}",
			},
			{
				type: PostBlockType.Quote,
				text: "A slow client should cost you one connection, never the whole room.",
			},
			{ type: PostBlockType.Heading, text: "Heartbeats are a contract" },
			{
				type: PostBlockType.Paragraph,
				text: "Pick a ping interval, a pong deadline and stick to them on both sides. When the deadline passes, move the connection to Closed and let the client reconnect. Guessing whether a silent socket is “probably fine” is how ghost players happen.",
			},
			{
				type: PostBlockType.Callout,
				text: "Sample post — replace this with your own writing.",
			},
		],
	},
	{
		slug: "rewriting-a-live-backend",
		title: "Rewriting a live game backend without stopping the game",
		date: "Aug 2026",
		tags: ["Go", "MongoDB", "Architecture"],
		kind: MotifKind.Pixel,
		excerpt:
			"Notes on moving a running game to a new server architecture: one route at a time, with a way back at every step.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "A rewrite is easy to start and hard to land. The game keeps running, players keep buying things, and the old system keeps being the source of truth until the day it is not.",
			},
			{ type: PostBlockType.Heading, text: "Move routes, not the world" },
			{
				type: PostBlockType.Paragraph,
				text: "Put a thin router in front of both systems and move one feature at a time: the shop, then missions, then the rest. Each move is small enough to reason about and small enough to roll back.",
			},
			{
				type: PostBlockType.List,
				items: [
					"Shadow-read: call the new service, compare results, still return the old one",
					"Flip: return the new result behind a flag",
					"Clean up: delete the old path once the flag has been boring for a while",
				],
			},
			{
				type: PostBlockType.Code,
				lang: "go",
				text: 'func (r *Router) Shop(ctx context.Context, req ShopReq) (ShopRes, error) {\n    if !r.flags.On(ctx, "shop_v2") {\n        return r.legacy.Shop(ctx, req)\n    }\n    return r.v2.Shop(ctx, req)\n}',
			},
			{
				type: PostBlockType.Quote,
				text: "If you cannot turn it off in a minute, you have not shipped it yet.",
			},
			{
				type: PostBlockType.Callout,
				text: "Sample post — replace this with your own writing.",
			},
		],
	},
	{
		slug: "reading-solidity-like-an-attacker",
		title: "Reading your own Solidity like an attacker",
		date: "Jul 2026",
		tags: ["Solidity", "Security"],
		kind: MotifKind.Hex,
		excerpt:
			"A short checklist I run before a contract leaves my machine — because on-chain, there is no hotfix.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "Contracts that hold game items or tokens get read by people who are looking for exactly one mistake. It helps to read them that way first.",
			},
			{ type: PostBlockType.Heading, text: "The checklist" },
			{
				type: PostBlockType.List,
				items: [
					"Who can call this, and what stops everyone else?",
					"Does any external call happen before state is updated?",
					"What happens at zero, at max, and at max + 1?",
					"Is every important change visible as an event?",
				],
			},
			{
				type: PostBlockType.Code,
				lang: "solidity",
				text: 'function withdraw(uint256 amount) external nonReentrant {\n    require(balances[msg.sender] >= amount, "balance");\n    balances[msg.sender] -= amount;      // effects first\n    (bool ok, ) = msg.sender.call{value: amount}("");\n    require(ok, "transfer");             // interaction last\n    emit Withdrawn(msg.sender, amount);\n}',
			},
			{
				type: PostBlockType.Quote,
				text: "Checks, effects, interactions — in that order, every time.",
			},
			{
				type: PostBlockType.Callout,
				text: "Sample post — replace this with your own writing.",
			},
		],
	},
	{
		slug: "four-thousand-pins",
		title: "Four thousand pins, one smooth map",
		date: "Jun 2026",
		tags: ["Frontend", "Performance"],
		kind: MotifKind.Pins,
		excerpt:
			"The map does not need to draw every pin. It needs to draw the pins you can see, at the size you can see them.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "Thousands of markers on one map is where a smooth product starts to stutter. The fix is rarely clever; it is mostly about doing less work per frame.",
			},
			{ type: PostBlockType.Heading, text: "Three habits" },
			{
				type: PostBlockType.List,
				items: [
					"Cull: only render pins inside the viewport plus a small margin",
					"Cluster: merge nearby pins when zoomed out",
					"Debounce: recompute on move-end, not on every pixel of a drag",
				],
			},
			{
				type: PostBlockType.Code,
				lang: "ts",
				text: "const visible = pins.filter((p) =>\n  p.lat <= bounds.north && p.lat >= bounds.south &&\n  p.lng <= bounds.east  && p.lng >= bounds.west\n);\nrender(cluster(visible, zoom));",
			},
			{
				type: PostBlockType.Callout,
				text: "Sample post — replace this with your own writing.",
			},
		],
	},
	{
		slug: "binary-protocols-human-screens",
		title: "Binary protocols, human screens",
		date: "May 2026",
		tags: ["Protocols", "Go"],
		kind: MotifKind.Orbit,
		excerpt:
			"Turning a stream of fixed-length frames into something an operator can read at a glance.",
		blocks: [
			{
				type: PostBlockType.Paragraph,
				text: "Machine protocols are designed to be compact, not readable. The work is in the translation layer: split the stream into frames, validate them, and turn fields into words a person can act on.",
			},
			{
				type: PostBlockType.Code,
				lang: "go",
				text: "for {\n    if _, err := io.ReadFull(r, frame[:]); err != nil {\n        return err\n    }\n    msg, err := decode(frame)\n    if err != nil {\n        metrics.BadFrame.Inc()\n        continue // never let one bad frame stop the stream\n    }\n    out <- msg\n}",
			},
			{
				type: PostBlockType.Quote,
				text: "Validate at the edge, so everything downstream can be boring.",
			},
			{
				type: PostBlockType.Callout,
				text: "Sample post — replace this with your own writing.",
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
	sample: true,
}));
