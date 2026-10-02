import type { ParseKeys } from "i18next";
import { MockScreen, MotifKind } from "@/api/types/portfolio/enums";

interface MockMeta {
	phone: boolean;
	/** Decorative text in the fake browser bar (not UI copy). */
	url: string;
	labelKey: ParseKeys;
}

type ScreenMeta = Record<MockScreen, MockMeta>;

const same = (meta: MockMeta): ScreenMeta => ({
	[MockScreen.Main]: meta,
	[MockScreen.Alt]: meta,
});

/** Device, browser-bar text and aria label per kind and screen (design/Mock.dc.html). */
const MOCK_META: Record<MotifKind, ScreenMeta> = {
	[MotifKind.Radar]: same({
		phone: false,
		url: "aads.local / console",
		labelKey: "common.art.mock.radar.label",
	}),
	[MotifKind.Moon]: same({
		phone: false,
		url: "morningmoon / village",
		labelKey: "common.art.mock.moon.label",
	}),
	[MotifKind.Orbit]: same({
		phone: false,
		url: "evermoon / quests",
		labelKey: "common.art.mock.orbit.label",
	}),
	[MotifKind.Hex]: {
		[MockScreen.Main]: {
			phone: false,
			url: "metalvalley / capture",
			labelKey: "common.art.mock.hex.main.label",
		},
		[MockScreen.Alt]: {
			phone: false,
			url: "metalvalley / bridge",
			labelKey: "common.art.mock.hex.alt.label",
		},
	},
	[MotifKind.Pins]: {
		[MockScreen.Main]: {
			phone: false,
			url: "estic.ai / search",
			labelKey: "common.art.mock.pins.main.label",
		},
		[MockScreen.Alt]: {
			phone: true,
			url: "estic.ai / search",
			labelKey: "common.art.mock.pins.alt.label",
		},
	},
	[MotifKind.Pixel]: {
		[MockScreen.Main]: {
			phone: true,
			url: "",
			labelKey: "common.art.mock.pixel.main.label",
		},
		[MockScreen.Alt]: {
			phone: true,
			url: "",
			labelKey: "common.art.mock.pixel.alt.label",
		},
	},
};

export function mockMeta(kind: MotifKind, screen: MockScreen): MockMeta {
	return MOCK_META[kind][screen];
}
