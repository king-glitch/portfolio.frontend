import type { ParseKeys } from "i18next";
import { MotifKind } from "@/api/types/portfolio/enums";
import type { ProjectSummary } from "@/api/types/portfolio/project";
import { config } from "@/config";
import { workPath } from "@/lib/routes";
import { CursorLabel } from "@/types/cursor";
import {
	AboutTileKind,
	TileIcon,
	TileTone,
	type TileData,
	type WallBuildContext,
	type WallCell,
	type WallTile,
} from "@/types/about";

interface CellSpec extends WallCell {
	data: (ctx: WallBuildContext) => TileData;
}

const own = (kind: MotifKind, ctx: WallBuildContext) =>
	ctx.projects.find((p) => p.kind === kind);

/** Project art plus the link to its page; no link when the project is missing. */
function projectData(
	kind: MotifKind,
	ctx: WallBuildContext,
	captionKey?: ParseKeys,
): TileData {
	const p: ProjectSummary | undefined = own(kind, ctx);
	return {
		motif: kind,
		caption: p?.name,
		captionKey,
		link: p && {
			to: workPath(p.id),
			labelKey: "about.explore.link.project",
			labelValues: { name: p.name },
			cursor: CursorLabel.Open,
		},
	};
}

const ratio = (n: number, total: number) => n / Math.max(1, total);

/** The 27 tiles of the 10x7 wall (prototype `L`). Data is derived per render. */
export const WALL_CELLS: CellSpec[] = [
	{
		id: "mock-pixel",
		col: 0,
		row: 0,
		cols: 2,
		rows: 2,
		kind: AboutTileKind.Mock,
		data: (c) => projectData(MotifKind.Pixel, c),
	},
	{
		id: "projects",
		col: 2,
		row: 0,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Stat,
		tone: TileTone.Invert,
		data: (c) => ({
			value: String(c.stats.total).padStart(2, "0"),
			captionKey: "about.explore.tile.projects.caption",
		}),
	},
	{
		id: "words",
		col: 4,
		row: 0,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Words,
		data: () => ({}),
	},
	{
		id: "socket",
		col: 6,
		row: 0,
		cols: 1,
		rows: 1,
		kind: AboutTileKind.Icon,
		data: () => ({
			icon: TileIcon.Socket,
			iconTone: TileTone.Invert,
			captionKey: "about.explore.tile.socket.caption",
		}),
	},
	{
		id: "timeline",
		col: 7,
		row: 0,
		cols: 3,
		rows: 1,
		kind: AboutTileKind.Timeline,
		data: (c) => ({
			bars: c.stats.timeline,
			captionKey: "about.explore.tile.timeline.caption",
		}),
	},
	{
		id: "go",
		col: 2,
		row: 1,
		cols: 1,
		rows: 1,
		kind: AboutTileKind.Mono,
		data: () => ({
			valueKey: "about.explore.tile.go.value",
			captionKey: "about.explore.tile.go.caption",
		}),
	},
	{
		id: "solidity",
		col: 3,
		row: 1,
		cols: 1,
		rows: 1,
		kind: AboutTileKind.Mono,
		data: () => ({
			valueKey: "about.explore.tile.solidity.value",
			captionKey: "about.explore.tile.solidity.caption",
		}),
	},
	{
		id: "chat",
		col: 4,
		row: 1,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Chat,
		data: () => ({ captionKey: "about.explore.tile.chat.caption" }),
	},
	{
		id: "motif-radar",
		col: 6,
		row: 1,
		cols: 2,
		rows: 2,
		kind: AboutTileKind.Motif,
		data: (c) =>
			projectData(
				MotifKind.Radar,
				c,
				"about.explore.tile.projects.captions.radar",
			),
	},
	{
		id: "languages",
		col: 8,
		row: 1,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Chips,
		data: (c) => ({
			items: c.stats.languages,
			captionKey: "about.explore.tile.languages.count",
			captionValues: { count: c.stats.languages.length },
		}),
	},
	{
		id: "chain",
		col: 8,
		row: 2,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Donut,
		data: (c) => ({
			ratio: ratio(c.stats.onChain, c.stats.total),
			captionKey: "about.explore.tile.chain.caption",
			captionValues: { chain: c.stats.onChain, total: c.stats.total },
		}),
	},
	{
		id: "hero",
		col: config.about.wall.hero.col,
		row: config.about.wall.hero.row,
		cols: config.about.wall.hero.w,
		rows: config.about.wall.hero.h,
		kind: AboutTileKind.Hero,
		tone: TileTone.Invert,
		data: (c) => ({ title: c.profile.name.split(" ")[0] }),
	},
	{
		id: "pins",
		col: 0,
		row: 2,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Stat,
		data: () => ({
			art: MotifKind.Pins,
			valueKey: "about.explore.tile.pins.value",
			captionKey: "about.explore.tile.pins.caption",
		}),
	},
	{
		id: "production",
		col: 2,
		row: 2,
		cols: 1,
		rows: 2,
		kind: AboutTileKind.Tall,
		data: (c) => ({
			eyebrowKey: "about.explore.tile.production.eyebrow",
			value: String(c.stats.yearsInProduction),
			unitKey: "about.explore.tile.production.unit",
			captionKey: "about.explore.tile.production.caption",
		}),
	},
	{
		id: "mock-hex",
		col: 0,
		row: 3,
		cols: 2,
		rows: 2,
		kind: AboutTileKind.Mock,
		data: (c) => projectData(MotifKind.Hex, c),
	},
	{
		id: "education",
		col: 6,
		row: 3,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Icon,
		data: (c) => ({
			icon: TileIcon.Education,
			captionKey: "about.explore.tile.education.caption",
			captionValues: { school: c.profile.education[0]?.title ?? "" },
		}),
	},
	{
		id: "habits",
		col: 8,
		row: 3,
		cols: 2,
		rows: 2,
		kind: AboutTileKind.Habits,
		tone: TileTone.Invert,
		data: () => ({}),
	},
	{
		id: "games",
		col: 2,
		row: 4,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Icon,
		data: (c) => ({
			icon: TileIcon.Gamepad,
			iconTone: TileTone.Invert,
			captionKey: "about.explore.tile.games.caption",
			captionValues: { count: c.stats.games },
		}),
	},
	{
		id: "mock-pins",
		col: 4,
		row: 4,
		cols: 2,
		rows: 2,
		kind: AboutTileKind.Mock,
		data: (c) =>
			projectData(
				MotifKind.Pins,
				c,
				"about.explore.tile.projects.captions.pins-map",
			),
	},
	{
		id: "tools",
		col: 6,
		row: 4,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Chips,
		data: (c) => ({
			items: c.stats.tools.slice(0, 6),
			captionKey: "about.explore.tile.tools.caption",
		}),
	},
	{
		id: "bars",
		col: 0,
		row: 5,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Bars,
		data: (c) => ({
			bars: c.stats.words.map((w) => ({
				label: w.word,
				left: 0,
				width: w.pct,
			})),
			captionKey: "about.explore.tile.bars.caption",
		}),
	},
	{
		id: "soft",
		col: 2,
		row: 5,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Soft,
		data: (c) => ({ items: c.stats.soft }),
	},
	{
		id: "motif-orbit",
		col: 6,
		row: 5,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Motif,
		data: (c) =>
			projectData(
				MotifKind.Orbit,
				c,
				"about.explore.tile.projects.captions.orbit",
			),
	},
	{
		id: "notes",
		col: 8,
		row: 5,
		cols: 2,
		rows: 1,
		kind: AboutTileKind.Icon,
		data: (c) => ({
			icon: TileIcon.Notes,
			captionKey:
				c.notesCount === null
					? "about.explore.tile.notes.fallback"
					: "about.explore.tile.notes.count",
			captionValues: { count: c.notesCount ?? 0 },
			link: {
				to: config.routes.notes,
				labelKey: "about.explore.link.notes",
				cursor: CursorLabel.Read,
			},
		}),
	},
	{
		id: "hello",
		col: 0,
		row: 6,
		cols: 3,
		rows: 1,
		kind: AboutTileKind.Hello,
		tone: TileTone.Invert,
		data: (c) => ({ contact: c.profile.contact }),
	},
	{
		id: "behind",
		col: 3,
		row: 6,
		cols: 4,
		rows: 1,
		kind: AboutTileKind.Donut,
		data: (c) => ({
			ratio: ratio(c.stats.behind, c.stats.total),
			captionKey: "about.explore.tile.behind.caption",
		}),
	},
	{
		id: "motif-moon",
		col: 7,
		row: 6,
		cols: 3,
		rows: 1,
		kind: AboutTileKind.Motif,
		data: (c) => projectData(MotifKind.Moon, c),
	},
];

export function buildWallTiles(ctx: WallBuildContext): WallTile[] {
	return WALL_CELLS.map(({ data, tone, ...cell }) => ({
		...cell,
		tone: tone ?? TileTone.Card,
		data: data(ctx),
	}));
}
