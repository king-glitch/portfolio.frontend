import type React from "react";
import type { Block } from "@/api/types/portfolio/block";
import type { BlockType, MotifKind } from "@/api/types/portfolio/enums";

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

/** Mutable scroller numbers (px). `pull` is the over-scroll resistance past the end. */
export interface ScrollerState {
	target: number;
	current: number;
	pull: number;
	/** `performance.now()` of the last wheel/key input. */
	lastInput: number;
}

export interface PanelMeta {
	left: number;
	width: number;
	/** Parallax layers (`data-speed`) with their parsed speed. */
	layers: { el: HTMLElement; speed: number }[];
}

type ElementRef<T extends HTMLElement> = React.RefObject<T | null>;

export interface ScrollerOptions {
	viewportRef: ElementRef<HTMLElement>;
	trackRef: ElementRef<HTMLElement>;
	/** Top progress bar (scaleX). */
	barRef: ElementRef<HTMLElement>;
	/** Next-project meter (scaleX). */
	meterRef: ElementRef<HTMLElement>;
	/** Next-project curtain (`translate`), slid away by the pull. */
	curtainRef: ElementRef<HTMLElement>;
	/** The hand-off finished: swap in the next project. */
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

/** What the renderer adds to every block: its 1-based position among non-header blocks and the project's motif. */
export interface BlockExtras {
	index: number;
	projectKind: MotifKind;
}

/** Props of every block component: its params plus the extras it does not already define (the header's own `index` wins). */
export type BlockProps<T extends BlockType> = BlockParams<T> &
	Omit<BlockExtras, keyof BlockParams<T>>;
