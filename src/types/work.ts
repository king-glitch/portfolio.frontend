import type React from "react";
import type { Block } from "@/api/types/portfolio/block";
import type { BlockType } from "@/api/types/portfolio/enums";
import type { Project } from "@/api/types/portfolio/project";

export enum PanelWidth {
	Full = "full",
	Wide = "wide",
	Card = "card",
	Auto = "auto",
}

export enum PanelTone {
	Default = "default",
	Invert = "invert",
	Card = "card",
}

/** Mutable scroller numbers (px). */
export interface ScrollerState {
	target: number;
	current: number;
	/** `performance.now()` of the last wheel/key input. */
	lastInput: number;
}

export interface PanelMeta {
	left: number;
	width: number;
	/** Parallax layers (`data-speed`): parsed speed, centre x of their frame within the track, max shift (px). */
	layers: { el: HTMLElement; speed: number; center: number; limit: number }[];
}

type ElementRef<T extends HTMLElement> = React.RefObject<T | null>;

export interface ScrollerOptions {
	viewportRef: ElementRef<HTMLElement>;
	trackRef: ElementRef<HTMLElement>;
	/** Top progress bar (scaleX). */
	barRef: ElementRef<HTMLElement>;
	/** The next project's first panel, past the end of the track (pushed in on hand-off). */
	nextRef: ElementRef<HTMLElement>;
	/** Next-project cover; the engine writes `--pull` (0..1) on it for the progress UI. */
	coverRef: ElementRef<HTMLElement>;
	/** Percentage readout of the pull (textContent). */
	percentRef: ElementRef<HTMLElement>;
	/** The push started: the page may fade its chrome. */
	onPushStart: () => void;
	/** The push finished: swap in the next project. */
	onThreshold: () => void;
	/** Escape key: close the project. */
	onEscape: () => void;
}

export enum FeatureCellTone {
	Hero = "hero",
	Muted = "muted",
	Card = "card",
}

type BlockParamsMap = { [B in Block as B["type"]]: B["params"] };

/** `params` of one block type. */
export type BlockParams<T extends BlockType> = BlockParamsMap[T];

/** What the renderer adds to every block: its 1-based position among non-header blocks and its project. */
export interface BlockExtras {
	index: number;
	project: Project;
}

/** Props of every block component: its params plus the extras. */
export type BlockProps<T extends BlockType> = BlockParams<T> & BlockExtras;
