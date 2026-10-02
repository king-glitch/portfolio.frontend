import type { MotifKind, PostBlockType } from "@/api/types/portfolio/enums";

export type PostBlock =
	| {
			type:
				| PostBlockType.Paragraph
				| PostBlockType.Heading
				| PostBlockType.Quote
				| PostBlockType.Callout;
			text: string;
	  }
	| { type: PostBlockType.List; items: string[] }
	| { type: PostBlockType.Code; lang: string; text: string };

export interface PostSummary {
	slug: string;
	num: string;
	title: string;
	date: string;
	tags: string[];
	kind: MotifKind;
	excerpt: string;
	readMinutes: number;
	sample: boolean;
}

export interface Post extends PostSummary {
	blocks: PostBlock[];
}
