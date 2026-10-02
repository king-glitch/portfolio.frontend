import { expect, test } from "bun:test";
import { config } from "@/config";
import {
	feedScroll,
	initialScroller,
	parallaxOffset,
	pullRatio,
	stepScroller,
	wheelDelta,
} from "@/lib/motion/scroller";

const cfg = config.work.scroller;
const atEnd = { ...initialScroller(), target: 1000, current: 1000 };
