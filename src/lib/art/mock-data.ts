import { createRng } from "@/lib/art/rng";

/**
 * All screen mock datasets, drawn from ONE seed-7 sequence in the prototype's
 * order (design/Mock.dc.html renderVals), so every kind looks exactly like the
 * prototype. Computed once at module load.
 */
const rnd = createRng(7);
const pad2 = (n: number) => String(n).padStart(2, "0");

function hexPoints(cx: number, cy: number, R: number): string {
	const pts: string[] = [];
	for (let k = 0; k < 6; k++) {
		const a = (Math.PI / 180) * (60 * k - 30);
		pts.push(
			`${(cx + R * 0.9 * Math.cos(a)).toFixed(1)},${(cy + R * 0.9 * Math.sin(a)).toFixed(1)}`,
		);
	}
	return pts.join(" ");
}

export interface MockTrack {
	y: number;
	label: string;
	w: number;
	enemy: boolean;
	bgop: number;
}
const tracks: MockTrack[] = [];
for (let i = 0; i < 9; i++) {
	tracks.push({
		y: 60 + i * 36,
		label: `TRK 0${17 + i * 3}`,
		w: 40 + Math.round(rnd() * 60),
		enemy: i === 1 || i === 6,
		bgop: i === 1 ? 0.14 : 0.04,
	});
}

export interface MockPlot {
	x: number;
	y: number;
	op: number;
	sprout: boolean;
	fruit: boolean;
	leaf: string;
}
const plots: MockPlot[] = [];
for (let r = 0; r < 4; r++) {
	for (let c = 0; c < 6; c++) {
		const x = 16 + c * 66;
		const y = 76 + r * 66;
		const v = rnd();
		plots.push({
			x,
			y,
			op: v < 0.3 ? 0.22 : 0.08,
			sprout: v >= 0.3 && v < 0.7,
			fruit: v >= 0.7,
			leaf: `M${x + 27} ${y + 40} L${x + 27} ${y + 22} C ${x + 34} ${y + 14}, ${x + 42} ${y + 18}, ${x + 40} ${y + 26}`,
		});
	}
}

export interface MockShopItem {
	y: number;
	name: string;
	price: string;
}
const shop: MockShopItem[] = [
	"Moon seeds",
	"Watering can",
	"Golden hoe",
	"Barn upgrade",
].map((name, i) => ({ y: 82 + i * 60, name, price: `${(i + 1) * 40}` }));

export interface MockHexCell {
	pts: string;
	filled: boolean;
	op: number;
}
const hexMap: MockHexCell[] = [];
for (let r = 0; r < 6; r++) {
	for (let c = 0; c < 4; c++) {
		const R = 18;
		const w = Math.sqrt(3) * R;
		const cx = 30 + c * w + (r % 2 ? w / 2 : 0);
		const cy = 52 + r * R * 1.5;
		const v = rnd();
		hexMap.push({
			pts: hexPoints(cx, cy, R),
			filled: v < 0.15,
			op: v < 0.15 ? 0.85 : 0.3,
		});
	}
}

export interface MockStat {
	name: string;
	y: number;
	w: number;
}
const stats: MockStat[] = [
	["Power", 0.78],
	["Speed", 0.52],
	["Bond", 0.3],
].map(([name, value], i) => ({
	name: String(name),
	y: 112 + i * 34,
	w: Math.round(122 * Number(value)),
}));

const party = [0, 1, 2, 3].map((i) => ({ x: 16 + i * 76, filled: i === 0 }));

export interface MockBridgeRow {
	y: number;
	a: string;
	b: string;
	opL: number;
	opR: number;
}
const bridgeRows: MockBridgeRow[] = [
	"Mech core",
	"Arm module",
	"Scanner",
	"Fuel cell",
].map((name, i) => ({
	y: 146 + i * 36,
	a: name,
	b: i < 2 ? `${name} (NFT)` : "—",
	opL: i === 1 ? 0.18 : 0.06,
	opR: i < 2 ? 0.14 : 0.04,
}));

const nfts = ["#0412", "#0077", "#1290", "#0008", "#0333"].map((n, i) => ({
	x: 24 + i * 120,
	name: `MECH ${n}`,
	filled: i === 0,
}));

export interface MockQuest {
	x: number;
	y: number;
	filled: boolean;
	xp: string;
	title: string;
	pw: number;
}
const quests: MockQuest[] = [
	"Follow on X",
	"Join Discord",
	"Invite 3 friends",
	"Daily login",
	"Share a clip",
	"Monthly quest",
].map((title, i) => {
	const col = i % 3;
	const row = Math.floor(i / 3);
	return {
		x: 24 + col * 146,
		y: 88 + row * 152,
		filled: i === 0,
		xp: `+${50 + i * 25} XP`,
		title,
		pw: Math.round(110 * (0.2 + rnd() * 0.8)),
	};
});

const board = Array.from({ length: 9 }, (_, i) => ({
	n: pad2(i + 1),
	y: 140 + i * 28,
	first: i === 0,
	w: Math.round(90 - i * 7),
}));

export interface MockBubble {
	x: number;
	y: number;
	w: number;
	h: number;
	filled: boolean;
	lw1: number;
	lw2: number;
}
function bubbles(
	rows: [number, number][],
	startY: number,
	h: number,
	gap: number,
	width: number,
	padX: number,
	padW: number,
	ratio: number,
): MockBubble[] {
	const out: MockBubble[] = [];
	let y = startY;
	for (const [side, w] of rows) {
		const x = side ? width - w : padX;
		out.push({
			x,
			y,
			w,
			h,
			filled: side === 1,
			lw1: w - padW,
			lw2: Math.round((w - padW) * ratio),
		});
		y += h + gap;
	}
	return out;
}
const chat = bubbles(
	[
		[0, 140],
		[1, 120],
		[0, 160],
		[1, 100],
		[0, 150],
	],
	44,
	34,
	14,
	188,
	12,
	24,
	0.6,
);

export interface MockDot {
	x: string;
	y: string;
	r: string;
	op: string;
}
const dots: MockDot[] = [];
const dotCenters = [
	[300, 150],
	[520, 120],
	[400, 300],
	[580, 300],
];
for (let i = 0; i < 260; i++) {
	const c = dotCenters[i % 4] ?? [0, 0];
	const x = (c[0] ?? 0) + ((rnd() + rnd() + rnd()) / 3 - 0.5) * 200;
	const y = (c[1] ?? 0) + ((rnd() + rnd() + rnd()) / 3 - 0.5) * 140;
	if (x > 206 && x < 636 && y > 32 && y < 396) {
		dots.push({
			x: x.toFixed(1),
			y: y.toFixed(1),
			r: (0.8 + rnd()).toFixed(2),
			op: (0.25 + rnd() * 0.5).toFixed(2),
		});
	}
}

const clusters = [
	[300, 150, 22, "128"],
	[520, 120, 18, "64"],
	[400, 300, 16, "41"],
	[580, 300, 14, "17"],
].map(([x, y, r, n]) => ({
	x: Number(x),
	y: Number(y),
	r: Number(r),
	n: String(n),
}));

const resources = ["◎ 1,240", "✦ 32", "♥ 5"].map((t, i) => ({
	x: 22 + i * 88,
	t,
	filled: i === 0,
}));

export interface MockPixelPlot {
	x: number;
	y: number;
	op: number;
	fruit: boolean;
}
const pixelPlots: MockPixelPlot[] = [];
for (let r = 0; r < 5; r++) {
	for (let c = 0; c < 4; c++) {
		const v = rnd();
		pixelPlots.push({
			x: 22 + c * 67,
			y: 172 + r * 67,
			op: v < 0.35 ? 0.24 : 0.08,
			fruit: v > 0.6,
		});
	}
}

const tabs = ["Farm", "Shop", "Missions", "Me"].map((t, i) => ({
	x: 46 + i * 64,
	t,
	op: i === 0 ? 1 : 0.4,
}));

export interface MockMission {
	y: number;
	t: string;
	pw: number;
	c: string;
	done: boolean;
}
const missions: MockMission[] = [
	"Harvest 20 carrots",
	"Visit the shop",
	"Water 10 plots",
	"Sell 5 crops",
	"Log in 3 days",
	"Upgrade the barn",
].map((t, i) => {
	const done = i === 1 || i === 4;
	return {
		y: 124 + i * 72,
		t,
		pw: done ? 150 : Math.round(150 * (0.15 + rnd() * 0.7)),
		c: done ? "Claim" : "Go",
		done,
	};
});

const phoneChat = bubbles(
	[
		[1, 180],
		[0, 220],
		[1, 140],
		[0, 200],
	],
	104,
	46,
	8,
	280,
	20,
	30,
	0.55,
);

export const mockData = {
	tracks,
	plots,
	shop,
	hexMap,
	stats,
	party,
	bridgeRows,
	nfts,
	quests,
	board,
	chat,
	dots,
	clusters,
	resources,
	pixelPlots,
	tabs,
	missions,
	phoneChat,
};
